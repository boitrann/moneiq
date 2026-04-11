import clsx from "clsx";
import { Pressable } from "react-native";

const PressableCard = ({ onPress, children, className, style }) => {
    return (
        <Pressable
            onPress={onPress}
            className={clsx("active:opacity-70", className)}
            style={style}
        >
            {children}
        </Pressable>
    );
};

export default PressableCard;
