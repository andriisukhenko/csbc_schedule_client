import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async (event, auth) => {
    const body = await readBody(event);
    return await auth.login(body.username, body.password);
}));