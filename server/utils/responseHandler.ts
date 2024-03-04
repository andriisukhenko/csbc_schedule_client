import { EventHandler, EventHandlerRequest, setResponseStatus, H3Event, EventHandlerResponse } from 'h3';
import { useCookie } from 'nuxt/app';
import Auth from '~/assets/js/auth';
import session from '~/assets/js/http/api/session';

interface EventAuthHandler<Request extends EventHandlerRequest = EventHandlerRequest, Response extends EventHandlerResponse = EventHandlerResponse> extends EventHandler {
    (event: H3Event<Request>, auth: Auth): Response 
}

export const defaultResponseHandler = <T extends EventHandlerRequest, D> (handler: EventAuthHandler<T, D>): EventHandler<T, D> => defineEventHandler<T>(async (event) => {
    try {
        const test = useCookie("test")
        test.value = "andrii";
        const response: any = await handler(event),
            status = response?.status || 200;
        setResponseStatus(event, status);
        console.log(test);
        return response.body;
    } catch (err: any) {
        const status = err?.status || 500;
        setResponseStatus(event, status);
        return err;
    }
})