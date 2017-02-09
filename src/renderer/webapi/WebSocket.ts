/**
 * This represents the WebSocket API we are implementing in WebSocketMock and using in WebAPIClientImpl.
 *
 * @author Norman Fomferra
 */
export interface WebSocketMin {
    onclose: (this: this, ev: CloseEvent) => any;
    onerror: (this: this, ev: ErrorEvent) => any;
    onmessage: (this: this, ev: MessageEvent) => any;
    onopen: (this: this, ev: Event) => any;

    send(data: any): void;
    close(code?: number, reason?: string): void;
}
