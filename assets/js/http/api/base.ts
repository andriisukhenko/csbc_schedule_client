import Http from "~/assets/js/http";
import type { HttpArgs } from "~/assets/js/http";

export class ApiHTTP extends Http {
    constructor(args: HttpArgs) {
        super({ ...args, config: { camelizeResponse: true, decamelizeRequest: true, ...args.config || {} }, baseURL: `http://localhost:8000/api/${args.baseURL}` });
    }

    check() {
        return this.get("");
    }
}

export const apiHTTP = new ApiHTTP({ baseURL: '' });