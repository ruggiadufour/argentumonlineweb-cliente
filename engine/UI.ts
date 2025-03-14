import { Snapshot } from "valtio";
import { TUI } from "../types";

type Writeable<T> = { -readonly [P in keyof T]: T[P] };
type TStore = Writeable<TUI>;
// type TStore = Snapshot<TUI>;

class UI {
    state: TStore = null;
    refs: Record<string, null | HTMLElement> = {
        console: null
    };

    constructor(store: TStore) {
        this.state = store;
    }

    setStore(store: TStore) {
        this.state = store;
    }
    
    setProperty(property: string, value: any) {
        console.log(property, value);
        console.log(this.state);
        
        if(property in this.state) {
            this.state[property] = value;
        }
    }
    
    setProperties(properties: Partial<TStore>) {
        Object.keys(properties).forEach(key => {
            if(key in this.state) {
                this.state[key] = properties[key];
            }
        });
    }

    setRef(ref: string, value: any) {
        this.refs[ref] = value;
    }
}

export default UI;