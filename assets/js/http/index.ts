export enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE'
}

export interface HttpArgs {
    baseURL: string,
    headers?: { [key: string]: any },
    config?: { [key: string]: any }
}

export interface RequestData {
    method?: Methods,
    data?: { [key: string]: any } | FormData,
    headers?: { [key: string]: any },
    config?: { [key: string]: any }
}

export interface RequestConfig {
    method: Methods,
    headers: RequestData["headers"],
    [key: string]: any
}

export interface ResponseData {
    status: number,
    body?: { [key: string]: any },
    headers?: { [key: string]: any }
}

export type GroupHandler = (
    query: { [key: string]: any },
    group?: (slug: string, h: GroupHandler) => ({ [key: string]: any })
) => ({ [ key: string ]: any })



export default class Http {
    protected baseURL: HttpArgs["baseURL"];
    protected headers: HttpArgs["headers"];
    protected config: HttpArgs["config"];

    constructor({ baseURL, headers = {}, config = {} }: HttpArgs) {
        this.baseURL = !baseURL.startsWith("http://") && !baseURL.startsWith("https://") ? `https://${baseURL}` : baseURL;
        this.headers = { 'Content-type': 'application/json', ...headers };
        this.config = config;
    }

    static filterSlashes(url: string) {
        const [ protocol, domain ] = url.split("://"),
            domainParts = domain.split('/'),
            lastElm = domain.slice(-1)[0] === '/' ? "/" : "",
            domainFiltredParts = domainParts.filter(part => part);
        return `${protocol}://${domainFiltredParts.join('/')}${lastElm}`  
    }

    public request(slug: string = '', { method = Methods.GET, data = {}, headers = {}, config = {} }: RequestData): Promise<ResponseData> {
        const likeGET = [ Methods.GET, Methods.HEAD ],
            baseURL = Http.filterSlashes(`${this.baseURL}/${slug}`),
            { method: handledMethod, data: handledData, headers: handledHeaders, config: handledConfig } = this.preHandleRequest({ method, data, headers, config }),
            url: string = likeGET.includes(handledMethod || Methods.GET) ? `${baseURL}?${ handledData instanceof FormData ? '' : new URLSearchParams(handledData).toString()}` : baseURL,
            requestConfig: RequestConfig = { method: handledMethod || Methods.GET, headers: { ...this.headers, ...handledHeaders }, ...this.config, ...handledConfig };
            if(!likeGET.includes(method)) {
                const requestData = data instanceof FormData ? data : JSON.stringify(data);
                requestConfig.body = requestData;
            }
            const self: Http = this;
        return new Promise((resolve, reject) => {
            fetch(url, requestConfig).then(async (response) => {
                const result = await response.json(),
                    res = self.preHandlerResponse({ ...response, status: response.status, headers: response.headers, body: result });
                if(!response.ok) return reject(res);
                resolve(res);
            }).catch(e => reject(e));
        });
    }

    protected preHandleRequest(request: RequestData): RequestData {
        return request;
    }

    protected preHandlerResponse(response: ResponseData): ResponseData {
        return response;
    }

    public get(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.GET }); }

    public post(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.POST }); }

    public put(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.PUT }); }

    public delete(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.DELETE }); }

    public group(groupPath: string, handler: GroupHandler): { [key: string]: any } {
        const __this = this,
            getPath = (path: string) => path ? `${groupPath}/${path}` : groupPath,
            group = (path: string, handler: GroupHandler) => __this.group(`${groupPath}/${path}`, handler),
            query = {
                request: (slug: string = '', config: RequestData = {}) => __this.request(slug, config),
                get: (slug: string = '', config: RequestData = {}) => __this.get(getPath(slug), config),
                post: (slug: string = '', config: RequestData = {}) => __this.post(getPath(slug), config),
                put: (slug: string = '', config: RequestData = {}) => __this.put(getPath(slug), config),
                delete: (slug: string = '', config: RequestData = {}) => __this.delete(getPath(slug), config),
            };
        return handler(query, group);
    }
}