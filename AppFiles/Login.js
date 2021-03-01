import React, { Component, useState } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import { storeData } from "../MagicCamera"

function Login(props) {
    const [name, setName] = useState("");

    return (
        <View style={styles.container}>
            <Text style={{
                fontSize: 24
            }}>Your name:</Text>
            <TextInput onChangeText={text => {
                setName(text);
            }} style={{
                borderWidth: 2,
                borderRadius: 4,
                borderColor: "#2196F3",
                marginTop: 40,
                marginBottom: 40,
                height: 42,
                padding: 10,
                fontSize: 18
            }} caretHidden={false}></TextInput>
            <TouchableOpacity onPress={() => {
                storeData("name", name);
                props.navigation.navigate("home");
            }} style={{
                fontSize: 18,
                backgroundColor: "#2196F3",
                padding: 10
            }} activeOpacity={0.6}
            ><Text style={{
                alignSelf: "center",
                color: "white",
                fontSize: 18
            }}>Login</Text></TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 40
    },
    rect: {
        width: 375,
        height: 38,
        backgroundColor: "#E6E6E6",
        marginTop: 27,
        alignSelf: "center"
    },
    rect2: {
        width: 375,
        height: 280,
        backgroundColor: "#E6E6E6",
        marginTop: 4
    },
    rect3: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6"
    },
    rect4: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6",
        marginLeft: 17
    },
    rect5: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6",
        marginLeft: 14
    },
    rect3Row: {
        height: 100,
        flexDirection: "row",
        marginTop: 42,
        marginLeft: 21,
        marginRight: 23
    },
    rect6: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6"
    },
    rect7: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6",
        marginLeft: 17
    },
    rect8: {
        width: 100,
        height: 100,
        backgroundColor: "#E6E6E6",
        marginLeft: 14
    },
    rect6Row: {
        height: 100,
        flexDirection: "row",
        marginTop: 14,
        marginLeft: 21,
        marginRight: 23
    },
    rect9: {
        width: 331,
        height: 77,
        backgroundColor: "#E6E6E6",
        marginTop: 28,
        marginLeft: 21
    },
    food: {
        color: "#121212",
        marginTop: 30,
        marginLeft: 153
    }
});

export default Login;
