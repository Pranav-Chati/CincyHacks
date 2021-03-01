import { Text, View } from "react-native";
import React, {useState} from "react";
import {getData} from "../MagicCamera"

export default function Stats() {
    const [stats, setStats] = useState({});
    (async () => {
        setStats(await getData("stats"));
    })();

    return (
        <View style={{ padding: 40 }}>
        <Text style={{ fontSize: 24 }}>Squats: {stats[0]}</Text>
        <Text style={{ fontSize: 24 }}>Jumping Jacks: {stats[1]}</Text>
        <Text style={{ fontSize: 24 }}>Dumbbells: {stats[2]}</Text>
        <Text style={{ fontSize: 24 }}>Push ups: 0</Text>
        <Text style={{ fontSize: 24 }}>Sit ups: 0</Text>
        <Text style={{ fontSize: 24 }}>Planks: 0</Text>
        </View>
    );
}