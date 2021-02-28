import React from "react";
import { View } from "react-native";
import MagicCamera from "../MagicCamera"

interface IProps {
  exercise: number;
}

interface IState {
  keyframe: number,
  reps: number,
}

export default class Workout extends React.Component<IProps, any> {

  constructor(props: IProps) {
    super(props);
  }

  keyframe: number = 0;
  reps: number = 0;

  handleKeyframeChange = (k: number) => {
    if (k == 0) {
      if (this.keyframe > 0) {
        this.keyframe = k;
        this.reps++;
      }
    } else {
      if (this.keyframe == 0) {
        this.keyframe = k;
      }
    }
  }

  componentWillUnmount() {
    console.log(`unmounted ${this.reps}`);
  }

  render() {
    return (
      <View>
        <MagicCamera exercise={this.props.exercise} onKeyframeChange={this.handleKeyframeChange} />
      </View>
    )
  }

}