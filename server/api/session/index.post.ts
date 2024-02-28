import auth from "~/assets/js/auth";
import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async (event) => {
    const body = await readBody(event)
    return await auth.login(body.username, body.password);
}));