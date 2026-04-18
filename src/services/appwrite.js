import { Client, TablesDB } from "react-native-appwrite";

const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);

export const getIndexScoreCard = async () => {
    const result = await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId: "indexscorecard",
    });

    console.log(result);

    return result;
};
