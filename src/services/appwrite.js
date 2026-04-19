import { Client, TablesDB } from "react-native-appwrite";

const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID;
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID;

const client = new Client().setEndpoint(ENDPOINT).setProject(PROJECT_ID);
const tablesDB = new TablesDB(client);

async function _listDataHSC(tableId) {
    return await tablesDB.listRows({
        databaseId: DATABASE_ID,
        tableId,
    });
}

async function _retrieveDataHSC(tableId, period) {
    return await tablesDB.getRow({
        databaseId: DATABASE_ID,
        tableId,
        rowId: period,
    });
}

export const listIndexScoreCard = async () => {
    return await _listDataHSC("indexscorecard");
};

export const retrieveIndexScoreCard = async (period) => {
    return await _retrieveDataHSC("indexscorecard", period);
};
