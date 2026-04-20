import { annotationStack } from "@/constants/data";
import { themes } from "@/constants/themes";
import "@/global.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styled } from "nativewind";
import { Appearance } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);
const queryClient = new QueryClient();

export default function RootLayout() {
    Appearance.setColorScheme("light");
    const theme = Appearance.getColorScheme();

    return (
        <>
            <SafeAreaView className="flex-1 bg-brand dark:bg-[#0F172A] p-5">
                <QueryClientProvider client={queryClient}>
                    <StatusBar style={theme === "light" ? "dark" : "light"} />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: {
                                backgroundColor: themes[theme].brand,
                            },
                        }}
                    >
                        {annotationStack.map((a) => (
                            <Stack.Screen
                                key={a.name}
                                name={a.name}
                                options={{
                                    headerShown: true,
                                    title: a.title,
                                    presentation: "modal",
                                }}
                            />
                        ))}
                    </Stack>
                </QueryClientProvider>
            </SafeAreaView>
        </>
    );
}
