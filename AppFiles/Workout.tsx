import React from "react";
import { Text, View } from "react-native";
import MagicCamera from "../MagicCamera"
import { getData, storeData } from "../MagicCamera"

interface IState {
  keyframe: number,
  reps: number,
}

export default class Workout extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      reps: 0,
      keyframe: 0,
      stats: {}
    }
  }

  async componentDidMount() {
    this.setState({
      stats: (await getData("stats")) || {
        0: 0,
        1: 0,
        2: 0
      }
    });
  }

  handleKeyframeChange = (k: number) => {
    if (k == 0) {
      if (this.state.keyframe > 0) {
        this.setState({ keyframe: k, reps: this.state.reps + 1 });
      }
    } else {
      if (this.state.keyframe == 0) {
        this.setState({ keyframe: k });
      }
    }
  }

  componentWillUnmount() {
    console.log(`unmounted ${this.state.reps}`);
    //this.props.callback(this.props.exercise, this.state.reps);
    /*
    switch (this.props.exercise) {
      case 0:
        this.setState(old => ({
          stats: {
            ...old.stats,
            0: old.stats[this.props.exercise] + this.state.reps
          }
        }));
        break;
      case 1:
        this.setState(old => ({
          stats: {
            ...old.stats,
            1: old.stats[this.props.exercise] + this.state.reps
          }
        }));
        break;
      case 2:
        this.setState(old => ({
          stats: {
            ...old.stats,
            2: old.stats[this.props.exercise] + this.state.reps
          }
        }));
        break;
    }
    this.state.stats[this.props.exercise] += this.state.reps;
    storeData("stats", this.state.stats);
    */
  }

  render() {
    return (
      <View>
        <MagicCamera exercise={this.props.exercise} onKeyframeChange={this.handleKeyframeChange} />
        <Text style={{ fontSize: 60, alignSelf: "center" }}>{this.state.reps}</Text>
      </View>
    )
  }

}