import clsx from "clsx";
import { Text, View } from "react-native";

const PageTitle = ({ title, containerClassName, textClassName }) => {
    return (
        <View className={clsx("mb-5", containerClassName)}>
            <Text className={clsx("page-title", textClassName)}>
                {title || "Title"}
            </Text>
        </View>
    );
};

export default PageTitle;
