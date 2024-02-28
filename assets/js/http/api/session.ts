import { ApiHTTP } from "~/assets/js/http/api/base";
import type { ResponseData } from "~/assets/js/http";

export class SessionHTTP extends ApiHTTP {
    constructor() {
        super({ baseURL: "session" });
    }

    create(loign: string, password: string): Promise<ResponseData> {
        const data = new URLSearchParams({ username: loign, password: password })
        return this.post("", { data, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    }
}

export default new SessionHTTP()