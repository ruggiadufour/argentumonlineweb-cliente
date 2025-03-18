import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth',()=>{
    const account = useState<Record<string, string> | null>('account', () => null)
    const initsLoaded = useState('initsLoaded', () => false)
    const idCharacter = useState<string>('idCharacter', () => '')
    const typeGame = useState<"PvE" | "PvP">('typeGame', () => 'PvE')

    const setAccount = (account: any) => {
        account = account
    }

    const setInitsLoaded = (initsLoaded: boolean) => {
        initsLoaded = initsLoaded
    }

    const setCharacter = (character: any, index: number) => {
        idCharacter.value = character._id

        window.localStorage.setItem("idAccount", account.value?.accountId || "");
        window.localStorage.setItem("email", account.value?.email || "");

        if (typeGame.value === "PvE") {
            window.localStorage.setItem("idCharacter", character._id);
        } else {
            window.localStorage.setItem("idCharacter", index.toString());
        }

        window.localStorage.setItem("typeGame", typeGame.value === "PvE" ? "1" : "2");
    }

    return {
        account,
        initsLoaded,
        typeGame,
        idCharacter,
        setAccount,
        setInitsLoaded,
        setCharacter
    }
})