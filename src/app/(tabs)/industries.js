import IndustryCard from "@/components/industries/IndustryCard";
import { INDUSTRIES_HISTORICAL } from "@/constants/data";
import { View } from "react-native";

const industries = () => {
    return (
        <View>
            <IndustryCard
                industryCode="301010"
                industryData={INDUSTRIES_HISTORICAL[301010]}
            />
        </View>
    );
};

export default industries;
