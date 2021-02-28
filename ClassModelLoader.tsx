import * as arms_down from "./classmodels/arms_down.json";
import * as both_up from "./classmodels/both_up.json";
import * as jump from "./classmodels/jump.json";
import * as left_up from "./classmodels/left_up.json";
import * as right_up from "./classmodels/right_up.json";
import * as squat from "./classmodels/squat.json";
import * as stand from "./classmodels/stand.json";
import * as tf from "@tensorflow/tfjs";
import * as knn from "@tensorflow-models/knn-classifier"

export const exercises = {
  SQUATS: 0,
  JUMPING_JACKS: 1,
  DUMBBELLS: 2
}

export default function loadModel(classifier: knn.KNNClassifier, exercise: number) {
  let relevantPoses;
  switch(exercise) {
  case exercises.SQUATS:
    relevantPoses = [stand.data, squat.data];
    break;
  case exercises.JUMPING_JACKS:
    relevantPoses = [stand.data, jump.data];
    break;
  case exercises.DUMBBELLS:
    relevantPoses = [arms_down.data, left_up.data.concat(right_up.data), both_up.data];
    break;
  }
  for (let i = 0; i < relevantPoses.length; i++) {
    console.log(relevantPoses[i]);
    relevantPoses[i].map(arr => tf.tensor2d(arr)).forEach(tens => classifier.addExample(tens, i));
  }
}