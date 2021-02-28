import React, { useState, useEffect, useRef, createRef } from "react";
import { Text, View, StyleSheet, Button, Dimensions, ImagePropTypes } from "react-native";
import Constants from "expo-constants";

// files
import * as fs from 'expo-file-system';

// camera
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import Svg, { Circle, Rect, G, Line} from 'react-native-svg';
import { Camera } from "expo-camera";

// tensorflow
import * as tf from "@tensorflow/tfjs";
import * as posenet from "@tensorflow-models/posenet";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as knn from "@tensorflow-models/knn-classifier";

// canvas
import Canvas, { Path2D } from "react-native-canvas";
import { tensor, Tensor3D } from "@tensorflow/tfjs";
import { PosenetInput } from "@tensorflow-models/posenet/dist/types";

import loadModel, {exercises} from "./ClassModelLoader";


interface IProps {
  exercise: number
}


interface IState {
  running: boolean,
  frameworkReady: boolean,
  cameraReady: boolean,
  posenetModel: posenet.PoseNet | null,
  imageAsTensors: IterableIterator<Tensor3D> | null,
  canvas: any,
  ctx: any,
  classifier: knn.KNNClassifier | null,
  debugText: string,
  learning: number,
  pose?: posenet.Pose,
  rafId: number
}


// performance hacks (Platform dependent)
const textureDims = { width: 1600, height: 1200 };
const tensorDims = { width: 152, height: 200 };
const TensorCamera = cameraWithTensors(Camera);


class MagicCamera extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    
    this.state = {
      frameworkReady: false,
      cameraReady: false,
      running: false,
      posenetModel: null,
      imageAsTensors: null,
      canvas: null,
      ctx: null,
      classifier: null,
      pose: null,
      learning: 0,
      rafId: 0,
      debugText: "Loading..."
    }
  }


  setFrameworkReady = (v: boolean) => {
    this.setState({ frameworkReady: v }, () => {
      if (v && this.state.cameraReady) {
        this.start();
      } else {
        this.halt();
      }
    });
  }


  setCameraReady = (v: boolean) => {
    this.setState({ cameraReady: v }, () => {
      if (v && this.state.frameworkReady) {
        this.start();
      } else {
        this.halt();
      }
    });
  }


  print = (s) => {
    this.setState({ debugText: s });
  }


  componentDidMount() {
    (async () => {

      const { status } = await Camera.requestPermissionsAsync();
      console.log(`permissions: ${status}`);

      // we must always wait for the Tensorflow API to be ready before any TF operation...
      await tf.ready();
      console.log("TF is ready");

      this.setState({
        posenetModel: await posenet.load({
          architecture: "MobileNetV1",
          outputStride: 16,
          multiplier: 0.5,
          inputResolution: tensorDims,
          quantBytes: 2
        }).then(model => {
          console.log("Posenet model loaded");
          return model;
        }),
        classifier: knn.create(),
      }, () => {
        loadModel(this.state.classifier, this.props.exercise);
      });

      this.setFrameworkReady(true);
    })();
  }


  getPrediction = async (tensor: PosenetInput) => {
    if (!tensor || !this.state.posenetModel) {
      console.log("posenetModel or tensor undefined");
      return;
    }

    // TENSORFLOW MAGIC HAPPENS HERE!
    const pose = await this.state.posenetModel.estimateSinglePose(tensor, { flipHorizontal: true })
    if (!pose) {
      console.log("pose estimation error");
      return;
    }

    this.setState({pose});

    let tens = tf.tensor2d(pose.keypoints.map(x => [x.score, x.position.x, x.position.y]));
    let str = "learning...";
    if (this.state.learning > 0) {
      if (this.state.learning % 2 == 1) {
        this.state.classifier?.addExample(tens, this.state.learning); // int learning will be the label for our class
      } else {
        str = JSON.stringify(await this.state.classifier?.predictClass(tens, 5));
      }
    }
    tens.dispose();
    let numTensors = tf.memory().numTensors;

    this.print(`Tensors: ${numTensors}\nLearning: ${this.state.learning} \nPose: ${str}`);
  }

  renderPose() {
    const MIN_KEYPOINT_SCORE = 0.2;
    const {pose} = this.state;
    if (pose != null && this.state.running) {
      const keypoints = pose.keypoints
        .filter(k => k.score > MIN_KEYPOINT_SCORE)
        .map((k,i) => {
          return <Circle
            key={`skeletonkp_${i}`}
            cx={k.position.x}
            cy={k.position.y}
            r='2'
            strokeWidth='0'
            fill='red'
          />;
        });

      const adjacentKeypoints =
        posenet.getAdjacentKeyPoints(pose.keypoints, MIN_KEYPOINT_SCORE);

      const skeleton = adjacentKeypoints.map(([from, to], i) => {
        return <Line
          key={`skeletonls_${i}`}
          x1={from.position.x}
          y1={from.position.y}
          x2={to.position.x}
          y2={to.position.y}
          stroke='green'
          strokeWidth='1'
        />;
      });

      return <Svg height='100%' width='100%'
        viewBox={`0 0 ${tensorDims.width} ${tensorDims.height}`}>
          {skeleton}
          {keypoints}
        </Svg>;
    } else {
      return null;
    }
  }


  start = () => {
    console.log("starting loop");
    this.loop();
    this.setState({ running: true });
  }


  halt = () => {
    cancelAnimationFrame(this.state.rafId);
    console.log(`stopped!`);
    this.setState({ running: false });
  }


  loop = async () => {
    const nextImageTensor = this.state.imageAsTensors?.next().value;
    if (nextImageTensor) {
      this.getPrediction(nextImageTensor).then(() => {
        nextImageTensor.dispose();
        this.setState({ rafId: requestAnimationFrame(this.loop) });
      });
    }
  }


  handleCameraStream = async (iat) => {
    console.log("Camera loaded");
    this.setState({ imageAsTensors: iat });
    this.setCameraReady(true);
  }


  handleCanvas = (can) => {
    if (can === null) return;
    can.height = CAM_HEIGHT;
    can.width = CAM_WIDTH;
    let context = can.getContext("2d");
    context.fillStyle = "#00ff00";
    context.strokeStyle = "#00ff00";
    context.lineWidth = 5;
    this.setState({ canvas: can, ctx: context });
  }


  render() {
    return (
      <View style={styles.container} >
        <View style={styles.cameraView}>
          <TensorCamera style={styles.camera}
            type={Camera.Constants.Type.front}
            zoom={0}
            cameraTextureHeight={textureDims.height}
            cameraTextureWidth={textureDims.width}
            resizeHeight={tensorDims.height}
            resizeWidth={tensorDims.width}
            resizeDepth={3}
            onReady={this.handleCameraStream}
            autorender={true}
          />
          <View style={styles.modelResults}>
            {this.renderPose()}
         </View>
        </View>
        <Button title="Log states" onPress={() => { console.log("========================" + JSON.stringify(this.state) + "========================"); }} />
        <Button color={"#cc77cc"} title={this.state.learning % 2 == 0 ? `Start learning (${this.state.learning / 2} learned)` : `Learning class ${this.state.learning}`} onPress={() => this.setState({ learning: this.state.learning + 1 })} />
        <Button color={this.state.running ? "#ee5511" : "#33cc44"} title={`${this.state.running ? "Stop" : "Start"} animation`} onPress={this.state.running ? this.halt : this.start} />
        <Button color={this.state.learning % 2 == 0 ? "#0077cc" : "#dddddd"} onPress={() => {
          if (this.state.learning % 2 == 0 && this.state.learning > 0) {
            let path = fs.documentDirectory + `folder/class.json`;
            // @ts-ignore
            let data = JSON.stringify(Object.entries(this.state.classifier?.getClassifierDataset()).map(([label, data]) => [label, Array.from(data.dataSync()), data.shape]));
            console.log(data);
            fs.writeAsStringAsync(path, data, { encoding: fs.EncodingType.UTF8 }).then(() => {
              console.log("written to file!");
            });
          }
        }} title="Export Class" />
        <Button color={"#33cc44"} onPress={() => {
          if (this.state.learning % 2 == 0) {
            let path = fs.documentDirectory + `folder/class.json`;
            fs.readAsStringAsync(path, { encoding: fs.EncodingType.UTF8 }).then((str) => {
              console.log(str)
            });
          }
        }} title="Import Class" />
        <Button color={"#333333"} onPress={() => {
          // DANGEROUS!
          fs.deleteAsync(fs.documentDirectory + "folder", { idempotent: true }).then(() => {
            fs.makeDirectoryAsync(fs.documentDirectory + "folder").then(() => {
              console.log("classes cleared");
            });
          });
        }} title="Clear files" />
        <Text>{this.state.debugText}</Text>
      </View>
    );
  }
}

