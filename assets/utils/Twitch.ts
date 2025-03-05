export async function getStreamerData() {
    const streamerInfo = await getTwitchStreamer();
    return streamerInfo;
}

// getTwitchInfos
async function getTwitchStreamer() {
    const response = await fetch("/lobby");
    const datas = await response.json();
    return datas;
}

export async function getTwitchChat(streamer: any): Promise<[string, string]> {
    return new Promise((resolve, reject) => {
        const socket = new WebSocket('wss://irc-ws.chat.twitch.tv:443');

        socket.onopen = function () {
            socket.send('PASS oauth:' + streamer.access_token);
            socket.send('NICK justinfan' + Math.floor(Math.random() * 10000));
            socket.send('JOIN #' + streamer.user.login);
        };

        socket.onmessage = function (event) {
            const message = event.data;
            if (message.includes('PRIVMSG')) {
                const parts = message.split(' ');
                const user = parts[0].split('!')[0].substring(1);
                const text = parts.slice(3).join(' ').substring(1);

                if (text.trim() === '!play') {
                    const url = 'https://api.twitch.tv/helix/users';
                    const headers = new Headers({
                        'Authorization': 'Bearer ' + streamer.access_token,
                        'Client-Id': streamer.client_id
                    });
                    const params = new URLSearchParams({
                        login: user
                    });

                    fetch(url + '?' + params.toString(), {
                        method: 'GET',
                        headers: headers
                    })
                        .then(response => response.json())
                        .then(data => {
                            const displayName = data.data[0].display_name;
                            const profileImage = data.data[0].profile_image_url;
                            const player = [displayName, profileImage];
                            resolve(player);
                        })
                        .catch(error => {
                            console.error('Erreur:', error);
                            reject(error);
                        });
                }
            }
        };
    });
}
