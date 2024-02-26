import Http from "~/assets/js/http";

export class ApiHTTP extends Http {
    constructor() {
        super({ baseURL: "http://localhost:8000/api" })
    }

    check() {
        return this.get();
    }
}

export const apiHTTP = new ApiHTTP()