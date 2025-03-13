import Phaser from 'phaser';
import { TwitchWebSocket } from '../utils/TwitchWebSocket';
import { getTwitchChat, getStreamerData } from '../utils/Twitch';

export default class LobbyScene extends Phaser.Scene {

    public players: string[];
    private totalPlayers: number;
    private streamer: any;
    private socket: any;

    constructor() {
        super({ key: 'LobbyScene' });
        this.players = [];
        this.totalPlayers = 0;
        //For tests
        // this.totalPlayers = 8;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background1', 'images/pokemon_background.png');
        this.load.image('button', 'images/round-rectangle-white.png');
    }

    init(data: any) {
        this.players = [];
    }

    create() {
        this.add.image(0, 0, 'background1').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 100, 'Lobby', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);

        const startBtn = this.add.image(0, 0, 'button').setOrigin(0.5);
        const startText = this.add.text(0, 0, 'Start Game', { font: '24px Arial', color: '#000000' }).setOrigin(0.5);
        const startContainer = this.add.container(this.cameras.main.width - 300, 800, [startBtn, startText]);
        startContainer.setSize(400, 82)
            .setInteractive()
            .on('pointerdown', () => {
                if (this.totalPlayers === 8) {
                    this.scene.start('HeroSelectionScene', {players : this.players});
                }
            })
            .on('pointermove', () => {
                startBtn.setTint(0x000000);
                startText.setColor('#ffffff');
            })
            .on('pointerout', () => {
                startText.setColor('#000000');
                startBtn.clearTint();
            });

        const backBtn = this.add.image(0, 0, 'button').setOrigin(0.5);
        backBtn.displayWidth = 150;
        const backBtnText = this.add.text(0, 0, 'Back', { font: '24px Arial', color: '#000000' })
            .setOrigin(0.5);
        const backBtnContainer = this.add.container(200, 800, [backBtn, backBtnText]);
        backBtnContainer.setSize(150, 82).setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene'))
            .on('pointermove', () => {
                backBtn.setTint(0x000000);
                backBtnText.setColor('#ffffff');
            })
            .on('pointerout', () => {
                backBtnText.setColor('#000000');
                backBtn.clearTint();
            });

        this.fetchStreamerData();
    }

    update() {
        if (this.streamer) {
            getTwitchChat(this.streamer).then(player => {
                this.addPlayerToPlayerList(player);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        }
    }

    addPlayerToPlayerList(player: [string, string]) {
        if (this.totalPlayers < 8) {
            if (!this.players.includes(player[0])) {
                this.players.push(player[0]);
                this.add.text(this.cameras.main.centerX, 200 + (80 * this.totalPlayers), player[0], { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
                this.totalPlayers++;
            }
        }
    }

    async fetchStreamerData() {
        try {
            this.streamer = await getStreamerData();
            this.socket = TwitchWebSocket.getInstance(this.streamer);
            getTwitchChat(this.streamer).then(player => {
                this.addPlayerToPlayerList(player);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données du streamer:", error);
        }
    }
}