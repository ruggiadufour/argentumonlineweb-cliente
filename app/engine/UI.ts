import type { TUI } from "@/types";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type TStore = Writeable<TUI>;
// type TStore = Snapshot<TUI>;

class UI {
  getStore: any;
  refs: Record<string, null | HTMLElement> = {
    console: null,
  };

  constructor(store: TStore) {
    this.getStore = store;
  }

  get state() {
    const store = this.getStore();
    return store.ui;
  }

  setProperty(property: string, value: any) {
    const store = this.getStore();
    
    if (property in this.state) {
      if (property === 'user') {
        // For user updates, we need to ensure we maintain reactivity
        // by doing a proper deep merge of the properties
        const currentUser = store.ui.user;
        Object.keys(value).forEach(key => {
          if (typeof value[key] === 'object' && value[key] !== null) {
            // For nested objects, merge them
            currentUser[key] = { ...currentUser[key], ...value[key] };
          } else {
            // For primitive values, just assign
            currentUser[key] = value[key];
          }
        });
      } else {
        // For other properties, direct assignment is fine
        store.ui[property] = value;
      }
    }
  }

  setUserProperty(property: string, value: any) {
    const store = this.getStore();
    if (typeof value === 'object' && value !== null) {
      store.ui.user[property] = { ...store.ui.user[property], ...value };
    } else {
      store.ui.user[property] = value;
    }
  }

  setProperties(properties: Partial<TStore>) {
    const store = this.getStore();
    Object.keys(properties).forEach((key) => {
      if (key in store.ui) {
        if (key === 'user') {
          this.setProperty('user', properties[key]);
        } else {
          store.ui[key] = properties[key];
        }
      }
    });
  }

  setRef(ref: string, value: any) {
    this.refs[ref] = value;
  }

  // setStore(store: TStore) {
  //   this.store = store;
  // }
}

export default UI;
