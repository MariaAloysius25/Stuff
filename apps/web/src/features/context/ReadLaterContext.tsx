import { createContext, ReactNode, useContext, useMemo } from "react";
import { createWebApi, ReadLaterController } from "@read-later/core";

interface ReadLaterContextValue {
    api: ReturnType<typeof createWebApi>;
    controller: ReadLaterController;
}

const ReadLaterContext = createContext<ReadLaterContextValue | null>(null);

const defaultReadLaterContextValue = (() => {
    const api = createWebApi();
    return {
        api,
        controller: new ReadLaterController(api),
    } satisfies ReadLaterContextValue;
})();

export function createReadLaterContextValue(): ReadLaterContextValue {
    const api = createWebApi();
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
