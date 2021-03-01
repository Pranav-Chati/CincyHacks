import React, {Component} from "react";
import {StyleSheet, View, Text, Image, Linking, TouchableOpacity} from "react-native";


function Food(props) {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Sponsors List</Text>
            <TouchableOpacity style={styles.food_card}>
                <Image style={{width:'100%',height:65}} source={require('../IconImageFiles/gatoradelogo.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.food_card}>
                <Image style={styles.food_icon} source={require('../IconImageFiles/vitaminwaterlogo.png')}/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.food_card}>
                <Image style={{width:'95%',height:55}} source={require('../IconImageFiles/bodyarmorlogo.png')}/>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eeeeee",
        paddingTop: 32,
        flex: 1,
        paddingLeft: 10,
    },

    food_card: {
        marginTop: 20,
        paddingVertical:10,
        alignItems: "center",
        justifyContent: "center",
        borderRadius:1,
        backgroundColor: "#ffffff",

    },

    food_icon: {
        width: '80%',
        height: 100,
    },
    text: {

    }
});

export default Food;
