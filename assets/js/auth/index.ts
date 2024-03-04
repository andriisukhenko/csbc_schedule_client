import { SessionHTTP } from "~/assets/js/http/api/session";

export interface Token {
    token: string,
    expiredAt: string
}
interface setCookie {
    (name: string, value: string, options?: { [key: string]: any }): void
}

interface Cookie {
    [ key: string ]: string
}

export default class Auth {
    private setCookie: setCookie;
    private cookie: Cookie;
    private session: SessionHTTP;
    private accessTokenCookieName = "access_token";
    private refreshTokenCookieName = "refresh_token";

    constructor(setCookie: setCookie, cookie: Cookie, session: SessionHTTP) {
        this.setCookie = setCookie;
        this.cookie = cookie;
        this.session = session;
    }

    private setToken(tokenName: string, tokenValue: Token | null): Promise<null> {
        const cookieExpired = tokenValue ? new Date(`${tokenValue.expiredAt} UTC`) : new Date();
        this.setCookie(tokenName, JSON.stringify(tokenValue), { httpOnly: true, expires: cookieExpired });
        return Promise.resolve(null);
    }

    public getAccessToken(): Promise<Token | null> {
        return Promise.resolve(this.cookie[this.accessTokenCookieName] ? JSON.parse(this.cookie[this.accessTokenCookieName]) : null);
    }

    public setAccessToken(token: Token | null): Promise<null> {
        return this.setToken(this.accessTokenCookieName, token);
    }

    public getRefreshToken(): Promise<Token | null> {
        return Promise.resolve(this.cookie[this.refreshTokenCookieName] ? JSON.parse(this.cookie[this.refreshTokenCookieName]) : null);
    }

    public setRefreshToken(token: Token | null): Promise<null> {
        console.log("set refresh", token);
        return this.setToken(this.refreshTokenCookieName, token);
    }

    public async login(username: string, password: string): Promise<void> {
        return this.session.create(username, password)
            .then(async ({ body }) => {
                if(body) {
                    console.log(body);
                    await this.setAccessToken(body.access);
                    await this.setRefreshToken(body.refresh);
                } else throw Error("Auth request failed!");
            })
    }
}