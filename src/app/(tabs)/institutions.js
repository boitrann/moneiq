import NetIndexChart from "@/components/institutions/NetIndexChart";
import TopTickerChart from "@/components/institutions/TopTickerChart";
import ErrorOverlay from "@/components/ui/ErrorOverlay";
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
import { useMemo, useState } from "react";
import { Appearance, Text, View } from "react-native";
import { EaseView } from "react-native-ease";

const institutions = () => {
    const theme = Appearance.getColorScheme();

    const [chartSize1, setChartSize1] = useState({});
    const [chartSize2, setChartSize2] = useState({});

    const [segment, setSegment] = useState("Nước ngoài");
    const [period1, setPeriod1] = useState("1W");
    const [period2, setPeriod2] = useState("1W");

    const segments = ["Nước ngoài", "Tự doanh"];
    const periods1 = ["1W", "1M", "1Y"];
    const periods2 = ["1D", "1W", "1M", "1Y"];

    // const { data, isLoading, error } = useQuery({
    //     queryKey: ["institution-data", segment, period1],
    //     queryFn: () =>
    //         segment === "Nước ngoài"
    //             ? retrieveForeignHistorical(period1)
    //             : retrieveProprietaryHistorical(period1),
    //     select: (data) => JSON.parse(JSON.parse(data.data).result),
    //     placeholderData: (prev) => prev,
    // });

    const data = useMemo(() => {
        return segment === "Nước ngoài"
            ? FOREIGN_HISTORY[period1]
            : PROPRIETARY_HISTORY[period1];
    }, [segment, period1]);
    const isLoading = false;
    const error = undefined;

    const valueKey =
        segment === "Nước ngoài" ? "netForeignValue" : "netProprietaryValue";

    const total =
        data?.message?.reduce((t, e) => {
            const val = Number(e?.[valueKey]) || 0;
            return t + val;
        }, 0) ?? 0;

    // const {
    //     data: data2,
    //     isLoading: isLoading2,
    //     error: error2,
    // } = useQuery({
    //     queryKey: ["top-trade-data", segment, period2],
    //     queryFn: () =>
    //         segment === "Nước ngoài"
    //             ? retrieveTopForeignTrade(period2)
    //             : retrieveTopProprietaryTrade(period2),
    //     select: (data) => JSON.parse(JSON.parse(data.data).result),
    //     placeholderData: (prev) => prev,
    // });

    const data2 = useMemo(() => {
        return segment === "Nước ngoài"
            ? TOP_FOREIGN_TRADE[period2]
            : TOP_PROPRIETARY_TRADE[period2];
    }, [segment, period2]);
    const isLoading2 = false;
    const error2 = undefined;

    const leftKey = "top10Sell";
    const rightKey = "top10Buy";

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
                onValueChange={(s) => setSegment(s)}
            />

            <View
                className={clsx(
                    "flat-card py-2!",
                    !data2?.message
                        ? "flex-7"
                        : data2.message[leftKey].length > 5
                          ? "flex-3"
                          : "flex-7",
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
                            }}
                        />
                    </View>
                </View>
                {/* BarChart - Index */}
                <View className="flex-1">
                    {/* Total Value 1 */}
                    <EaseView
                        key={`${period1}-${chartSize1.width}-${chartSize1.height}`}
                        initialAnimate={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ type: "timing", duration: 500 }}
                    >
                        <Text
                            className={clsx(
                                "institution-value",
                                total > 0
                                    ? "text-candle-up"
                                    : "text-candle-down",
                            )}
                        >
                            {formatNumber(total / 1e9)} B
                        </Text>
                    </EaseView>
                    {/* Chart */}
                    <View
                        className="flex-1 overflow-hidden"
                        onLayout={(e) => setChartSize1(e.nativeEvent.layout)}
                    >
                        {isLoading ? (
                            <LoadingOverlay size="large" />
                        ) : error ? (
                            <ErrorOverlay message={error.message} />
                        ) : (
                            chartSize1.width &&
                            chartSize1.height && (
                                <NetIndexChart
                                    key={`${period1}-${chartSize1.width}-${chartSize1.height}`}
                                    valueKey={valueKey}
                                    data={data}
                                    containerSize={chartSize1}
                                    theme={theme}
                                />
                            )
                        )}
                    </View>
                </View>
            </View>

            <View
                className={clsx(
                    "flat-card flex-4 mb-5 gap-1 py-2!",
                    !data2?.message
                        ? "flex-3"
                        : data2.message[leftKey].length > 5
                          ? "flex-4"
                          : "flex-3",
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
                            onValueChange={(p) => setPeriod2(p)}
                        />
                    </View>
                </View>

                {/* Chart */}
                <View
                    className="flex-1 overflow-hidden"
                    onLayout={(e) => setChartSize2(e.nativeEvent.layout)}
                >
                    {isLoading2 ? (
                        <LoadingOverlay size="large" />
                    ) : error2 ? (
                        <ErrorOverlay message={error2.message} />
                    ) : (
                        chartSize2.width &&
                        chartSize2.height && (
                            <TopTickerChart
                                key={period2}
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
                        )
                    )}
                </View>
            </View>
        </View>
    );
};

export default institutions;
