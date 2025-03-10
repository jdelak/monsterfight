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
        this.load.pack('pokemon_icons', 'assets/datas/pokemon.json', 'pokemon_icons');
        this.load.pack('types', 'assets/datas/type.json', 'types');
    }

    init(data:any){
        this.players = data.players;
        // For testing
        // this.players = ['Jay_Delac', 'Nightbot', 'Player3', 'Player4', 'Players5', 'Players6', 'Players7', 'Players8'];
    }

    create() {
        this.add.image(0, 0, 'background1').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 64, 'Choose your pokémon! (type !1, !2 or !3 in streamer chat)', { font: '40px Arial', color: '#ffffff' }).setOrigin(0.5);

        const selectedTypes = getRandomTypes(9);

        this.players.forEach((player, index) => {
            const heroesForPlayer = getHeroesForPlayer(selectedTypes);
            this.playerHeroes[player] = heroesForPlayer;

            this.add.text(200, 200 + index * 92, `${player} :`, { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);;

            heroesForPlayer.forEach((hero, heroIndex) => {
                // this.add.text(350 + heroIndex * 300, 200 + index * 80, `${heroIndex + 1}. ${hero.name} (${hero.type})`, { font: '24px Arial', color: '#ffffff' });
                let typeIcon = this.add.image((450 + heroIndex * 256) - 80, 200 + index * 92,`${hero.type}`).setOrigin(0.5);
                let pokeIcon = this.add.image(450 + heroIndex * 256, 200 + index * 92,`${hero.name}_icon`).setOrigin(0.5);
                typeIcon.scale = 0.5;
                pokeIcon.scale = 0.25;
                
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

        //show selected hero
        this.finalPlayers.forEach((player, index) => {
            if(player.hero){
                const selected = this.add.image(1600, 200 + index * 92,`${player.hero.name}_icon`).setOrigin(0.5);
                selected.scale = 0.25;
            }
        });
        
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