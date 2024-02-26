enum Methods {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
    HEAD = 'HEAD',
    PATCH = 'PATCH',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE'
}

interface HttpArgs {
    baseURL: string,
    headers?: { [key: string]: any },
    config?: object
}

interface RequestData {
    method?: Methods
    data?: { [key: string]: any } | FormData,
    headers?: { [key: string]: any }
    config?: object
}

type GroupHandler = (
    query: { [key: string]: any },
    group?: (slug: string, h: GroupHandler) => ({ [key: string]: any })
) => ({ [ key: string ]: any })



class Http {
    protected baseURL: string;
    protected headers: object;
    protected config: object;

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

    public request(slug: string = '', { method = Methods.GET, data = {}, headers = {}, config = {} }: RequestData) {
        const likeGET = [ Methods.GET, Methods.HEAD ],
            baseURL = Http.filterSlashes(`${this.baseURL}/${slug}`),
            url: string = likeGET.includes(method) ? `${baseURL}?${ data instanceof FormData ? '' : new URLSearchParams(data).toString()}` : baseURL,
            requestConfig: { [key: string]: any } = { method, headers: { ...this.headers, ...headers }, ...this.config, ...config };
            if(!likeGET.includes(method)) {
                const requestData = data instanceof FormData ? data : JSON.stringify(data);
                requestConfig.body = requestData;
            }
        return new Promise((resolve, reject) => {
            fetch(url, requestConfig).then(async (response) => {
                const result = await response.json(),
                    res = { ...response, status: response.status, headers: response.headers, body: result };
                if(!response.ok) return reject(res);
                resolve(res);
            }).catch(e => reject(e));
        });
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

export default Http;