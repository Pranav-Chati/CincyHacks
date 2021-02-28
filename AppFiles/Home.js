import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import AppIcons from './AppIcons';

export default class Home extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        console.log("stylesheets loaded");
        let stylesheets = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#0b3972',
                alignItems: 'center',
                justifyContent: 'center',
            },
            navbar: {

            },
            workouts: {

            }
        });

        return (
            <View styles={stylesheets.container}>
                <View style={styles.navbar}>

                </View>
                <View name={"WelcomeHeader"}>

                </View>
                <View name={"Workouts"} styles={stylesheets.workouts}>
                    <AppIcons text={"Dumbbells"} image={"./IconImageFiles/dumbbell_icon.png"}/>
                    <AppIcons text={"Jumping Jacks"} image={"./IconImageFiles/jumpingjacks_icon.png"}/>
                    <AppIcons text={"Plank"} image={"./IconImageFiles/plank_icon.png"}/>
                    <AppIcons text={"Push Ups"} image={"./IconImageFiles/pushups_icon.png"}/>
                    <AppIcons text={"Sit Ups"} image={"./IconImageFiles/situps_icon.png"}/>
                    <AppIcons text={"Squats"} image={"./IconImageFiles/squats_icon.png"}/>
                </View>
                <View name={"Food"}>
                    <AppIcons />
                </View>
                <StatusBar style="auto" />
            </View>
        );
    }
}
