import { memo, useMemo, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { s } from "react-native-size-matters";

const TopTickerChart = ({
    totalHeight,
    left,
    right,
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
    const [chartWidth, setChartWidth] = useState(0);
    const labelWidth = s(35);
    const maxBarWidth = chartWidth - labelWidth;

    const chartConfig = useMemo(() => {
        const labelHeight = totalHeight / 8;
        const chartHeight = totalHeight - labelHeight;

        const numBars = Math.max(left.length, right.length);
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
    }, [totalHeight, left.length, right.length, barHeight]);

    const rightData = useMemo(() => {
        if (!right.length) return [];

        const maxBuy = Math.max(...right.map((item) => item.value), 0);
        return right.map((item) => ({
            ...item,
            width: (item.value * maxBarWidth) / maxBuy,
        }));
    }, [right, maxBarWidth]);

    const leftData = useMemo(() => {
        if (!left.length) return [];
        const maxSell = Math.max(...left.map((item) => item.value), 0);
        return left.map((item) => ({
            ...item,
            width: (item.value * maxBarWidth) / maxSell,
        }));
    }, [left, maxBarWidth]);

    const formatter = useMemo(
        () =>
            new Intl.NumberFormat("en-US", {
                maximumFractionDigits: 1,
            }),
        [],
    );

    return (
        <View>
            {/* LABELS */}
            <View
                style={{
                    height: chartConfig.labelHeight,
                    flexDirection: "row",
                    justifyContent: "space-between",
                }}
            >
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: s(6),
                    }}
                >
                    <View
                        style={{
                            width: s(8),
                            height: s(8),
                            borderRadius: s(4),
                            backgroundColor: leftValueColor,
                        }}
                    />
                    <Text style={styles.titleText}>Top GT bán ròng</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <View
                            style={{
                                width: s(8),
                                height: s(8),
                                borderRadius: s(4),
                                backgroundColor: rightValueColor,
                            }}
                        />
                        <Text style={styles.titleText}>Top GT mua ròng</Text>
                    </View>
                </View>
            </View>

            {/* CHART */}
            <View
                style={{
                    // height: chartConfig.chartHeight,
                    // borderWidth: 1,
                    flexDirection: "row",
                }}
            >
                {/* left side */}
                <View
                    style={[styles.chartContainer, { gap: chartConfig.gap }]}
                    onLayout={(e) => {
                        const w = e.nativeEvent.layout.width;
                        if (w !== chartWidth) setChartWidth(w);
                    }}
                >
                    {leftData.map((item) => (
                        <View
                            key={item.label}
                            style={[
                                styles.chartItem,
                                { transform: [{ scaleX: -1 }] },
                            ]}
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
                                    {item.label.length === 3
                                        ? item.label
                                        : item.label.slice(0, 3) + "..."}
                                </Text>
                            </View>
                            <View style={styles.barContainer}>
                                <View
                                    style={[
                                        styles.itemBar,
                                        {
                                            height: chartConfig.actualBarHeight,
                                            width: item.width,
                                            backgroundColor: leftBarColor,
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
                    ))}
                </View>

                {/* right side */}
                <View
                    style={[
                        styles.chartContainer,
                        { gap: chartConfig.gap, borderLeftWidth: s(0.2) },
                    ]}
                >
                    {rightData.map((item) => (
                        <View key={item.label} style={styles.chartItem}>
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
                                    {item.label.length === 3
                                        ? item.label
                                        : item.label.slice(0, 3) + "..."}
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
