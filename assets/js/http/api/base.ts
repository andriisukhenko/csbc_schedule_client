import Http from "~/assets/js/http";
import type { HttpArgs, RequestData, ResponseData } from "~/assets/js/http";
import { decamelizeObject, camelizeObject } from "~/assets/js/helpers";
import Auth from "~/assets/js/auth";

export class ApiHTTP extends Http {
    private auth: Auth | null;

    constructor(args: HttpArgs, auth: Auth | null = null) {
        super({ ...args, baseURL: `http://localhost:8000/api/${args.baseURL}` });
        this.auth = auth;
    }

    check() {
        return this.get("");
    }

    protected async preHandleRequest(request: RequestData): Promise<RequestData> {
        if (request.data && !(request.data instanceof FormData)) request.data = decamelizeObject(request.data);
        if (this.auth) {
            const accesToken = await this.auth.getAccessToken();
            if (accesToken) request.headers = { ...request.headers || {}, 'Authorization': `Bearer ${accesToken.token}` };
        }
        return Promise.resolve(request);
    }
    
    protected preHandleResponse(response: ResponseData): Promise<ResponseData> {
        if(response.body) response.body = camelizeObject(response.body);
        return Promise.resolve(response);
    }
}

export const apiHTTP = new ApiHTTP({ baseURL: '' });