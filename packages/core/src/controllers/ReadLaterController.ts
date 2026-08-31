import { ReadLaterState, ReadLaterListener } from "../types";
import { FakeApi } from "../api/fakeapi";

export class ReadLaterController {
  private state: ReadLaterState = { saved: [], pending: [], error: null };
  private listeners = new Set<ReadLaterListener>();
  private mutationRevision = 0;
  constructor(
    private readonly api: Pick<FakeApi, "getReadLater" | "save" | "remove">,
  ) {}
  getState() {
    return this.state;
  }
  subscribe(listener: ReadLaterListener) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  async hydrate() {
    const revision = this.mutationRevision;
    try {
      const snapshot = (await this.api.getReadLater()).items;
      if (revision !== this.mutationRevision) return;
      const pendingIds = new Set(this.state.pending);
      this.state = {
        ...this.state,
        saved: [
          ...snapshot.filter((item) => !pendingIds.has(item.articleId)),
          ...this.state.saved.filter((item) => pendingIds.has(item.articleId)),
        ],
        error: null,
      };
    } catch (error) {
      this.state = {
        ...this.state,
        error:
          error instanceof Error ? error.message : "Could not load Read Later",
      };
    }
    this.emit();
  }
  isSaved(articleId: string) {
    return this.state.saved.some((item) => item.articleId === articleId);
  }
  async toggle(articleId: string, note = "") {
    if (this.state.pending.includes(articleId)) return false;
    this.mutationRevision += 1;
    const wasSaved = this.isSaved(articleId);
    const previous = this.state.saved;
    const previousItem = previous.find((item) => item.articleId === articleId);
    const saved = wasSaved
      ? previous.filter((item) => item.articleId !== articleId)
      : [
          ...previous,
          {
            articleId,
            savedAt: new Date().toISOString(),
            note: note.trim() || undefined,
          },
        ];
    this.state = {
      saved,
      pending: [...this.state.pending, articleId],
      error: null,
    };
    this.emit();
    try {
      const result = wasSaved
        ? await this.api.remove(articleId)
        : await this.api.save(articleId, note);
      if (result === 404 || result === 409) await this.api.getReadLater();
      this.state = {
        ...this.state,
        pending: this.state.pending.filter((id) => id !== articleId),
      };
      this.emit();
      return true;
    } catch (error) {
      const saved = wasSaved
        ? this.state.saved.some((item) => item.articleId === articleId)
          ? this.state.saved
          : previousItem
            ? [...this.state.saved, previousItem]
            : this.state.saved
        : this.state.saved.filter((item) => item.articleId !== articleId);
      this.state = {
        saved,
        pending: this.state.pending.filter((id) => id !== articleId),
        error:
          error instanceof Error
            ? error.message
            : "Could not update Read Later",
      };
      this.emit();
      return false;
    }
  }
  clearError() {
    this.state = { ...this.state, error: null };
    this.emit();
  }
  private emit() {
    this.listeners.forEach((listener) => listener(this.state));
  }
}
