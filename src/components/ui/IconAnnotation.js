import { Pressable, Text } from "react-native";
import { s } from "react-native-size-matters";

const IconAnnotation = ({ onPress, size = s(20), color }) => {
    return (
        <Pressable
            onPress={onPress}
            className="annotation-icon"
            style={{
                width: size,
                height: size,
                borderColor: color,
            }}
        >
            <Text
                className="annotation-text"
                style={{ fontSize: size / 2, color, fontWeight: "bold" }}
            >
                ?
            </Text>
        </Pressable>
    );
};

export default IconAnnotation;
