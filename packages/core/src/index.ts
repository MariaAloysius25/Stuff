import { FakeApi } from "./api/fakeapi";
import { WebStorage } from "./storage/webStorage";

export { FakeApi } from "./api/fakeapi";
export const createWebApi = () => new FakeApi(new WebStorage());
export * from "./types";
export * from "./constants";
export { useArticleList } from "./hooks/useArticleList";
export { FallbackComponent } from "./components/Fallback";
export * from "./controllers/ReadLaterController";
export * from "./storage/memoryStorage";
export * from "./storage/webStorage";
