import { colors } from "@/constants/colors";
import "@/global.css";
import { Stack } from "expo-router";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function RootLayout() {
    const theme = "dark";
    return (
        <SafeAreaView className="flex-1 bg-background p-5">
            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: colors[theme].background },
                }}
            />
        </SafeAreaView>
    );
}
