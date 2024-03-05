import { SessionHTTP } from "~/assets/js/http/api/session";
import type { ResponseData } from "~/assets/js/http";

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
        const cookieExpired = tokenValue ? new Date(`${tokenValue.expiredAt}Z`) : new Date();
        this.setCookie(tokenName, JSON.stringify(tokenValue), { httpOnly: true, expires: cookieExpired });
        return Promise.resolve(null);
    }

    public async getAccessToken(): Promise<Token | null> {
        if(!this.cookie[this.accessTokenCookieName]) {
            const resp = await this.refreshAccessToken();
            if (resp?.body) {
                return resp.body.access;
            } else return Promise.resolve(null);
        }
        return Promise.resolve(this.cookie[this.accessTokenCookieName] ? JSON.parse(this.cookie[this.accessTokenCookieName]) : null);
    }

    public setAccessToken(token: Token | null): Promise<null> {
        return this.setToken(this.accessTokenCookieName, token);
    }

    public getRefreshToken(): Promise<Token | null> {
        return Promise.resolve(this.cookie[this.refreshTokenCookieName] ? JSON.parse(this.cookie[this.refreshTokenCookieName]) : null);
    }

    public setRefreshToken(token: Token | null): Promise<null> {
        return this.setToken(this.refreshTokenCookieName, token);
    }

    public refreshAccessToken(): Promise<ResponseData | null> {
        return new Promise(async (resolve, reject) => {
            const refreshToken = await this.getRefreshToken();
            if(refreshToken) {
                try {
                    const resp = await this.session.update(refreshToken.token);
                    if(resp.body) {
                        await this.setAccessToken(resp.body.access);
                        await this.setRefreshToken(resp.body.refresh);
                        resolve(resp);
                    } else throw Error('Refresh failed');
                } catch (e) {
                    reject(e)
                }
            } else reject({ error: "Refresh token not found!" });
        });
    }

    public async login(username: string, password: string): Promise<ResponseData> {
        return this.session.create(username, password)
            .then(async (resp) => {
                if(resp.body) {
                    await this.setAccessToken(resp.body.access);
                    await this.setRefreshToken(resp.body.refresh);
                } else throw Error("Auth request failed!");
                return resp;
            })
    }
}