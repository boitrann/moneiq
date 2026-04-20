import StatisticChart from "@/components/statistics/StatisticChart";
import ErrorOverlay from "@/components/ui/ErrorOverlay";
import IconAnnotation from "@/components/ui/IconAnnotation";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTitle from "@/components/ui/PageTitle";
import { INDEX_SCORECARD } from "@/constants/data";
import { themes } from "@/constants/themes";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Appearance, Text, View } from "react-native";

const statistics = () => {
    const router = useRouter();
    const theme = Appearance.getColorScheme();

    const [chartKey1, setChartKey1] = useState(0);
    const [chartKey2, setChartKey2] = useState(0);
    const [chartSize1, setChartSize1] = useState();
    const [chartSize2, setChartSize2] = useState();

    const [period, setPeriod] = useState(90);
    const [range, setRange] = useState("large");

    // const { data, error, isLoading } = useQuery({
    //     queryKey: ["indexscorecard", period],
    //     queryFn: () => retrieveIndexScoreCard(period),
    //     select: (data) => JSON.parse(JSON.parse(data.data).result),
    //     enabled: !!period,
    // });

    const data = INDEX_SCORECARD[period];
    const isLoading = false;
    const error = undefined;

    const values1 = ["3M", "6M", "1Y"];
    const periods = [90, 180, 365];

    const values2 = ["Vốn hóa lớn", "Vốn hóa vừa", "Vốn hóa nhỏ"];
    const ranges = ["large", "mid", "small"];

    return (
        <View className="h-full">
            <PageTitle title="Chỉ báo tâm lý" />
            <View className="flat-card flex-1 mb-5 gap-8">
                {/* Xác suất ngắn hạn */}
                <View className="gap-5 flex-1">
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
                    <View className="gap-5 flex-1">
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

                                <IconAnnotation
                                    onPress={() =>
                                        router.push("/statisticAnnotation")
                                    }
                                />
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

                        <View
                            className="flex-1"
                            onLayout={(e) => {
                                setChartSize1(e.nativeEvent.layout);
                            }}
                        >
                            {isLoading ? (
                                <LoadingOverlay
                                    size="large"
                                    message="Loading..."
                                />
                            ) : error ? (
                                <ErrorOverlay message={error.message} />
                            ) : (
                                chartSize1 && (
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
                                        containerSize={chartSize1}
                                    />
                                )
                            )}
                        </View>
                    </View>
                </View>

                {/* Đà lan tỏa */}
                <View className="gap-5 flex-1">
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
                    <View className="gap-5 flex-1">
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
                                <IconAnnotation
                                    onPress={() =>
                                        router.push("/spreadAnnotation")
                                    }
                                />
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
                        <View
                            className="flex-1"
                            onLayout={(e) => {
                                setChartSize2(e.nativeEvent.layout);
                            }}
                        >
                            {isLoading ? (
                                <LoadingOverlay
                                    size="large"
                                    message="Loading..."
                                />
                            ) : error ? (
                                <ErrorOverlay message={error.message} />
                            ) : (
                                chartSize2 && (
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
                                        containerSize={chartSize2}
                                    />
                                )
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default statistics;
