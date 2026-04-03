import { Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const statistics = () => {
    const data = [
        { value: 110 },
        { value: 130 },
        { value: 120 },
        { value: 160 },
        { value: 190 },
    ];
    return (
        <View>
            <LineChart
                data={data}
                yAxisColor="white"
                yAxisTextStyle={{ color: "white" }}
                xAxisColor="white"
                color1="white"
                dataPointsColor="white"
                hideRules
                yAxisOffset={Math.min(...data.map((v) => v.value))}
                maxValue={200}
                pointerConfig={{
                    pointerLabelComponent: (item) => {
                        console.log(item);

                        return (
                            <View className="border border-c5 size-5">
                                <Text className="text-c5 font-bold">
                                    {item.value}
                                </Text>
                            </View>
                        );
                    },
                }}
            />
        </View>
    );
};

export default statistics;
