import React, { useState, useEffect, useRef, createRef } from "react";
import { Text, View, StyleSheet, Button, Dimensions, ImagePropTypes } from "react-native";
import Constants from "expo-constants";

// files
import * as fs from 'expo-file-system';

// camera
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";
import Svg, { Circle, Rect, G, Line } from 'react-native-svg';
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

import loadModel, { exercises } from "./ClassModelLoader";


interface IProps {
  exercise: number,
  onKeyframeChange: (newKeyframe: number) => any
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
  rafId: number,
  keyframe: (number)
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
      debugText: "Loading...",
      keyframe: 0,
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


  print = (s: any) => {
    this.setState({ debugText: s });
  }


  setKeyframe = (k: number) => {
    this.setState({ keyframe: k }, () => { this.props.onKeyframeChange(this.state.keyframe) });
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

    if (pose.keypoints.filter(val => val.score > 0.2).length >= 14) {
      this.setState({ pose });

      const tens = tf.tensor2d(pose.keypoints.map(x => [x.score, x.position.x, x.position.y]));
      const prediction = await this.state.classifier?.predictClass(tens, 5);

      this.setKeyframe(prediction.classIndex);

      tens.dispose();

      this.print(`Pose: ${JSON.stringify(prediction)}`);
    }
  }

  renderPose() {
    const MIN_KEYPOINT_SCORE = 0.2;
    const { pose } = this.state;
    if (pose != null && this.state.running) {
      const keypoints = pose.keypoints
        .filter(k => k.score > MIN_KEYPOINT_SCORE)
        .map((k, i) => {
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


  handleCameraStream = async (iat: any) => {
    console.log("Camera loaded");
    this.setState({ imageAsTensors: iat });
    this.setCameraReady(true);
  }


  handleCanvas = (can: { height: number; width: number; getContext: (arg0: string) => any; }) => {
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
    height: CAM_HEIGHT
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
    position: 'absolute',
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
export const storeData = async (key: string, value) => {
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
export const getData = async (key: string) => {
  try {
    var value = await AsyncStorage.getItem(key);
    if (value !== null && value !== undefined) {
      // value previously stored
      let type = value.split("|")[0];
      value = value.substr(type.length + 1);
      let parsedValue: any;
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
        case "string":
          parsedValue = value;
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