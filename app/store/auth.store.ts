import { defineStore } from "pinia"

export const useAuthStore = defineStore('auth',()=>{
    const account = useState<any>('account', () => null)
    const initsLoaded = useState('initsLoaded', () => false)

    const setAccount = (account: any) => {
        account = account
    }

    const setInitsLoaded = (initsLoaded: boolean) => {
        initsLoaded = initsLoaded
    }

    return {
        account,
        initsLoaded,
        setAccount,
        setInitsLoaded
    }
})