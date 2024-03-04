import { EventHandler, EventHandlerRequest, setResponseStatus, H3Event, EventHandlerResponse, setCookie, parseCookies } from 'h3';
import Auth from '~/assets/js/auth';
import { SessionHTTP } from '~/assets/js/http/api/session';

type EventAuthHandler<T extends EventHandlerRequest, D> = (event: H3Event<T>, auth: Auth) => EventHandlerResponse

export const defaultResponseHandler = <T extends EventHandlerRequest, D> (handler: EventAuthHandler<T, D>): EventHandler<T, D> => defineEventHandler<T>(async (event) => {
    try {
        const response: any = await handler(
            event,
            new Auth(
                (name, value, settings) => setCookie(event, name, value, settings),
                parseCookies(event),
                new SessionHTTP()
            )
        ),
            status = response?.status || 200;
        setResponseStatus(event, status);
        return response.body;
    } catch (err: any) {
        const status = err?.status || 500;
        setResponseStatus(event, status);
        return err;
    }
})