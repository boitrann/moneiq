import StatisticChart from "@/components/statistics/StatisticChart";
import IconAnnotation from "@/components/ui/IconAnnotation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import { INDEX_SCORECARD } from "@/constants/data";
import { themes } from "@/constants/themes";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useState } from "react";
import { Appearance, ScrollView, Text, View } from "react-native";
import { s } from "react-native-size-matters";

const statistics = () => {
    const theme = Appearance.getColorScheme();

    const [chartKey1, setChartKey1] = useState(0);
    const [chartKey2, setChartKey2] = useState(0);
    const [period, setPeriod] = useState(90);
    const [range, setRange] = useState("large");

    const values1 = ["3M", "6M", "1Y"];
    const periods = [90, 180, 365];

    const values2 = ["Vốn hóa lớn", "Vốn hóa vừa", "Vốn hóa nhỏ"];
    const ranges = ["large", "mid", "small"];

    const data = INDEX_SCORECARD[period];

    return (
        <ScrollView>
            <View className="flat-card gap-8">
                {/* Xác suất ngắn hạn */}
                <View className="gap-5">
                    {/* segments control */}
                    <View className="w-[50%]">
                        <SegmentedControl
                            fontStyle={{ color: themes[theme].primary }}
                            tintColor={themes[theme].brand}
                            values={values1}
                            selectedIndex={Object.values(periods).indexOf(
                                period,
                            )}
                            onChange={(e) => {
                                setChartKey1((prev) => prev + 1);
                                setChartKey2((prev) => prev + 1);
                                setPeriod(
                                    periods[e.nativeEvent.selectedSegmentIndex],
                                );
                            }}
                        />
                    </View>
                    {/* chart */}
                    <View className="gap-2">
                        <View className="statistic-title-row">
                            {/* title */}
                            <View className="statistic-title-group">
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="trail"
                                        className="statistic-title"
                                    >
                                        Xác suất đầu tư
                                    </Text>
                                </View>

                                <IconAnnotation />
                            </View>
                            {/* legend */}
                            <View className="statistic-legend-groups">
                                <View className="statistic-legend-group">
                                    <View className="statistic-legend-icon-1 " />
                                    <Text className="statistic-legend-text">
                                        Cầu
                                    </Text>
                                </View>
                                <View className="statistic-legend-group">
                                    <View className="statistic-legend-icon-2" />
                                    <Text className="statistic-legend-text">
                                        Cung
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* chart */}
                        {data ? (
                            <StatisticChart
                                key={chartKey1}
                                data={data}
                                key1="1w_ma20_vol"
                                key2="1m_ma50_vol"
                                color1={themes[theme].candleUp}
                                color2={themes[theme].candleDown}
                                lineType2="dashed"
                                labelColor={themes[theme].primary}
                                yLabelThreshold1={60}
                                yLabelThreshold2={80}
                                height={s(130)}
                            />
                        ) : (
                            <LoadingOverlay
                                style={{ height: s(130) }}
                                message="Loading..."
                            />
                        )}
                    </View>
                </View>

                {/* Đà lan tỏa */}
                <View className="gap-5">
                    {/* segments control */}
                    <View className="w-full">
                        <SegmentedControl
                            fontStyle={{ color: themes[theme].primary }}
                            tintColor={themes[theme].brand}
                            values={values2}
                            selectedIndex={ranges.indexOf(range)}
                            onChange={(e) => {
                                setChartKey2((prev) => prev + 1);
                                setRange(
                                    ranges[e.nativeEvent.selectedSegmentIndex],
                                );
                            }}
                        />
                    </View>
                    {/* chart */}
                    <View className="gap-2">
                        <View className="statistic-title-row">
                            {/* title */}
                            <View className="statistic-title-group">
                                <View>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode="trail"
                                        className="statistic-title"
                                    >
                                        Đà lan tỏa
                                    </Text>
                                </View>
                                <IconAnnotation />
                            </View>
                            {/* legend */}
                            <View className="statistic-legend-groups">
                                <View className="statistic-legend-group">
                                    <View className="statistic-legend-icon-1 " />
                                    <Text className="statistic-legend-text">
                                        Đà lan tỏa
                                    </Text>
                                </View>
                                <View className="statistic-legend-group">
                                    <View className="statistic-legend-icon-2" />
                                    <Text className="statistic-legend-text">
                                        MA10
                                    </Text>
                                </View>
                            </View>
                        </View>
                        {/* chart */}
                        {data ? (
                            <StatisticChart
                                key={chartKey2}
                                data={data}
                                key1={`ma200_${range}`}
                                key2={`ma20_${range}`}
                                color1={themes[theme].candleUp}
                                color2={themes[theme].candleDown}
                                lineType2="dashed"
                                labelColor={themes[theme].primary}
                                yLabelThreshold1={50}
                                yLabelThreshold2={100}
                                height={s(130)}
                            />
                        ) : (
                            <LoadingOverlay
                                style={{ height: s(130) }}
                                message="Loading..."
                            />
                        )}
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

export default statistics;
