import { colors } from "@/constants/colors";
import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function RootLayout() {
    const theme = "dark";
    return (
        <>
            <StatusBar style="light" />
            <SafeAreaView className="flex-1 bg-bg-base p-5">
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: colors[theme].bgBase },
                    }}
                />
            </SafeAreaView>
        </>
    );
}
