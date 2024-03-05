import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async (event, auth) => {
    return auth.refreshAccessToken();
}));