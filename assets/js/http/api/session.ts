import { ApiHTTP } from "~/assets/js/http/api/base";

class AuthHTTP extends ApiHTTP {
    constructor() {
        super({ baseURL: "session" });
    }

    create(data: {}) {
        return this.post("", data);
    }
}