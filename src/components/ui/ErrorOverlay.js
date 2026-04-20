import clsx from "clsx";
import { Text, View } from "react-native";

const ErrorOverlay = ({ message, containerClassName, textClassName }) => {
    return (
        <View
            className={clsx(
                "flex-1 justify-center items-center",
                containerClassName,
            )}
        >
            <Text className={clsx("text-primary opacity-60", textClassName)}>
                {message}
            </Text>
        </View>
    );
};

export default ErrorOverlay;
