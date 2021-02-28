import { Text } from "react-native";
import React, {useState} from "react";
import {getData} from "../MagicCamera"

export default function Stats() {
    const [txt, setTxt] = useState("");
    (async () => {
        setTxt(JSON.stringify(await getData("stats")));
    })();
    return (
        <Text>{txt}</Text>
    )
}