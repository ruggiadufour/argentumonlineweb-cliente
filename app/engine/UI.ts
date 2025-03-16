import type { TUI } from "@/types";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type TStore = Writeable<TUI>;
// type TStore = Snapshot<TUI>;

class UI {
  store: any;
  refs: Record<string, null | HTMLElement> = {
    console: null,
  };

  constructor(store: TStore) {
    this.store = store;
  }

  get state() {
    return this.store.ui;
  }

  setProperty(property: string, value: any) {
    if (property in this.state) {
      this.state[property] = value;
    }
  }

  setProperties(properties: Partial<TStore>) {
    Object.keys(properties).forEach((key) => {
      if (key in this.store.ui) {
        this.store.ui[key] = properties[key];
      }
    });
  }

  setRef(ref: string, value: any) {
    this.refs[ref] = value;
  }

  setStore(store: TStore) {
    this.store = store;
  }
}

export default UI;
