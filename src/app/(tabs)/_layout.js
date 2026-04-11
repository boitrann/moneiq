import { tabs } from "@/constants/data";
import { themes } from "@/constants/themes";
import { Tabs } from "expo-router";
import { Appearance } from "react-native";

export default function TabsLayout() {
    const theme = Appearance.getColorScheme();
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: themes[theme].brand },
                tabBarStyle: { brandColor: themes[theme].brand },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    key={tab.name}
                    name={tab.name}
                    options={{
                        title: tab.title,
                    }}
                />
            ))}
        </Tabs>
    );
}
