import { apiHTTP } from "~/assets/js/http/api/base";
import { defaultResponseHandler } from "~/server/utils/responseHandler";

export default defineEventHandler(defaultResponseHandler(async () => {
    return await apiHTTP.check()
}));