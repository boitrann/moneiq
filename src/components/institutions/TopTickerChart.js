import { themes } from "@/constants/themes";
import { memo, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { s } from "react-native-size-matters";
import LoadingOverlay from "../ui/LoadingOverlay";

const TopTickerChart = ({
    theme,
    containerSize,
    data,
    leftKey,
    rightKey,
    barHeight = s(16),
    labelSize = s(10),
    valueSize = s(10),
    leftLabelColor,
    leftBarColor,
    leftValueColor,
    rightLabelColor,
    rightBarColor,
    rightValueColor,
    prefix,
}) => {
    const processedData = useMemo(() => {
        const left = data.message[leftKey];
        const right = data.message[rightKey];
        return { left, right };
    }, [data]);

    const [chartSize, setChartSize] = useState({});

    const [chartWidth, setChartWidth] = useState(0);
    const labelWidth = s(35);
    const maxBarWidth = chartWidth - labelWidth;

    const chartConfig = useMemo(() => {
        const labelHeight = containerSize.height / 8;
        const chartHeight = containerSize.height - labelHeight;

        const numBars = Math.max(
            processedData.left.length,
            processedData.right.length,
        );
        const maxBarHeight = chartHeight / numBars;
        const actualBarHeight = Math.min(barHeight, maxBarHeight);

        const gap = Math.min(
            numBars > 1
                ? (chartHeight - actualBarHeight * numBars) / (numBars - 1)
                : 0,
            s(5),
        );

        return {
            labelHeight,
            chartHeight,
            numBars,
            maxBarHeight,
            actualBarHeight,
            gap,
        };
    }, [containerSize, data, barHeight]);

    const rightData = useMemo(() => {
        if (!processedData.right.length) return [];

        const max = Math.max(
            ...processedData.right.map((item) => item.value),
            0,
        );
        return processedData.right.map((item) => ({
            ...item,
            width: (item.value * maxBarWidth) / max,
        }));
    }, [processedData.right, maxBarWidth]);

    const leftData = useMemo(() => {
        if (!processedData.left.length) return [];
        const max = Math.max(
            ...processedData.left.map((item) => item.value),
            0,
        );
        return processedData.left.map((item) => ({
            ...item,
            width: (item.value * maxBarWidth) / max,
        }));
    }, [processedData.left, maxBarWidth]);

    const formatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 1,
            }),
        [],
    );

    return (
        <View className="flex-1">
            {/* LABELS */}
            <View className="institution-top-ticker-legend-container">
                <View className="institution-top-ticker-legend-group ">
                    <View
                        style={{ backgroundColor: themes[theme].candleDown }}
                        className="institution-top-ticker-legend-icon"
                    />
                    <Text className="institution-top-ticker-legend">
                        Top GT bán ròng
                    </Text>
                </View>
                <View className="institution-top-ticker-legend-group ">
                    <View
                        style={{ backgroundColor: themes[theme].candleUp }}
                        className="institution-top-ticker-legend-icon"
                    />
                    <Text className="institution-top-ticker-legend">
                        Top GT mua ròng
                    </Text>
                </View>
            </View>

            {/* CHART */}
            {chartSize ? (
                <View
                    className="flex-row"
                    onLayout={(e) => setChartSize(e.nativeEvent.layout)}
                >
                    {/* left side */}
                    <View
                        className="flex-1"
                        onLayout={(e) => {
                            const w = e.nativeEvent.layout.width;
                            if (w !== chartWidth) setChartWidth(w);
                        }}
                    >
                        {leftData.map((item) => {
                            return (
                                <View
                                    key={item.symbol}
                                    className="institution-top-ticker-row"
                                    style={{ transform: [{ scaleX: -1 }] }}
                                >
                                    <View
                                        style={{
                                            width: labelWidth,
                                            transform: [{ scaleX: -1 }],
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.itemLabel,
                                                {
                                                    fontSize: labelSize,
                                                },
                                                !!leftLabelColor && {
                                                    color: leftLabelColor,
                                                },
                                            ]}
                                        >
                                            {item.symbol.slice(0, 3)}
                                        </Text>
                                    </View>
                                    <View style={styles.barContainer}>
                                        <View
                                            style={[
                                                styles.itemBar,
                                                {
                                                    height: chartConfig.actualBarHeight,
                                                    width: item.width,
                                                    backgroundColor:
                                                        leftBarColor,
                                                },
                                            ]}
                                        ></View>
                                        <View
                                            style={{
                                                position: "absolute",
                                                left: s(5),
                                                transform: [
                                                    {
                                                        scaleX: -1,
                                                    },
                                                ],
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.textValue,
                                                    { fontSize: valueSize },
                                                    !!leftValueColor && {
                                                        color: leftValueColor,
                                                    },
                                                ]}
                                            >
                                                {formatter.format(item.value)}
                                                {prefix}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </View>

                    {/* right side */}
                    <View
                        style={[
                            styles.chartContainer,
                            { gap: chartConfig.gap, borderLeftWidth: s(0.2) },
                        ]}
                    >
                        {rightData.map((item) => (
                            <View key={item.symbol} style={styles.chartItem}>
                                <View style={{ width: labelWidth }}>
                                    <Text
                                        style={[
                                            styles.itemLabel,
                                            { fontSize: labelSize },
                                            !!rightLabelColor && {
                                                color: rightLabelColor,
                                            },
                                        ]}
                                    >
                                        {item.symbol.slice(0, 3)}
                                    </Text>
                                </View>
                                <View style={styles.barContainer}>
                                    <View
                                        style={[
                                            styles.itemBar,
                                            {
                                                height: chartConfig.actualBarHeight,
                                                width: item.width,
                                                backgroundColor: rightBarColor,
                                            },
                                        ]}
                                    ></View>
                                    <View
                                        style={{
                                            position: "absolute",
                                            left: s(5),
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styles.textValue,
                                                { fontSize: valueSize },
                                                !!rightBarColor && {
                                                    color: rightValueColor,
                                                },
                                            ]}
                                        >
                                            {formatter.format(item.value)}
                                            {prefix}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            ) : (
                <LoadingOverlay />
            )}
        </View>
    );
};

export default memo(TopTickerChart);

const styles = StyleSheet.create({
    chartContainer: {
        flex: 1,
    },
    chartItem: {
        flexDirection: "row",
        alignItems: "center",
    },
    labelContainer: {
        width: s(35),
    },
    barContainer: {
        flex: 1,
        justifyContent: "center",
    },
    itemLabel: {
        textAlign: "center",
    },
    itemBar: {
        opacity: 0.3,
    },
    textValue: {
        fontSize: s(12),
    },
    titleText: {
        fontSize: s(10),
        fontWeight: "bold",
    },
});
