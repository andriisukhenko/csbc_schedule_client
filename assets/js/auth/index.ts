import type { CookieRef } from "nuxt/app";
import sessionHTTP, { SessionHTTP } from "~/assets/js/http/api/session";

export interface Token {
    token: string,
    expiredAt: string
}

export default class Auth {
    private accessTokenCookie: CookieRef<Token | null>;
    private refreshTokenCookie: CookieRef<Token | null>;
    private session: SessionHTTP;

    constructor(accessToken: CookieRef<Token>, refreshToken: CookieRef<Token>, session: SessionHTTP) {
        this.accessTokenCookie = accessToken;
        this.refreshTokenCookie = refreshToken;
        this.session = session;
    }

    public getAccessToken(): Promise<Token | null> {
        return Promise.resolve(this.accessTokenCookie.value);
    }

    public setAccessToken(token: Token | null): Promise<null> {
        this.accessTokenCookie.value = token;
        return Promise.resolve(null);
    }

    public getRefreshToken(): Promise<Token | null> {
        return Promise.resolve(this.refreshTokenCookie.value);
    }

    public setRefreshToken(token: Token | null): Promise<null> {
        this.refreshTokenCookie.value = token;
        return Promise.resolve(null);
    }

    public login(username: string, password: string) {
        this.session.create(username, password)
            .then(async ({ body }) => {
                if(body) {
                    await this.setAccessToken(body.accessToken);
                    await this.setRefreshToken(body.refreshToken);
                } else throw Error("Auth request failed!");
            })
    }
}