import { themes } from "@/constants/themes";
import { roundedValue } from "@/lib/utils";
import { useMemo } from "react";
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
        if (min < 0) {
            const range = max - min;
            stepValue = range / baseSections;
            noOfSections = Math.ceil(max / stepValue);
            noOfSectionsBelowXAxis = Math.ceil(-min / stepValue);
            const totalOfSections = noOfSections + noOfSectionsBelowXAxis;

            stepHeight = (initialHeight - extraHeight) / totalOfSections;
            height = stepHeight * noOfSections;
        }

        // Width
        const yAxisLabelWidth = maxAbs / 1e9 < 9000 ? s(45) : s(50);
        const barWidth = length >= 10 ? s(10) : length >= 5 ? s(20) : s(25);
        const initialSpacing =
            length >= 10 ? s(2) : length >= 5 ? s(10) : s(50);
        const endSpacing = initialSpacing;

        const width = containerSize.width - yAxisLabelWidth - endSpacing;
        const maxPlotWidth = width - initialSpacing;
        const spacing = calculateMaxSpacing(length, barWidth, maxPlotWidth);
        const formatYLabel = (label) => {
            return label !== "0" ? roundedValue(label / 1e9) : label;
        };

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
            initialSpacing,
            endSpacing,
            width,
            maxValue: stepValue * noOfSections,
            mostNegativeValue: -stepValue * noOfSectionsBelowXAxis,
            formatYLabel,
            yAxisThickness: 0,
        };
    }, [containerSize, processed]);

    return (
        <BarChart
            curved
            isAnimated
            adjustToWidth
            disableScroll
            hideDataPoints
            yAxisTextStyle={{
                fontSize: textSize,
                color: themes[theme].primary,
            }}
            data={processed.chartData}
            {...chartConfig}
        />
    );
};

export default NetIndexChart;
