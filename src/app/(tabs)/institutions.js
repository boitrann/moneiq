import NetIndexChart from "@/components/institutions/NetIndexChart";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTitle from "@/components/ui/PageTitle";
import { FOREIGN_HISTORY } from "@/constants/data";
import { themes } from "@/constants/themes";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import { Appearance, Text, View } from "react-native";

const institutions = () => {
    const theme = Appearance.getColorScheme();

    const [chartKey, setChartKey] = useState(0);
    const [segment, setSegment] = useState("Nước ngoài");
    const [period, setPeriod] = useState("1M");
    const [chartSize, setChartSize] = useState({});

    const segments = ["Nước ngoài", "Tự doanh"];
    const periods = ["1W", "1M", "1Y"];

    const data = FOREIGN_HISTORY[period];

    return (
        <View className="h-full">
            <PageTitle title="Giao dịch tổ chức" />

            <SegmentedControl
                fontStyle={{
                    color: themes[theme].primary,
                }}
                tintColor={themes[theme].brand}
                selectedIndex={segments.indexOf(segment)}
                values={segments}
                onValueChange={(s) => setSegment(s)}
            />

            <View className="flat-card flex-1 my-5">
                {/* sub-segment control */}
                <View className="w-[50%] self-end mb-5">
                    <SegmentedControl
                        values={periods}
                        selectedIndex={periods.indexOf(period)}
                        fontStyle={{
                            color: themes[theme].primary,
                        }}
                        tintColor={themes[theme].brand}
                        onValueChange={(p) => {
                            setChartKey((prev) => prev + 1);
                            setPeriod(p);
                        }}
                    />
                </View>

                {/* Charts */}
                <View className="flex-1 gap-5">
                    {/* BarChart */}
                    <View className="border flex-1">
                        {/* Title & Legend */}
                        <View className="h-[15%] flex-row justify-between items-start">
                            <Text className="institution-title">
                                Giá trị giao dịch ròng
                            </Text>
                            <Text>Legend</Text>
                        </View>
                        {/* Bar chart */}
                        <View
                            className="flex-1"
                            onLayout={(e) => {
                                const { width, height } = e.nativeEvent.layout;
                                setChartSize({ width, height });
                            }}
                        >
                            {chartSize.width ? (
                                <NetIndexChart
                                    key={chartKey}
                                    data={data}
                                    containerSize={chartSize}
                                    theme={theme}
                                />
                            ) : (
                                <LoadingOverlay />
                            )}
                        </View>
                    </View>

                    {/* RevergentChart */}
                    <View className="border flex-1"></View>
                </View>
            </View>
        </View>
    );
};

export default institutions;
