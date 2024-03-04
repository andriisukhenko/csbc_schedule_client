import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async (event, auth) => {
    const body = await readBody(event);
    await auth.login(body.username, body.password);
    return body;
}));