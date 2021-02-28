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
    relevantPoses = [stand, squat];
    break;
  case exercises.JUMPING_JACKS:
    relevantPoses = [stand, jump];
    break;
  case exercises.DUMBBELLS:
    relevantPoses = [arms_down, left_up.concat(right_up), both_up];
    break;
  }
  for (let i = 0; i < relevantPoses.length; i++) {
    relevantPoses[i].map(arr => tf.tensor2d(arr)).forEach(tens => classifier.addExample(tens, i));
  }
}