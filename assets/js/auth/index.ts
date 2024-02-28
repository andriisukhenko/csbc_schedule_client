import sessionHTTP, { SessionHTTP } from "~/assets/js/http/api/session";
import type { ResponseData } from "~/assets/js/http";

class Auth {
    private http: SessionHTTP;

    constructor(http: SessionHTTP) {
        this.http = http
    }

    public login(username: string, password: string): Promise<ResponseData> {
        return this.http.create(username, password);
    }
}

export default new Auth(sessionHTTP);
