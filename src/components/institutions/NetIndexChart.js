import { themes } from "@/constants/themes";
import { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const NetIndexChart = ({ data, containerSize, theme }) => {
    const processed = useMemo(() => {
        const arr = data.message.map((m) => ({
            value: m.netForeignValue,
            updatedAt: m.updatedAt,
            frontColor:
                m.netForeignValue >= 0
                    ? themes[theme].candleUp
                    : themes[theme].candleDown,
        }));
        // const chartData = arr;
        const chartData = arr.filter((v) => v.value >= 0);
        const max = Math.max(...chartData.map((v) => v.value));
        const min = Math.min(...chartData.map((v) => v.value));
        const length = chartData.length;

        return { chartData, max, min, length };
    }, [data]);

    const calculateMaxSpacing = (length, barWidth, maxPlotWidth) => {
        if (length <= 1) return 0;
        return (maxPlotWidth - length * barWidth) / (length - 1);
    };

    const chartConfig = useMemo(() => {
        // maxValue
        // mostNegativeValue
        // stepValue
        // stepHeight
        // height
        // noOfSections
        // noOfSectionsBelowXAxis
        const max = Math.max(processed.max, 0);
        const min = Math.min(processed.min, 0);
        const length = processed.length;

        const xAxisLabelsHeight = s(0);
        const yAxisExtraHeight = s(5);

        const totalOfSections = 4;
        let height =
            containerSize.height - yAxisExtraHeight - xAxisLabelsHeight;
        const stepHeight = height / totalOfSections;

        let noOfSections = 4;
        // Negative chart
        if (min < 0 || max > 0) {
            const range = max - min;
            noOfSections = Math.floor((max * totalOfSections) / range);
            height = noOfSections * stepHeight;
        }

        const yAxisLabelWidth = s(35);

        const barWidth = length >= 10 ? s(10) : length >= 5 ? s(20) : s(25);

        const initialSpacing =
            length >= 10 ? s(2) : length >= 5 ? s(10) : s(50);
        const endSpacing = length >= 10 ? s(1) : length >= 5 ? s(10) : s(50);

        const width = containerSize.width - yAxisLabelWidth - endSpacing;
        const maxPlotWidth = width - initialSpacing;

        let spacing = calculateMaxSpacing(length, barWidth, maxPlotWidth);

        return {
            noOfSections,
            xAxisLabelsHeight,
            yAxisExtraHeight,
            height,
            stepHeight,
            noOfSections,
            barWidth,
            yAxisLabelWidth,
            initialSpacing,
            spacing,
            endSpacing,
            width,
        };
    }, [containerSize, processed]);

    return (
        <BarChart
            isAnimated
            adjustToWidth
            disableScroll
            data={processed.chartData}
            {...chartConfig}
        />
    );
};

export default NetIndexChart;
