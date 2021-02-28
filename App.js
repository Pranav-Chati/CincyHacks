import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Home from './AppFiles/Home'
import Login from './AppFiles/Login'
import Food from './AppFiles/Food'

import MagicCamera from "./MagicCamera"
import Workout from './AppFiles/Workout';
import {excercises, exercises} from "./ClassModelLoader";


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="login">
        <Stack.Screen name="home" component={Home}></Stack.Screen>
        <Stack.Screen name="login" component={Login}></Stack.Screen>
        <Stack.Screen name="food" component={Food}></Stack.Screen>
        <Stack.Screen name="squats">
          {props => <Workout exercise={exercises.SQUATS} callback={Home.updateStats} />}
        </Stack.Screen>
        <Stack.Screen name="jumpingjacks">
          {props => <Workout exercise={exercises.JUMPING_JACKS } callback={Home.updateStats} />}
        </Stack.Screen>
        <Stack.Screen name="dumbbells">
          {props => <Workout exercise={exercises.DUMBBELLS} callback={Home.updateStats} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
});
