import { defaultResponseHandler } from "~/server/utils/responseHandler";
import { SessionHTTP } from "~/assets/js/http/api/session";

export default defineEventHandler(defaultResponseHandler(async (event, auth) => {
    const sessionHTTP = new SessionHTTP(auth);
    return sessionHTTP.read();
}));