import { FOREIGN_HISTORY } from "@/constants/data";
import { themes } from "@/constants/themes";
import { useMemo } from "react";
import { BarChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const NetIndexChart = ({ containerSize }) => {
    const data = FOREIGN_HISTORY["1M"];

    const processed = useMemo(() => {
        const arr = data.message.map((m) => ({
            value: m.netForeignValue,
            updatedAt: m.updatedAt,
        }));
        const chartData = arr.filter((v) => v.value >= 0);
        const max = Math.max(...chartData.map((v) => v.value));

        return { chartData, max };
    }, [data]);

    const chartConfig = useMemo(() => {
        const xAxisLabelsHeight = s(0);
        const yAxisExtraHeight = s(5);
        const height =
            containerSize.height - yAxisExtraHeight - xAxisLabelsHeight;

        const yAxisLabelWidth = s(35);
        const endSpacing = s(5);
        const width = containerSize.width - yAxisLabelWidth - endSpacing;

        const frontColor = themes.dark.candleUp;

        return {
            xAxisLabelsHeight,
            yAxisExtraHeight,
            height,
            yAxisLabelWidth,
            endSpacing,
            width,
            frontColor,
        };
    }, [containerHeight, processed]);

    return (
        <BarChart adjustToWidth data={processed.chartData} {...chartConfig} />
    );
};

export default NetIndexChart;
