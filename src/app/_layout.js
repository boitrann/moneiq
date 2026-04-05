import { themes } from "@/constants/themes";
import "@/global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

import { Appearance } from "react-native";

const SafeAreaView = styled(RNSafeAreaView);

export default function RootLayout() {
    Appearance.setColorScheme("light");
    const theme = Appearance.getColorScheme();

    return (
        <>
            <SafeAreaView className="flex-1 bg-brand dark:bg-[#0F172A] p-5">
                <StatusBar style={theme === "light" ? "dark" : "light"} />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: themes[theme].brand },
                    }}
                />
            </SafeAreaView>
        </>
    );
}
