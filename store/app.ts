import { defineStore } from "pinia";
import { useAppConfig } from "nuxt/app";
import moment from "moment-timezone";

interface ApiInfo{
    version: string | null,
    status: string | null,
    env: string | null,
    name: string | null,
    datetime: string | null
}

interface StateData {
    apiInfo: ApiInfo
}

export default defineStore('app', {
    state: (): StateData => ({ 
        apiInfo: { 
            version: null,
            status: null,
            env: null,
            name: null,
            datetime: null
        }
    }),
    actions: {
        loadApiInfo() {
            const appConfig = useAppConfig();
            return new Promise(async (resolve, reject) => {
                const { data, error } = await useFetch<ApiInfo>("/api/status")
                if(data.value) {
                    this.apiInfo = { ...data.value }
                    this.apiInfo.datetime = moment.utc(data.value.datetime, appConfig.datetimeFormat).tz(moment.tz.guess()).format("LLLL")
                    return resolve(this.apiInfo)
                }

                if(error.value) return reject(error.value)
            });
        }
    }
});