import { ActivityIndicator, Text, View } from "react-native";

const LoadingOverlay = ({ size, message, style, textStyle }) => {
    return (
        <View className="justify-center items-center gap-2" style={style}>
            <ActivityIndicator size={size} />
            <Text className="text-neutral-300" style={textStyle}>
                {message}
            </Text>
        </View>
    );
};

export default LoadingOverlay;
