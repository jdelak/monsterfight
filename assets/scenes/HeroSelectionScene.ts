import Phaser from 'phaser';
import { getRandomTypes } from '../utils/TypeChart';
import { Hero, heroes, getHeroesForPlayer } from '../utils/HeroList';
import { FinalPlayer } from '../utils/FinalPlayer';
import { TwitchWebSocket } from '../utils/TwitchWebSocket';
import { getViewerChoice, getStreamerData } from '../utils/Twitch';

export default class HeroSelectionScene extends Phaser.Scene {

    private streamer: any;
    public players: any[];
    public playerHeroes: { [key: string]: Hero[] } = {};
    public finalPlayers: FinalPlayer[];
    private socket: WebSocket;

    constructor() {
        super({ key: 'HeroSelectionScene' });
        this.players = [];
        //used in prep and battle scenes
        this.finalPlayers = [];
    }

    preload() {
        this.load.image('background', 'assets/images/pokemon_background.png');
    }

    init(data:any){
        this.players = data.players;
    }

    create() {
        this.add.image(0, 0, 'background1').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 100, 'Choose your hero! (type !1, !2 or !3)', { font: '48px Arial', color: '#ffffff' }).setOrigin(0.5);

        const selectedTypes = getRandomTypes(9);

        this.players.forEach((player, index) => {
            const heroesForPlayer = getHeroesForPlayer(selectedTypes);
            this.playerHeroes[player] = heroesForPlayer;

            this.add.text(200, 200 + index * 80, `${player}:`, { font: '32px Arial', color: '#ffffff' });

            heroesForPlayer.forEach((hero, heroIndex) => {
                this.add.text(350 + heroIndex * 300, 200 + index * 80, `${heroIndex + 1}. ${hero.name} (${hero.type})`, { font: '24px Arial', color: '#ffffff' });
            });
        });

        this.fetchStreamerData();
    }

    update() {
        if (this.streamer) {
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.addHeroToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        }
    }

    addHeroToPlayer(player: [string, string]) {
        if (this.players.includes(player[0]) === true) {
            const chosenHero = this.playerHeroes[player[0]][parseInt(player[1].substring(1)) - 1];
            var playerWithHero: FinalPlayer;

            if(this.finalPlayers.find(p => p.playerName === player[0]) === undefined){
                playerWithHero = {playerName:player[0],hp:30,hero:chosenHero}
                this.finalPlayers.push(playerWithHero);
            }

        }
    }

    async fetchStreamerData() {
        try {
            this.streamer = await getStreamerData();
            this.socket = TwitchWebSocket.getInstance(this.streamer);
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.addHeroToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données du streamer:", error);
        }
    }
}