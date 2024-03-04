import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async (event) => {
    const body = await readBody(event)
    return body;
}));