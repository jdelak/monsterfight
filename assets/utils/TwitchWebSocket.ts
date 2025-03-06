export class TwitchWebSocket {
    private static instance: WebSocket;

    public static getInstance(streamer: any): WebSocket {
        if (!TwitchWebSocket.instance) {
            TwitchWebSocket.instance = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            TwitchWebSocket.instance.onopen = function () {
                TwitchWebSocket.instance.send('PASS oauth:' + streamer.access_token);
                TwitchWebSocket.instance.send('NICK justinfan' + Math.floor(Math.random() * 10000));
                TwitchWebSocket.instance.send('JOIN #' + streamer.user.login);
            };
        }
        return TwitchWebSocket.instance;
    }
}