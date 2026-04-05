import IndustryCard from "@/components/industries/IndustryCard";
import { INDUSTRIES_HISTORICAL } from "@/constants/data";
import { useCallback, useMemo } from "react";
import { Appearance, FlatList, View } from "react-native";

const industries = () => {
    const theme = Appearance.getColorScheme();

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

    const onPressCard = useCallback(() => {}, []);

    const groupingData = (data, numRows) => {
        const chunked = [];
        for (let i = 0; i < data.length; i += numRows) {
            chunked.push(data.slice(i, i + numRows));
        }
        return chunked;
    };

    return (
        <View>
            {/* <FlatList
                initialNumToRender={2}
                horizontal
                data={data}
                keyExtractor={(item) => item[0]}
                renderItem={({ item }) => (
                    <IndustryCard
                        theme={theme}
                        onPress={onPressCard}
                        industryData={item[1]}
                    />
                )}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-2" />}
            /> */}
            <FlatList
                horizontal
                data={groupingData(data, 2)}
                keyExtractor={(_, idx) => idx}
                renderItem={({ item }) => (
                    <View className="gap-2">
                        {item.map((subItem, index) => (
                            <IndustryCard
                                key={index}
                                theme={theme}
                                onPress={onPressCard}
                                industryData={subItem[1]}
                            />
                        ))}
                    </View>
                )}
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-2" />}
            />
        </View>
    );
};

export default industries;
