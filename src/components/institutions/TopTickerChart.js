import { themes } from "@/constants/themes";
import { formatNumber } from "@/lib/utils";
import { memo, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { EaseView } from "react-native-ease";
import { s } from "react-native-size-matters";
import PressableCard from "../ui/PressableCard";

const TopTickerChart = ({
    theme,
    containerSize,
    data,
    leftKey,
    rightKey,
    barHeight = s(20),
    leftBarColor,
    leftValueColor,
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

    const chartConfig = useMemo(() => {
        if (!chartSize.height || !chartSize.width) return;

        const totalBarsHeight = chartSize.height;

        const numBars = Math.max(
            processedData.left.length,
            processedData.right.length,
        );

        let actualBarHeight = barHeight;
        let gap =
            numBars > 1
                ? (totalBarsHeight - actualBarHeight * numBars) / (numBars - 1)
                : s(0);

        if (gap < 1) {
            gap = s(1);
            actualBarHeight = (totalBarsHeight - gap * (numBars - 1)) / numBars;
        }

        const labelWidth = actualBarHeight * 1.8;
        const maxBarWidth = chartSize.width - labelWidth;

        return {
            numBars,
            maxBarWidth,
            actualBarHeight,
            gap,
            labelWidth,
        };
    }, [containerSize, data, barHeight]);

    const leftData = useMemo(() => {
        if (!chartConfig) return;
        const max = Math.min(
            ...processedData.left.map((item) => item.value),
            0,
        );

        return processedData.left.map((item) => {
            return {
                ...item,
                width: (item.value * chartConfig.maxBarWidth) / max,
            };
        });
    }, [processedData.left, chartConfig.maxBarWidth]);

    const rightData = useMemo(() => {
        if (!chartConfig) return;
        const max = Math.max(
            ...processedData.right.map((item) => item.value),
            0,
        );
        return processedData.right.map((item) => ({
            ...item,
            width: (item.value * chartConfig.maxBarWidth) / max,
        }));
    }, [processedData.right, chartConfig.maxBarWidth]);

    return (
        <View className="flex-1">
            {/* LEGEND */}
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
            <View className="flex-row flex-1">
                {/* left side */}
                <View
                    className="institution-top-ticker-col border-r border-r-blur"
                    onLayout={(e) => {
                        setChartSize(e.nativeEvent.layout);
                    }}
                >
                    {chartConfig &&
                        leftData.map((item) => {
                            return (
                                <PressableCard
                                    key={item.symbol}
                                    className="institution-top-ticker-row"
                                    style={{
                                        transform: [{ scaleX: -1 }],
                                        height: chartConfig.actualBarHeight,
                                    }}
                                >
                                    <View
                                        className="institution-top-ticker-label-container"
                                        style={{
                                            transform: [{ scaleX: -1 }],
                                            width: chartConfig.labelWidth,
                                        }}
                                    >
                                        <Text
                                            className="institution-top-ticker-label"
                                            style={{
                                                fontSize:
                                                    chartConfig.actualBarHeight /
                                                    2,
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.symbol}
                                        </Text>
                                    </View>

                                    <View className="institution-bar">
                                        {/* Animate */}
                                        <EaseView
                                            style={{
                                                height: "100%",
                                                opacity: 0.3,
                                                width: item.width,
                                                backgroundColor: leftBarColor,
                                                borderTopEndRadius: s(3),
                                                borderBottomEndRadius: s(3),
                                            }}
                                            initialAnimate={{
                                                translateX: -item.width,
                                            }}
                                            animate={{
                                                translateX: 0,
                                            }}
                                            transition={{
                                                type: "timing",
                                                duration: 1000,
                                            }}
                                        />

                                        <EaseView
                                            style={{
                                                position: "absolute",
                                                left: s(5),
                                                transform: [{ scaleX: -1 }],
                                            }}
                                            initialAnimate={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                type: "timing",
                                                duration: 1000,
                                            }}
                                        >
                                            <Text
                                                className="text-sm"
                                                style={[
                                                    !!leftValueColor && {
                                                        color: leftValueColor,
                                                    },
                                                ]}
                                            >
                                                {formatNumber(
                                                    -item.value / 1e9,
                                                    1,
                                                )}
                                                {prefix}
                                            </Text>
                                        </EaseView>
                                    </View>
                                </PressableCard>
                            );
                        })}
                </View>

                {/* right side */}
                <View className="institution-top-ticker-col">
                    {chartConfig &&
                        rightData.map((item) => {
                            return (
                                <PressableCard
                                    key={item.symbol}
                                    className="institution-top-ticker-row"
                                    style={{
                                        height: chartConfig.actualBarHeight,
                                    }}
                                >
                                    <View
                                        className="institution-top-ticker-label-container"
                                        style={{
                                            width: chartConfig.labelWidth,
                                        }}
                                    >
                                        <Text
                                            className="institution-top-ticker-label"
                                            style={{
                                                fontSize:
                                                    chartConfig.actualBarHeight /
                                                    2,
                                            }}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {item.symbol}
                                        </Text>
                                    </View>

                                    <View className="institution-bar">
                                        <EaseView
                                            style={{
                                                height: "100%",
                                                opacity: 0.3,
                                                width: item.width,
                                                backgroundColor: rightBarColor,

                                                borderTopEndRadius: s(3),
                                                borderBottomEndRadius: s(3),
                                            }}
                                            initialAnimate={{
                                                translateX: -item.width,
                                            }}
                                            animate={{
                                                translateX: 0,
                                            }}
                                            transition={{
                                                type: "timing",
                                                duration: 1000,
                                            }}
                                        />
                                        <EaseView
                                            style={{
                                                position: "absolute",
                                                left: s(5),
                                            }}
                                            initialAnimate={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{
                                                type: "timing",
                                                duration: 1000,
                                            }}
                                        >
                                            <Text
                                                className="text-sm"
                                                style={[
                                                    !!rightValueColor && {
                                                        color: rightValueColor,
                                                    },
                                                ]}
                                            >
                                                {formatNumber(
                                                    item.value / 1e9,
                                                    1,
                                                )}
                                                {prefix}
                                            </Text>
                                        </EaseView>
                                    </View>
                                </PressableCard>
                            );
                        })}
                </View>
            </View>
        </View>
    );
};

export default memo(TopTickerChart);
