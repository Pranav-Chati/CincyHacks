import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { getData } from "../MagicCamera"

export default class Home extends Component<any, any> {

  constructor(pr) {
    super(pr)
    this.state = {
      name: "",
      stats: {}
    }
  }

  focusListener: any;
  componentDidMount() {
    this.focusListener = this.props.navigation.addListener("focus", async () => {
      console.log("HOME MOUNTED!!!");
      this.setState({
        name: await getData("name"), stats: (await getData("stats")) || {
          0: 0,
          1: 0,
          2: 0
        }
      });
    });
  }

  public updateStats = (ex, reps) => {
    this.setState(old => ({
      stats: () => {
        old.stats[ex] += reps;
        return old.stats;
      }
    }));
  }

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
        padding: 5,
        margin: 4,
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
        paddingHorizontal: 10,
      },

      //top bar
      header: {
        paddingTop: 40,
        paddingHorizontal: 40,

      },
      logo: {
        width: '100%',
      },

      //for all the stuff containing the food
      footer: {
        paddingHorizontal: 40,
        backgroundColor: "#eeeeee",
      },

      food_icon: {
        backgroundColor: '#ffffff',
        borderRadius: 16,
        padding: 10
      },
      view_food_icon: {
        alignItems: 'center',
        justifyContent: 'center',
      }
    });

    return <View>
      <View style={stylesheets.header}>
        <Text style={{ fontSize: 24 }}>Welcome, {this.state.name}</Text>
        <Image resizeMode={"contain"} style={stylesheets.logo} source={require('../IconImageFiles/background.png')} />
      </View>
      <View style={stylesheets.rows}>
        <View style={stylesheets.row}>
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => { this.props.navigation.navigate("stats") }}>
            <View style={stylesheets.view_app_icon}>
              <Text style={{alignSelf: 'center', fontSize: 18}}>View Your Stats</Text>
            </View>
          </TouchableOpacity>
          {/*Dumbbells*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => { this.props.navigation.navigate("dumbbells") }}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/dumbbell_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 16}}>Dumbbells</Text>
            </View>
          </TouchableOpacity>

          {/*Jumping Jacks*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => { this.props.navigation.navigate("jumpingjacks") }}>
            <View>
              <Image source={require('../IconImageFiles/jumpingjacks_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 18}}>Jumping Jacks</Text>
            </View>
          </TouchableOpacity>

          {/*Plank*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View>
              <Image source={require('../IconImageFiles/plank_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 18}}>Planks</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={stylesheets.row}>
          {/*Push Ups*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/pushups_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 18}}>Push Ups</Text>
            </View>
          </TouchableOpacity>

          {/*Sit Ups*/}
          <TouchableOpacity style={stylesheets.app_icon}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/situps_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 18}}>Sit Ups</Text>
            </View>
          </TouchableOpacity>

          {/*Squats*/}
          <TouchableOpacity style={stylesheets.app_icon} onPress={() => { this.props.navigation.navigate("squats") }}>
            <View style={stylesheets.view_app_icon}>
              <Image source={require('../IconImageFiles/squats_icon.png')} />
              <Text style={{alignSelf: 'center', fontSize: 18}}>Squats</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={stylesheets.footer}>
        <TouchableOpacity style={stylesheets.food_icon} onPress={() => { this.props.navigation.navigate("food") }}>
          <View style={stylesheets.view_food_icon}>
            <Text style={{ fontSize: 30 }}>Nutrition Tracker</Text>
          </View>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </View>;
  }
}
