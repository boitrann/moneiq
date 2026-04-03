import { Pressable, Text } from "react-native";

const Button = ({ title, onPress, style, textStyle }) => {
    return (
        <Pressable style={style} className="button" onPress={onPress}>
            <Text style={textStyle} className="button-text">
                {title}
            </Text>
        </Pressable>
    );
};

export default Button;
