import { themes } from "@/constants/themes";
import { formatNumber } from "@/lib/utils";
import { memo, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { s } from "react-native-size-matters";
import LoadingOverlay from "../ui/LoadingOverlay";

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

        const maxBarWidth = chartSize.width;
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

        if (gap <= 0) {
            gap = s(1);
            actualBarHeight = (totalBarsHeight - gap * (numBars - 1)) / numBars;
        }

        return {
            numBars,
            maxBarWidth,
            actualBarHeight,
            gap,
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
                    className="flex-1"
                    onLayout={(e) => {
                        setChartSize(e.nativeEvent.layout);
                    }}
                >
                    {chartConfig ? (
                        <View className="institution-bars-container">
                            {leftData.map((item) => {
                                return (
                                    <View
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
                                                width: chartConfig.actualBarHeight,
                                            }}
                                        >
                                            <Text
                                                className="institution-top-ticker-label"
                                                style={{
                                                    fontSize:
                                                        chartConfig.actualBarHeight /
                                                        2,
                                                }}
                                            >
                                                {item.symbol.slice(0, 3)}
                                            </Text>
                                        </View>

                                        <View className="institution-bar">
                                            <View
                                                className="flex-1 opacity-30"
                                                style={{
                                                    width: item.width,
                                                    backgroundColor:
                                                        leftBarColor,
                                                }}
                                            ></View>
                                            <View
                                                className="absolute left-2"
                                                style={{
                                                    transform: [{ scaleX: -1 }],
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
                                                        item.value / 1e9,
                                                        1,
                                                    )}
                                                    {prefix}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <LoadingOverlay />
                    )}
                </View>

                {/* right side */}
                <View className="flex-1">
                    {chartConfig ? (
                        <View className="institution-bars-container">
                            {rightData.map((item) => {
                                return (
                                    <View
                                        key={item.symbol}
                                        className="institution-top-ticker-row"
                                        style={{
                                            height: chartConfig.actualBarHeight,
                                        }}
                                    >
                                        <View
                                            className="institution-top-ticker-label-container"
                                            style={{
                                                width: chartConfig.actualBarHeight,
                                            }}
                                        >
                                            <Text
                                                className="institution-top-ticker-label"
                                                style={{
                                                    fontSize:
                                                        chartConfig.actualBarHeight /
                                                        2,
                                                }}
                                            >
                                                {item.symbol.slice(0, 3)}
                                            </Text>
                                        </View>

                                        <View className="institution-bar">
                                            <View
                                                className="flex-1 opacity-30"
                                                style={{
                                                    width: item.width,
                                                    backgroundColor:
                                                        rightBarColor,
                                                }}
                                            ></View>
                                            <View className="absolute left-2">
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
                                            </View>
                                        </View>
                                    </View>
                                );
                            })}
                        </View>
                    ) : (
                        <LoadingOverlay />
                    )}
                </View>
            </View>
        </View>
    );
};

export default memo(TopTickerChart);
