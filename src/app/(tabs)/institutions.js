import NetIndexChart from "@/components/institutions/NetIndexChart";
import TopTickerChart from "@/components/institutions/TopTickerChart";
import LoadingOverlay from "@/components/ui/LoadingOverlay";
import PageTitle from "@/components/ui/PageTitle";
import {
    FOREIGN_HISTORY,
    PROPRIETARY_HISTORY,
    TOP_FOREIGN_TRADE,
    TOP_PROPRIETARY_TRADE,
} from "@/constants/data";
import { themes } from "@/constants/themes";
import { formatNumber } from "@/lib/utils";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import clsx from "clsx";
import { useState } from "react";
import { Appearance, Text, View } from "react-native";
import { EaseView } from "react-native-ease";

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
        data2 = TOP_PROPRIETARY_TRADE[period2];
        valueKey = "netProprietaryValue";
    }

    const leftKey = "top10Sell";
    const rightKey = "top10Buy";

    // console.log(chartSize2);

    const total1 = data.message?.reduce((t, e) => t + e[valueKey], 0);
    return (
        <View className="h-full gap-2">
            <PageTitle
                containerClassName="mb-2!"
                title="Giao dịch ròng tổ chức"
            />

            <SegmentedControl
                fontStyle={{
                    color: themes[theme].primary,
                }}
                tintColor={themes[theme].brand}
                selectedIndex={segments.indexOf(segment)}
                values={segments}
                onValueChange={(s) => {
                    setSegment(s);
                    setChartSize1({});
                    setChartSize2({});
                    setChartKey1((prev) => prev + 1);
                    setChartKey2((prev) => prev + 1);
                }}
            />

            <View
                className={clsx(
                    "flat-card py-2!",
                    data2.message[leftKey].length > 5 ? "flex-3" : "flex-7",
                )}
            >
                <View className="institution-top-ticker-legend-container">
                    {/* Title 1 */}
                    <Text className="institution-title">Theo chỉ số</Text>
                    {/* sub-segment control */}
                    <View className="w-[50%]">
                        <SegmentedControl
                            values={periods1}
                            selectedIndex={periods1.indexOf(period1)}
                            fontStyle={{
                                color: themes[theme].primary,
                            }}
                            tintColor={themes[theme].brand}
                            onValueChange={(p) => {
                                setPeriod1(p);
                                setChartKey1((prev) => prev + 1);
                            }}
                        />
                    </View>
                </View>
                {/* BarChart - Index */}
                <View className="flex-1">
                    {/* Total Value 1 */}
                    <EaseView
                        key={chartKey1}
                        initialAnimate={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "timing", duration: 500 }}
                    >
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
                    </EaseView>
                    {/* Chart */}
                    <View
                        className="flex-1 overflow-hidden"
                        onLayout={(e) => {
                            const layout = e.nativeEvent.layout;
                            // console.log("layout:", layout);

                            setChartSize1(layout);
                        }}
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
            </View>

            <View
                className={clsx(
                    "flat-card flex-4 mb-5 gap-1 py-2!",
                    data2.message[leftKey].length > 5 ? "flex-4" : "flex-3",
                )}
            >
                {/* Title & Legend */}
                <View className="mb-2 flex-row justify-between items-center">
                    {/* Title 1 */}
                    <Text className="institution-title">Theo cổ phiếu</Text>
                    <View className="w-[60%]">
                        <SegmentedControl
                            values={periods2}
                            selectedIndex={periods2.indexOf(period2)}
                            fontStyle={{
                                color: themes[theme].primary,
                            }}
                            tintColor={themes[theme].brand}
                            onValueChange={(p) => {
                                setPeriod2(p);
                                setChartKey2((prev) => prev + 1);
                            }}
                        />
                    </View>
                </View>

                {/* Chart */}
                <View
                    className="flex-1 overflow-hidden"
                    onLayout={(e) => setChartSize2(e.nativeEvent.layout)}
                >
                    {chartSize2.width && data2 ? (
                        <TopTickerChart
                            key={chartKey2}
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
    );
};

export default institutions;
