import IndustryCard from "@/components/industries/IndustryCard";
import { INDUSTRIES_HISTORICAL } from "@/constants/data";
import { useMemo } from "react";
import { FlatList, View } from "react-native";

const industries = () => {
    const data = useMemo(() => {
        return Object.entries(INDUSTRIES_HISTORICAL)
            .map(([industryCode, arr]) => {
                const sortedByDate = [...arr].sort(
                    (a, b) => new Date(a.date) - new Date(b.date),
                );

                const first = sortedByDate[0].indexValues.IndexClose;
                const last =
                    sortedByDate[sortedByDate.length - 1].indexValues
                        .IndexClose;
                const percent = first !== 0 ? (last - first) / first : 0;
                return [industryCode, sortedByDate, percent];
            })
            .sort((a, b) => b[2] - a[2]);
    }, []);

    return (
        <View>
            <FlatList
                horizontal
                data={data}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => (
                    <IndustryCard industryData={item[1]} />
                )}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-2" />}
            />
        </View>
    );
};

export default industries;
