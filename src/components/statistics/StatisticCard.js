import { colors } from "@/constants/colors";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";
import { s } from "react-native-size-matters";

const StatisticCard = ({
    data,
    height = s(180),
    width = "100%",
    textSize = s(8),
}) => {
    const [containerSize, setContainerSize] = useState({});

    const processedData = useMemo(() => {
        const length = data.message.length;
        const short = data.message.map((msg, idx) => {
            const isLabelled = idx === 0 || idx === Math.round(length / 2);
            const isLastPoint = idx === length - 1;
            return {
                value: msg["1w_ma20_vol"],
                ...(isLabelled || isLastPoint
                    ? {
                          labelComponent: () => (
                              <View
                                  style={{
                                      height: textSize * 1.5,
                                      width: textSize * 3,
                                      justifyContent: "center",
                                      marginLeft: isLastPoint && s(-20),
                                      //   borderWidth: 1,
                                      //   borderColor: "white",
                                  }}
                              >
                                  <Text
                                      style={{
                                          fontSize: textSize,
                                          color: colors.dark.blur,
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
        const long = data.message.map((msg) => ({ value: msg["1m_ma50_vol"] }));
        const max = Math.max(
            ...short.map((v) => v.value),
            ...long.map((v) => v.value),
            // 100,
        );

        return { short, long, max };
    }, [data]);

    const chartConfig = useMemo(() => {
        if (Object.keys(containerSize).length === 0) return;
        const max = processedData.max;
        let noOfSections, maxValue, yAxisLabelWidth;
        if (max <= 60) {
            noOfSections = 3;
            maxValue = 60;
            yAxisLabelWidth = s(25);
        } else if (max <= 80) {
            noOfSections = 4;
            maxValue = 80;
            yAxisLabelWidth = s(25);
        } else {
            noOfSections = 5;
            maxValue = 100;
            yAxisLabelWidth = s(30);
        }

        const endSpacing = s(5);
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
            className="statistic-card"
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
                    data={processedData.short}
                    color={colors.dark.up500}
                    startFillColor={colors.dark.up}
                    endFillColor="transparent"
                    startOpacity="0.5"
                    endOpacity="0.1"
                    thickness={s(1.5)}
                    data2={processedData.long}
                    color2={colors.dark.floor}
                    thickness2={s(1.5)}
                    strokeDashArray2={[4, 3]}
                    noOfSections={chartConfig.noOfSections}
                    maxValue={chartConfig.maxValue}
                    rulesType="dashed"
                    initialSpacing={chartConfig.initialSpacing}
                    endSpacing={chartConfig.endSpacing}
                    yAxisLabelWidth={chartConfig.yAxisLabelWidth}
                    yAxisLabelSuffix="%"
                    yAxisThickness={0}
                    yAxisTextStyle={{
                        color: colors.dark.blur,
                        fontSize: textSize,
                    }}
                    yAxisExtraHeight={chartConfig.yAxisExtraHeight}
                    rulesColor={colors.dark.blur}
                    xAxisColor={colors.dark.blur}
                    xAxisLabelsHeight={chartConfig.xAxisLabelsHeight}
                />
            )}
        </View>
    );
};

export default StatisticCard;
