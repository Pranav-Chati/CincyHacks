import React, { Component, useState } from "react";
import { StyleSheet, View, Text, Image, Button } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { storeData } from "../MagicCamera"

function Login(props) {
    const [name, setName] = useState("");

    return (
        <View style={styles.container}>
            <Text>Your name:</Text>
            <TextInput onChangeText={text => {
                setName(text);
            }}></TextInput>
            <Button onPress={() => {
                storeData("name", name);
                props.navigation.navigate("home");
            }
            } title="GO" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
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
