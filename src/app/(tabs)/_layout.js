import { colors } from "@/constants/colors";
import { tabs } from "@/constants/data";
import { Tabs } from "expo-router";

export default function TabsLayout() {
    const theme = "dark";
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                sceneStyle: { backgroundColor: colors[theme].background },
                tabBarStyle: { backgroundColor: colors[theme].background },
            }}
        >
            {tabs.map((tab) => (
                <Tabs.Screen
                    name={tab.name}
                    options={{
                        title: tab.title,
                    }}
                />
            ))}
        </Tabs>
    );
}
