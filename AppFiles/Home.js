import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';

export default class Home extends Component {
  render() {
    const { navigation } = this.props;

    let stylesheets = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#ffffff',
      },
      //everything for workouts
      app_icon: { //specifically the view inside touchable
        flex: 1,
        width: '33%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 16,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        marginRight: 10,
      },
      view_app_icon: { //the touchable
        alignItems: 'center',
        justifyContent: 'center',
      },
      row: { //view encompassing three views
        paddingLeft: 10,
        flexDirection: 'row',
        paddingBottom: 32,
      },
      rows: { //overall container
        backgroundColor: "#eeeeee",
        paddingTop: 32,
      },

      //top bar
      header: {
        paddingVertical: 48,
        paddingHorizontal: 16,
        borderWidth: 1,

      },
      logo: {
        width: '100%',
      },

      //for all the stuff containing the food
      footer: {
        paddingHorizontal: 16,
        paddingBottom: 32,
        backgroundColor: "#eeeeee",
      },

      food_icon: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
      },
      view_food_icon: {
        alignItems: 'center',
        justifyContent: 'center',
      }
    });

    return <View>
      <View style={stylesheets.header}>
        <Image resizeMode={"contain"} style={stylesheets.logo} source={require('../IconImageFiles/background.png')} />
      </View>
      <View style={stylesheets.rows}>
        <View style={stylesheets.row}>
          {/*Dumbbells*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => {this.props.navigation.navigate("dumbbells")}}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/dumbbell_icon.png')} />
              <Text>Dumbbells</Text>
            </View>
          </TouchableOpacity>

          {/*Jumping Jacks*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => {this.props.navigation.navigate("jumpingjacks")}}>
            <View>
              <Image source={require('../IconImageFiles/jumpingjacks_icon.png')} />
              <Text>Jumping Jacks</Text>
            </View>
          </TouchableOpacity>

          {/*Plank*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View>
              <Image source={require('../IconImageFiles/plank_icon.png')} />
              <Text>Plank</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={stylesheets.row}>
          {/*Push Ups*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/pushups_icon.png')} />
              <Text>Push Ups</Text>
            </View>
          </TouchableOpacity>

          {/*Sit Ups*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/situps_icon.png')} />
              <Text>Sit Ups</Text>
            </View>
          </TouchableOpacity>

          {/*Squats*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => {this.props.navigation.navigate("squats")}}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/squats_icon.png')} />
              <Text>Squats</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={stylesheets.footer}>
        <TouchableOpacity style={stylesheets.food_icon}>
          <View style={stylesheets.view_food_icon}>
            <Text style={{ fontSize: 30 }}>Nutrition Tracker</Text>
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>;
  }
}
