import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, View, Image, Text, Button } from 'react-native';


export default class Home extends Component {
    render() {
        let stylesheets = StyleSheet.create({
            container: {
                flex: 1,
                backgroundColor: '#ffffff',
            },
            app_icon: {
                flex:1,
                borderWidth:1,
                width:'33%',
                alignItems:'center',
                justifyContent:'center',
                paddingVertical: 16,
            },
            Row: {
                flexDirection:'row',
            },
            Rows: {

            },

            header: {
                paddingVertical: 96,
                paddingHorizontal: 16,
            }
        });

        return (
            <View>
                <View style={stylesheets.header}>
                    <Text>
                        trainer
                    </Text>
                </View>
                <View style={stylesheets.Rows}>
                    <View style={stylesheets.Row}>
                        {/*Dumbbells*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/dumbbell_icon.png')}/>
                            <Text>Dumbbells</Text>
                        </View>

                        {/*Jumping Jacks*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/jumpingjacks_icon.png')} />
                            <Text>Jumping Jacks</Text>
                        </View>

                        {/*Plank*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/plank_icon.png')} />
                            <Text>Plank</Text>
                        </View>
                    </View>

                    <View style={stylesheets.Row}>
                        {/*Push Ups*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/pushups_icon.png')} />
                            <Text>Push Ups</Text>
                        </View>

                        {/*Sit Ups*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/situps_icon.png')} />
                            <Text>Sit Ups</Text>
                        </View>

                        {/*Squats*/}
                        <View style={stylesheets.app_icon}>
                            <Image source={require('../IconImageFiles/squats_icon.png')} />
                            <Text>Squats</Text>
                        </View>
                    </View>
                </View>

                <StatusBar style="auto" />
            </View>
        );
    }
}