const CAM_WIDTH = Dimensions.get("window").width;
const CAM_HEIGHT = CAM_WIDTH * 4 / 3;

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight
  },
  cameraView: {
    width: CAM_WIDTH,
    height:CAM_HEIGHT
  },
  canvas: {
    position: "absolute",
    zIndex: 1
  },
  camera: {
    position: "absolute",
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 0,
  },
  modelResults: {
    position:'absolute',
    left: 0,
    top: 0,
    width: CAM_WIDTH,
    height: CAM_HEIGHT,
    zIndex: 20,
  }
});


export default MagicCamera;


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Stores the data; no need to worry about converting to strings ;)
// (key needs to be string tho)
const storeData = async (key, value) => {
  try {
    if (typeof value === "object") {
      value = "json|" + JSON.stringify(value);
    } else {
      value = typeof value + "|" + value;
    }
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
    console.log("storeData error: " + e.message);
  }
}


// Gets the data; no need to worry about converting from strings ;)
// (key needs to be string tho)
const getData = async (key) => {
  try {
    var value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
      let type = value.split("|")[0];
      value = value.substr(type.length + 1);
      let parsedValue;
      switch (type) {
        case "json":
          parsedValue = JSON.parse(value);
          break;
        case "boolean":
          parsedValue = value === "true";
          break;
        case "number":
          parsedValue = Number(value);
          break;
      }
      return parsedValue;
    }
    return null;
  } catch (e) {
    // error reading value
    console.log("getData error: " + e.message);
  }
}