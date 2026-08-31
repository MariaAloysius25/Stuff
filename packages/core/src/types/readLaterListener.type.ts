import type { ReadLaterState } from "./readLaterState.type";

export interface ReadLaterListener {
  (state: ReadLaterState): void;
}
