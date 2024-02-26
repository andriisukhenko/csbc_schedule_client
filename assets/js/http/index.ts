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
        this.headers = headers;
        this.config = config;
    }

    public request(slug: string = '', { method = Methods.GET, data = {}, headers = {}, config = {} }: RequestData) {
        const likeGET = [ Methods.GET, Methods.HEAD ],
            baseURL = `${this.baseURL}/${slug}`,
            url: string = likeGET.includes(method) ? `${baseURL}?${ data instanceof FormData ? {} : new URLSearchParams(data).toString()}` : baseURL,
            requestConfig: { [key: string]: any } = { method, headers: { ...this.headers, ...headers }, ...this.config, ...config };
            if(!likeGET.includes(method)) {
                const requestData = data instanceof FormData ? data : JSON.stringify(data);
                requestConfig.data = requestData;
            }
        return new Promise((resolve, reject) => {
            fetch(url, requestConfig).then(response => {
                if(!response.ok) {
                    return reject({ status: response.status, message: response.statusText });
                }
                return response.json();
            })
            .then(result => resolve(result))
            .catch(e => reject(e));
        });
    }

    public get(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.GET }); }

    public post(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.POST }); }

    public put(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.PUT }); }

    public delete(slug: string = '', config: RequestData = {}) { return this.request(slug, { ...config, method: Methods.DELETE }); }


    public group(groupPath: string, handler: GroupHandler): { [key: string]: any } {
    }
}

export default Http;