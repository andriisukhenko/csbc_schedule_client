import { EventHandler, EventHandlerRequest, setResponseStatus } from 'h3'

export const defaultResponseHandler = <T extends EventHandlerRequest, D> (handler: EventHandler<T, D>): EventHandler<T, D> => defineEventHandler<T>(async event => {
    try {
        const response: any = await handler(event),
            status = response?.status || 200;
        setResponseStatus(event, status);
        return response.body;
    } catch (err: any) {
        const status = err?.status || 500;
        setResponseStatus(event, status);
        return err;
    }
})