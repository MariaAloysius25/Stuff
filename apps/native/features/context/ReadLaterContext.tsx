import React, { createContext, ReactNode, useContext, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FakeApi, ReadLaterController, SavedArticle, StorageAdapter } from "@read-later/core";

interface ReadLaterContextValue {
    api: FakeApi;
    controller: ReadLaterController;
}

const createNativeStorage = (): StorageAdapter => ({
    async read() {
        try {
            const value = await AsyncStorage.getItem("read-later:saved");
            const parsed: unknown = value ? JSON.parse(value) : [];
            return Array.isArray(parsed) ? (parsed as SavedArticle[]) : [];
        } catch {
            return [];
        }
    },
    async write(items) {
        await AsyncStorage.setItem("read-later:saved", JSON.stringify(items));
    },
});

const ReadLaterContext = createContext<ReadLaterContextValue | null>(null);

const defaultReadLaterContextValue = (() => {
    const storage = createNativeStorage();
    const api = new FakeApi(storage);

    return {
        api,
        controller: new ReadLaterController(api),
    } satisfies ReadLaterContextValue;
})();

export function createReadLaterContextValue(): ReadLaterContextValue {
    const storage = createNativeStorage();
    const api = new FakeApi(storage);

    return {
        api,
        controller: new ReadLaterController(api),
    };
}

export function ReadLaterProvider({ children }: { children: ReactNode }) {
    const value = useMemo<ReadLaterContextValue>(() => createReadLaterContextValue(), []);

    return (
        <ReadLaterContext.Provider value={value}>{children}</ReadLaterContext.Provider>
    );
}

export function useReadLater() {
    const context = useContext(ReadLaterContext);

    return context ?? defaultReadLaterContextValue;
}
