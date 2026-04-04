import StatisticCard from "@/components/statistics/StatisticCard";
import { INDEX_SCORECARD } from "@/constants/data";
import { View } from "react-native";
import { s } from "react-native-size-matters";

const statistics = () => {
    const data = INDEX_SCORECARD[90];

    return (
        <View>
            <StatisticCard height={s(180)} data={data} />
        </View>
    );
};

export default statistics;
