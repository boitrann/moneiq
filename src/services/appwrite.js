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

export const retrieveForeignHistorical = async (period) => {
    try {
        return await _retrieveDataHSC(
            "ForeignHistorical".toLowerCase(),
            period,
        );
    } catch (error) {
        throw new Error(`retrieveForeignHistorical failed: ${error.message}`);
    }
};

export const retrieveTopForeignTrade = async (period) => {
    try {
        return await _retrieveDataHSC(
            "TopForeignTrade".toLocaleUpperCase(),
            period,
        );
    } catch (error) {
        throw new Error(`retrieveTopForeignTrade failed: ${error.message}`);
    }
};

export const retrieveProprietaryHistorical = async (period) => {
    try {
        return await _retrieveDataHSC(
            "ProprietaryHistorical".toLowerCase(),
            period,
        );
    } catch (error) {
        throw new Error(
            `retrieveProprietaryHistorical failed: ${error.message}`,
        );
    }
};

export const retrieveTopProprietaryTrade = async (period) => {
    try {
        return await _retrieveDataHSC(
            "TopProprietaryTrade".toLocaleUpperCase(),
            period,
        );
    } catch (error) {
        throw new Error(`retrieveTopProprietaryTrade failed: ${error.message}`);
    }
};
