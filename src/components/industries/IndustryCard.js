import { themes } from "@/constants/themes";
import clsx from "clsx";
import { memo, useMemo, useState } from "react";
import { Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";
import PressableCard from "../ui/PressableCard";

const IndustryCard = ({ theme, industryData, onPress }) => {
    const [chartHeight, setChartHeight] = useState();
    const { width: windowWidth } = useWindowDimensions();

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
        if (!calculatedData || !chartHeight) return;

        const data = calculatedData.data.map((data) => ({
            value: data.indexValues.IndexClose,
        }));

        const yAxisExtraHeight = s(0);
        const xAxisLabelsHeight = s(0);
        const height = chartHeight - yAxisExtraHeight - xAxisLabelsHeight;
        const yAxisLabelWidth = s(0);
        const endSpacing = s(5);
        const width = windowWidth / 2.7 - yAxisLabelWidth - endSpacing;
        const color =
            calculatedData.percent > 0
                ? themes[theme].candleUp
                : calculatedData.percent < 0
                  ? themes[theme].candleDown
                  : themes[theme].candleFlat;

        return {
            data,
            yAxisExtraHeight,
            xAxisLabelsHeight,
            height,
            yAxisLabelWidth,
            endSpacing,
            width,
            color,
        };
    }, [chartHeight, calculatedData]);

    return (
        <PressableCard onPress={onPress}>
            <View
                style={{ width: windowWidth / 2.5 }}
                className="flat-card p-2! h-32 active:opacity-70"
            >
                {/* Top */}
                <View className="industry-card-top">
                    <View>
                        <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            className="industry-card-title-text"
                        >
                            {calculatedData?.title || ""}
                        </Text>
                    </View>
                    <View className="industry-card-meta-row">
                        <View>
                            <Text
                                className={clsx(
                                    "industry-card-percent",
                                    calculatedData?.percent > 0
                                        ? "text-candle-up"
                                        : calculatedData?.percent < 0
                                          ? "text-candle-down"
                                          : "text-candle-flat",
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
                        const { height } = e.nativeEvent.layout;
                        if (height !== chartHeight) setChartHeight(height);
                    }}
                    // style={{ transform: [{ translateY: s(2) }] }}
                >
                    {chartConfig && (
                        <LineChart
                            data={chartConfig.data}
                            color={chartConfig.color}
                            hideDataPoints
                            areaChart
                            startFillColor={chartConfig.color}
                            endFillColor={chartConfig.color}
                            startOpacity={0.3}
                            endOpacity={0}
                            thickness={s(1.2)}
                            yAxisExtraHeight={chartConfig.yAxisExtraHeight}
                            xAxisLabelsHeight={chartConfig.xAxisLabelsHeight}
                            height={chartConfig.height}
                            hideRules
                            initialSpacing={0}
                            yAxisLabelWidth={chartConfig.yAxisLabelWidth}
                            endSpacing={chartConfig.endSpacing}
                            width={chartConfig.width}
                            adjustToWidth
                            disableScroll
                            yAxisOffset={Math.floor(calculatedData.min)}
                            yAxisThickness={0}
                            xAxisThickness={0}
                        />
                    )}
                </View>
            </View>
        </PressableCard>
    );
};

export default memo(IndustryCard);
