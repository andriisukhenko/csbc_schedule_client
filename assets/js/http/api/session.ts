import { ApiHTTP } from "~/assets/js/http/api/base";
import type { ResponseData } from "~/assets/js/http";
import Auth from "~/assets/js/auth";

export class SessionHTTP extends ApiHTTP {
    constructor(auth: Auth | null = null) {
        super({ baseURL: "session" }, auth);
    }

    create(loign: string, password: string): Promise<ResponseData> {
        const data = new URLSearchParams({ username: loign, password: password })
        return this.post("", { data, headers: { "Content-Type": "application/x-www-form-urlencoded" } });
    }

    read(): Promise<ResponseData> {
        return this.get('');
    }
}