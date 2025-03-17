import type { TUI } from "@/types";
import { useUIStore } from "@/store/ui.store";

class UI {
  store: ReturnType<typeof useUIStore>;

  constructor() {
    this.store = useUIStore();
  }

  get state() {
    return this.store.ui;
  }

  setProperty(property: keyof TUI, value: typeof this.state[keyof TUI]) {
    const store = this.store;
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
    const store = this.store;
    if (typeof value === 'object' && value !== null) {
      store.ui.user[property] = { ...store.ui.user[property], ...value };
    } else {
      store.ui.user[property] = value;
    }
  }

  setProperties(properties: Partial<TUI>) {
    const store = this.store;
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
}

export default UI;
