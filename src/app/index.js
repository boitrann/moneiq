import Button from "@/components/ui/Button";
import { router } from "expo-router";
import { Text, View } from "react-native";

export default function Index() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text className="text-xl font-bold text-primary">
                Welcome to Moneiq!
            </Text>
            <Button
                title="Go to App"
                onPress={() => router.push("/statistics")}
                style={{ marginTop: 10 }}
            />
        </View>
    );
}
