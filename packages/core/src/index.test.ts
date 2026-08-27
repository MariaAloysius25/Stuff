import { describe, expect, it } from "vitest";
import { MemoryStorage, ReadLaterController } from "./index";
import { textual } from "./common/textual";
import { FakeApi } from "./api/fakeapi";

describe("ReadLaterController", () => {
  it("updates immediately and restores the previous state when saving fails", async () => {
    const controller = new ReadLaterController(
      new FakeApi(new MemoryStorage(), 1),
    );
    const updates: boolean[] = [];
    controller.subscribe((state) => updates.push(state.saved.length > 0));
    const request = controller.toggle("signal");
    expect(controller.isSaved("signal")).toBe(true);
    await request;
    expect(controller.isSaved("signal")).toBe(false);
    expect(controller.getState().error).toBe(textual.networkError);
    expect(updates).toEqual([true, false]);
  });

  it("persists saved items across API instances", async () => {
    const storage = new MemoryStorage();
    const first = new FakeApi(storage, 0);
    const firstController = new ReadLaterController(first);
    await firstController.toggle("tide");
    const second = new ReadLaterController(new FakeApi(storage, 0));
    await second.hydrate();
    expect(second.isSaved("tide")).toBe(true);
  });

  it("does not overwrite persisted saves when a mutation beats hydration", async () => {
    const storage = new MemoryStorage();
    const existing = new FakeApi(storage, 0);
    await existing.save("common");
    const fresh = new FakeApi(storage, 0);
    await fresh.save("orbit");
    expect(
      (await fresh.getReadLater()).items.map((item) => item.articleId),
    ).toEqual(["common", "orbit"]);
  });

  it("makes repeated save and remove requests idempotent", async () => {
    const api = new FakeApi(new MemoryStorage(), 0);
    expect(await api.save("orbit")).toBe(201);
    expect(await api.save("orbit")).toBe(409);
    expect(await api.remove("orbit")).toBe(204);
    expect(await api.remove("orbit")).toBe(404);
  });

  it("returns thirty articles and persists a note with a saved article", async () => {
    const storage = new MemoryStorage();
    const api = new FakeApi(storage, 0);
    expect((await api.getArticles()).items).toHaveLength(30);
    await api.save("signal", "Read this on the train");
    expect((await api.getReadLater()).items[0].note).toBe(
      "Read this on the train",
    );
  });
});
