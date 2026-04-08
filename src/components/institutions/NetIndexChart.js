import { themes } from "@/constants/themes";
import { formatNumber, roundedValue } from "@/lib/utils";
import clsx from "clsx";
import dayjs from "dayjs";
import { memo, useMemo } from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const calculateMaxSpacing = (length, barWidth, maxPlotWidth) => {
    if (length <= 1) return 0;
    return (maxPlotWidth - length * barWidth) / (length - 1);
};

const NetIndexChart = ({
    data,
    valueKey,
    containerSize,
    theme,
    textSize = s(11),
}) => {
    const processed = useMemo(() => {
        const arr = data.message.map((m) => ({
            value: m[valueKey],
            updatedAt: m.updatedAt,
            frontColor:
                m[valueKey] >= 0
                    ? themes[theme].candleUp
                    : themes[theme].candleDown,
        }));
        const chartData = arr.slice(-15);
        const max = Math.max(...chartData.map((v) => v.value));
        const min = Math.min(...chartData.map((v) => v.value));
        const length = chartData.length;

        return { chartData, max, min, length };
    }, [data]);

    const chartConfig = useMemo(() => {
        // Height
        const max = Math.ceil(Math.max(processed.max, 0));
        const min = Math.floor(Math.min(processed.min, 0));
        const maxAbs = Math.abs(max, min);
        const length = processed.length;

        const xAxisLabelsHeight = s(0);
        const extraHeight = s(10);
        const yAxisExtraHeight = extraHeight;

        let initialHeight =
            containerSize.height - yAxisExtraHeight - xAxisLabelsHeight;

        let baseSections = 4;
        let noOfSections = 4;
        // Negative chart
        let height, stepValue, stepHeight, noOfSectionsBelowXAxis;
        const range = max - min;
        stepValue = range / baseSections;
        noOfSections = Math.ceil(max / stepValue) || 1;
        noOfSectionsBelowXAxis = Math.ceil(-min / stepValue) || 1;
        const totalOfSections = noOfSections + noOfSectionsBelowXAxis;

        stepHeight = (initialHeight - extraHeight) / totalOfSections;
        height = stepHeight * noOfSections;

        // Width
        const yAxisLabelWidth = maxAbs / 1e9 < 9000 ? s(45) : s(50);
        const barWidth = length >= 10 ? s(10) : length >= 5 ? s(20) : s(50);
        const initialSpacing =
            length >= 10 ? s(8) : length >= 5 ? s(25) : s(35);
        const endSpacing = initialSpacing;

        const width = containerSize.width - yAxisLabelWidth - endSpacing;
        const maxPlotWidth = width - initialSpacing;
        const spacing = calculateMaxSpacing(length, barWidth, maxPlotWidth);

        // Styling
        const formatYLabel = (label) => {
            return label !== "0" ? roundedValue(label / 1e9) : label;
        };
        const barBorderTopLeftRadius = s(3);
        const barBorderTopRightRadius = s(3);

        const yAxisTextStyle = {
            fontSize: textSize,
            color: themes[theme].primary,
        };

        const minHeight = s(2);

        return {
            spacing,
            noOfSections,
            noOfSectionsBelowXAxis,
            xAxisLabelsHeight,
            yAxisExtraHeight,
            height,
            stepHeight,
            stepValue,
            yAxisLabelWidth,
            barWidth,
            minHeight,
            initialSpacing,
            endSpacing,
            width,
            maxValue: stepValue * noOfSections,
            mostNegativeValue: -stepValue * noOfSectionsBelowXAxis,
            yAxisThickness: 0,
            formatYLabel,
            yAxisTextStyle,
            barBorderTopLeftRadius,
            barBorderTopRightRadius,
        };
    }, [containerSize, processed]);

    return (
        <BarChart
            curved
            isAnimated
            adjustToWidth
            disableScroll
            hideDataPoints
            data={processed.chartData}
            {...chartConfig}
            pointerConfig={{
                pointerColor: themes[theme].primary,
                hidePointer1: true,
                pointerStripColor: themes[theme].primary,
                pointerLabelComponent: (items, _, idx) => {
                    return (
                        <View
                            className={clsx(
                                "institution-pointer-card",
                                idx >= processed.length / 2 ? "-ml-40!" : "",
                                chartConfig.noOfSections === 1
                                    ? "mt-45!"
                                    : chartConfig.noOfSections === 2
                                      ? "mt-30!"
                                      : "",
                            )}
                        >
                            {/* Date */}
                            <View>
                                <Text className="institution-pointer-date">
                                    {dayjs(items[0].updatedAt).format(
                                        "DD/MM/YYYY",
                                    )}
                                </Text>
                            </View>
                            {/* Value */}
                            <View>
                                <Text
                                    className={clsx(
                                        "institution-pointer-value",
                                        items[0].value > 0
                                            ? "text-candle-up!"
                                            : "text-candle-down!",
                                    )}
                                >
                                    {formatNumber(items[0].value / 1e9)} B
                                </Text>
                            </View>
                        </View>
                    );
                },
            }}
        />
    );
};

export default memo(NetIndexChart);
