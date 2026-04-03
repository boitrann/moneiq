import { colors } from "@/constants/colors";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const IndustryCard = ({ industryCode, industryData }) => {
    const [chartSize, setChartSize] = useState({});

    const calculatedData = useMemo(() => {
        const length = industryData.length;
        if (length === 0) return;
        const sortedData = [...industryData].sort(
            (a, b) => new Date(a.date) - new Date(b.date),
        );
        const min = Math.min(
            ...sortedData.map((data) => data.indexValues.IndexClose),
        );
        const max = Math.max(
            ...sortedData.map((data) => data.indexValues.IndexClose),
        );
        const title = sortedData[0].indexValues.ICBName || "Title";
        const pe = sortedData[length - 1].indexValues.PE;
        const last = sortedData[length - 1];
        const first = sortedData[0];
        const percent =
            (100 *
                (last.indexValues.IndexClose - first.indexValues.IndexClose)) /
            first.indexValues.IndexClose;

        return { title, data: sortedData, pe, percent, min, max };
    }, [industryData]);

    const chartConfig = useMemo(() => {
        if (!calculatedData || !chartSize.height || !chartSize.width) return;

        const data = calculatedData.data.map((data) => ({
            value: data.indexValues.IndexClose,
        }));

        const yAxisExtraHeight = s(0);
        const xAxisLabelsHeight = s(0);
        const chartHeight =
            chartSize.height - yAxisExtraHeight - xAxisLabelsHeight;
        const yAxisLabelWidth = s(0);
        const endSpacing = s(5);
        const chartWidth = chartSize.width - yAxisLabelWidth - endSpacing;

        const rawMin = calculatedData.min;
        const rawMax = calculatedData.max;
        const range = rawMax - rawMin;

        const padding = Math.max(2, range * 0.1);
        const visualMin = Math.floor(rawMin - padding);
        const visualMax = Math.ceil(rawMax + padding);

        const yAxisOffset = visualMin;
        const maxValue = visualMax - visualMin;

        return {
            data,
            yAxisExtraHeight,
            xAxisLabelsHeight,
            chartHeight,
            yAxisLabelWidth,
            endSpacing,
            chartWidth,
            yAxisOffset,
            maxValue,
        };
    }, [chartSize, calculatedData]);

    // console.log(chartConfig);

    // if (!chartConfig && !calculatedData) {
    //     return <ActivityIndicator />;
    // }

    return (
        <Pressable className="industry-card">
            {/* Top */}
            <View className="industry-card-top">
                <View className="industry-card-title">
                    <Text className="industry-card-title-text">
                        {calculatedData?.title || ""}
                    </Text>
                </View>
                <View className="industry-card-meta-row">
                    <View>
                        <Text className="industry-card-pe">
                            PE: {calculatedData?.pe || 0}
                        </Text>
                    </View>
                    <View>
                        <Text
                            className={clsx(
                                "industry-card-percent",
                                calculatedData?.percent > 0
                                    ? "text-up"
                                    : calculatedData?.percent < 0
                                      ? "text-down"
                                      : "text-nochange",
                            )}
                        >
                            {calculatedData?.percent != null
                                ? calculatedData.percent.toFixed(2)
                                : "0.00"}
                            %
                        </Text>
                    </View>
                </View>
            </View>

            {/* Bottom */}
            <View
                className="industry-card-bottom"
                onLayout={(e) => {
                    const { height, width } = e.nativeEvent.layout;
                    if (
                        height !== chartSize.height ||
                        width !== chartSize.width
                    )
                        setChartSize({ height, width });
                }}
            >
                {chartConfig && (
                    <LineChart
                        // backgroundColor="gray"
                        data={chartConfig.data}
                        color="green"
                        hideDataPoints
                        // areaChart
                        thickness={s(1)}
                        yAxisExtraHeight={chartConfig.yAxisExtraHeight}
                        xAxisLabelsHeight={chartConfig.xAxisLabelsHeight}
                        height={chartConfig.chartHeight}
                        hideRules
                        initialSpacing={0}
                        // yAxisLabelWidth={chartConfig.yAxisLabelWidth}
                        noOfSections={2}
                        endSpacing={chartConfig.endSpacing}
                        width={chartConfig.chartWidth}
                        maxValue={chartConfig.maxValue}
                        yAxisOffset={chartConfig.yAxisOffset}
                        yAxisThickness={0}
                        xAxisType="dashed"
                        xAxisColor={colors.light.background}
                        pointerConfig={{
                            pointerComponent: (item) => {
                                console.log(item);

                                return (
                                    <View>
                                        <Text className="text-c5">
                                            {item.value}
                                        </Text>
                                    </View>
                                );
                            },
                        }}
                    />
                )}
            </View>
        </Pressable>
    );
};

export default IndustryCard;
