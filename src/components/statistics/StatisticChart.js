import dayjs from "dayjs";
import { memo, useMemo, useState } from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const StatisticChart = ({
    data,
    key1,
    key2,
    color1,
    color2,
    lineType1 = "solid",
    lineType2 = "solid",
    labelColor,
    yLabelThreshold1,
    yLabelThreshold2,
    height = s(180),
    width = "100%",
    textSize = s(9),
}) => {
    const [containerSize, setContainerSize] = useState({});

    const processedData = useMemo(() => {
        const length = data.message.length;
        const arr1 = data.message.map((msg, idx) => {
            const isLabelled = idx === 0 || idx === Math.round(length / 2);
            const isLastPoint = idx === length - 1;
            return {
                tradingDate: msg.trading_date,
                value: msg[key1],
                ...(isLabelled || isLastPoint
                    ? {
                          labelComponent: () => (
                              <View
                                  style={{
                                      height: textSize * 1.5,
                                      width: textSize * 3,
                                      justifyContent: "center",
                                      marginLeft:
                                          isLastPoint && -textSize * 2.5,
                                  }}
                              >
                                  <Text
                                      style={{
                                          fontSize: textSize,
                                          color: labelColor,
                                      }}
                                  >
                                      {dayjs(msg.trading_date).format("DD/MM")}
                                  </Text>
                              </View>
                          ),
                      }
                    : {}),
            };
        });
        const arr2 = data.message.map((msg) => ({ value: msg[key2] }));
        const max = Math.max(
            ...arr1.map((v) => v.value),
            ...arr2.map((v) => v.value),
        );

        return { arr1, arr2, max, length };
    }, [data]);

    const chartConfig = useMemo(() => {
        if (Object.keys(containerSize).length === 0) return;
        const max = processedData.max;
        let noOfSections, maxValue;
        if (max <= yLabelThreshold1) {
            noOfSections = 3;
            maxValue = yLabelThreshold1;
        } else if (max <= yLabelThreshold2) {
            noOfSections = 4;
            maxValue = yLabelThreshold2;
        } else {
            noOfSections = 5;
            maxValue = 100;
        }

        const yAxisLabelWidth = textSize * 3.5;
        const endSpacing = s(15);
        const initialSpacing = s(10);
        const width = containerSize.width - yAxisLabelWidth - endSpacing;

        const xAxisLabelsHeight = textSize * 2;
        const yAxisExtraHeight = s(10);
        const height =
            containerSize.height - yAxisExtraHeight - xAxisLabelsHeight;

        return {
            initialSpacing,
            endSpacing,
            noOfSections,
            maxValue,
            width,
            yAxisLabelWidth,
            xAxisLabelsHeight,
            yAxisExtraHeight,
            height,
        };
    }, [containerSize, processedData.max]);

    return (
        <View
            style={{ width, height }}
            onLayout={(e) => {
                if (containerSize.width) return;
                setContainerSize(e.nativeEvent.layout);
            }}
        >
            {chartConfig && (
                <LineChart
                    isAnimated
                    disableScroll
                    curved
                    hideDataPoints
                    adjustToWidth
                    areaChart1
                    width={chartConfig.width}
                    height={chartConfig.height}
                    data={processedData.arr1}
                    color={color1}
                    startFillColor={color1}
                    endFillColor="transparent"
                    startOpacity="0.4"
                    endOpacity="0.1"
                    thickness={s(1.5)}
                    data2={processedData.arr2}
                    color2={color2}
                    thickness2={s(1.5)}
                    strokeDashArray1={lineType1 == "dashed" ? [4, 3] : null}
                    strokeDashArray2={lineType2 == "dashed" ? [4, 3] : null}
                    noOfSections={chartConfig.noOfSections}
                    maxValue={chartConfig.maxValue}
                    rulesType="dashed"
                    initialSpacing={chartConfig.initialSpacing}
                    endSpacing={chartConfig.endSpacing}
                    yAxisLabelWidth={chartConfig.yAxisLabelWidth}
                    yAxisLabelSuffix="%"
                    yAxisThickness={0}
                    yAxisTextStyle={{
                        color: labelColor,
                        fontSize: textSize,
                    }}
                    yAxisExtraHeight={chartConfig.yAxisExtraHeight}
                    rulesColor={labelColor}
                    xAxisColor={labelColor}
                    xAxisLabelsHeight={chartConfig.xAxisLabelsHeight}
                    pointerConfig={{
                        pointerStripColor: labelColor,
                        pointerColor: color1,
                        pointer2Color: color2,
                        pointerLabelComponent: (items, _, idx) => {
                            return (
                                <View
                                    className="statistic-pointer-card"
                                    style={{
                                        transform:
                                            idx >= processedData.length / 2
                                                ? [{ translateX: s(-90) }]
                                                : [{ translateX: s(15) }],
                                    }}
                                >
                                    {/* Date */}
                                    <View>
                                        <Text
                                            className="statistic-pointer-date"
                                            style={{ fontSize: textSize * 1.2 }}
                                        >
                                            {dayjs(items[0].tradingDate).format(
                                                "DD/MM/YYYY",
                                            )}
                                        </Text>
                                    </View>

                                    {/* Items */}
                                    <View>
                                        {/* Item 1 */}
                                        <View className="statictic-pointer-row">
                                            <View className="h-1 w-5.5 bg-candle-up" />
                                            <Text
                                                className="statistic-pointer-value"
                                                style={{
                                                    fontSize: textSize * 1.2,
                                                }}
                                            >
                                                {items[0].value}%
                                            </Text>
                                        </View>

                                        {/* Item 2 */}
                                        <View className="statictic-pointer-row">
                                            <View className="flex-row gap-0.5">
                                                {new Array(3)
                                                    .fill(0)
                                                    .map((_, idx) => (
                                                        <View
                                                            key={idx}
                                                            className="h-1 w-1.5 bg-candle-floor"
                                                        />
                                                    ))}
                                            </View>
                                            <Text
                                                className="statistic-pointer-value"
                                                style={{
                                                    fontSize: textSize * 1.2,
                                                }}
                                            >
                                                {items[1].value}%
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        },
                    }}
                />
            )}
        </View>
    );
};

export default memo(StatisticChart);
