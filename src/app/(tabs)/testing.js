import Button from "@/components/ui/Button";
import { themes } from "@/constants/themes";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { EaseView } from "react-native-ease";

const testing = () => {
    const [active, setActive] = useState(false);

    const width = 300;

    return (
        <View className="items-start">
            <EaseView
                style={{
                    width,
                    height: 15,
                    backgroundColor: themes.dark.candleUp,
                }}
                animate={{
                    scaleX: active ? 1 : 0,
                    translateX: -width / 2,
                }}
                transition={{
                    type: "timing",
                    duration: 1000,
                }}
            />
            <Button title="Press me" onPress={() => setActive(!active)} />
        </View>
    );
};

export default testing;
const styles = StyleSheet.create({
    box: {
        width: 80,
        height: 80,
        backgroundColor: "#4a90d9",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#7ab8ff",
        alignItems: "center",
        justifyContent: "center",
    },
});
