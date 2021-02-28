import { Text } from "react-native";
import React, {useState} from "react";
import {getData} from "../MagicCamera"

export default function Stats() {
    const [stats, setStats] = useState("");
    (async () => {
        setStats(await getData("stats"));
    })();

    return (
        <View>
        <Text style={{ fontSize: 24 }}>Squats: {this.stats[0]}</Text>
        <Text style={{ fontSize: 24 }}>Jumping Jacks: {this.stats[1]}</Text>
        <Text style={{ fontSize: 24 }}>Dumbbells: {this.stats[2]}</Text>
        <Text style={{ fontSize: 24 }}>Push ups: 0</Text>
        <Text style={{ fontSize: 24 }}>Sit ups: 0</Text>
        <Text style={{ fontSize: 24 }}>Planks: 0</Text>
        </View>
    );
}