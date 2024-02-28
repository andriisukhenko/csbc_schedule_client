import Http from "~/assets/js/http";
import type { HttpArgs, RequestData } from "~/assets/js/http";
import { decamelizeObject, camelizeObject } from "~/assets/js/helpers";

export class ApiHTTP extends Http {
    constructor(args: HttpArgs) {
        super({ ...args, config: { camelizeResponse: true, decamelizeRequest: true, ...args.config || {} }, baseURL: `http://localhost:8000/api/${args.baseURL}` });
    }

    check() {
        return this.get("");
    }

    protected preHandleRequest(request: RequestData): RequestData {
        if (request.data && !(request.data instanceof FormData)) request.data = decamelizeObject(request.data);
        return request
    }
    
    protected preHandlerResponse(response: ResponseData): ResponseData {
        
    }
}

export const apiHTTP = new ApiHTTP({ baseURL: '' });