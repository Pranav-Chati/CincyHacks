import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Image} from "react-native-web";


export default class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: this.props.text,
            imagesrc: this.props.image,
        }
    }

    render() {
        console.log("stylesheets loaded");
        let stylesheets = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#ffffff',
                alignItems: 'center',
                justifyContent: 'center',
            },
            navbar: {

            }
        });

        return (
            <View styles={stylesheets.container}>
                <Image source={require('./IconImageFiles/dumbbell_icon.png')}/>

            </View>
        );
    }
}
