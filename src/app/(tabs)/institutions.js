import NetIndexChart from "@/components/institutions/NetIndexChart";
import TopTickerChart from "@/components/institutions/TopTickerChart";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTitle from "@/components/ui/PageTitle";
import {
    FOREIGN_HISTORY,
    PROPRIETARY_HISTORY,
    TOP_FOREIGN_TRADE,
} from "@/constants/data";
import { themes } from "@/constants/themes";
import { formatNumber } from "@/lib/utils";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import clsx from "clsx";
import { useState } from "react";
import { Appearance, Text, View } from "react-native";

const institutions = () => {
    const theme = Appearance.getColorScheme();

    const [chartKey1, setChartKey1] = useState(0);
    const [chartKey2, setChartKey2] = useState(0);

    const [chartSize1, setChartSize1] = useState({});
    const [chartSize2, setChartSize2] = useState({});

    const [segment, setSegment] = useState("Nước ngoài");
    const [period1, setPeriod1] = useState("1M");
    const [period2, setPeriod2] = useState("1W");

    const segments = ["Nước ngoài", "Tự doanh"];
    const periods1 = ["1W", "1M", "1Y"];
    const periods2 = ["1D", "1W", "1M", "1Y"];

    let data, data2, valueKey;
    if (segment === "Nước ngoài") {
        data = FOREIGN_HISTORY[period1];
        valueKey = "netForeignValue";
        data2 = TOP_FOREIGN_TRADE[period2];
    } else {
        data = PROPRIETARY_HISTORY[period1];
        data2 = PROPRIETARY_HISTORY[period2];
        valueKey = "netProprietaryValue";
    }

    const leftKey = "top10Sell";
    const rightKey = "top10Buy";

    const total1 = data.message?.reduce((t, e) => t + e[valueKey], 0);
    return (
        <View className="h-full">
            <PageTitle title="Giao dịch ròng tổ chức" />

            <SegmentedControl
                fontStyle={{
                    color: themes[theme].primary,
                }}
                tintColor={themes[theme].brand}
                selectedIndex={segments.indexOf(segment)}
                values={segments}
                onValueChange={(s) => {
                    setChartKey1((prev) => prev + 1);
                    setChartKey2((prev) => prev + 1);
                    setSegment(s);
                }}
            />

            <View className="flat-card flex-1 my-5">
                {/* sub-segment control */}
                <View className="w-[50%] self-end">
                    <SegmentedControl
                        values={periods1}
                        selectedIndex={periods1.indexOf(period1)}
                        fontStyle={{
                            color: themes[theme].primary,
                        }}
                        tintColor={themes[theme].brand}
                        onValueChange={(p) => {
                            setChartKey1((prev) => prev + 1);
                            setPeriod1(p);
                        }}
                    />
                </View>

                {/* Charts */}
                <View className="flex-1 gap-5">
                    {/* BarChart - Index */}
                    <View className="flex-1">
                        {/* Title & Legend */}
                        <View className="mb-2 gap-1">
                            {/* Title 1 */}
                            <Text className="institution-title">
                                Theo chỉ số
                            </Text>
                            {/* Total Value 1 */}
                            <View>
                                <Text
                                    className={clsx(
                                        "institution-value",
                                        total1 > 0
                                            ? "text-candle-up"
                                            : "text-candle-down",
                                    )}
                                >
                                    {formatNumber(total1 / 1e9)} B
                                </Text>
                            </View>
                        </View>

                        {/* Chart */}
                        <View
                            className="flex-1 overflow-hidden"
                            onLayout={(e) =>
                                setChartSize1(e.nativeEvent.layout)
                            }
                        >
                            {chartSize1.width && data ? (
                                <NetIndexChart
                                    key={chartKey1}
                                    valueKey={valueKey}
                                    data={data}
                                    containerSize={chartSize1}
                                    theme={theme}
                                />
                            ) : (
                                <LoadingOverlay />
                            )}
                        </View>
                    </View>

                    {/* DivergentChart */}
                    <View className="flex-1">
                        {/* Title & Legend */}
                        <View className="mb-2 flex-row justify-between items-center">
                            {/* Title 1 */}
                            <Text className="institution-title">
                                Theo cổ phiếu
                            </Text>
                            <View className="w-[50%]">
                                <SegmentedControl
                                    values={periods2}
                                    selectedIndex={periods2.indexOf(period2)}
                                    fontStyle={{
                                        color: themes[theme].primary,
                                    }}
                                    tintColor={themes[theme].brand}
                                    onValueChange={(p) => {
                                        setChartKey2((prev) => prev + 1);
                                        setPeriod2(p);
                                    }}
                                />
                            </View>
                        </View>

                        {/* Chart */}
                        <View
                            className="flex-1 overflow-hidden"
                            onLayout={(e) =>
                                setChartSize2(e.nativeEvent.layout)
                            }
                        >
                            {chartSize2.width && data2 ? (
                                <TopTickerChart
                                    theme={theme}
                                    containerSize={chartSize2}
                                    data={data2}
                                    leftKey={leftKey}
                                    rightKey={rightKey}
                                    leftLabelColor={themes[theme].candleDown}
                                    rightLabelColor={themes[theme].candleUp}
                                    leftValueColor={themes[theme].candleDown}
                                    rightValueColor={themes[theme].candleUp}
                                    leftBarColor={themes[theme].candleDown}
                                    rightBarColor={themes[theme].candleUp}
                                />
                            ) : (
                                <LoadingOverlay />
                            )}
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default institutions;
