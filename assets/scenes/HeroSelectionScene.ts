import Phaser from 'phaser';
import { getRandomTypes, setInitialStacks } from '../utils/TypeChart';
import { Hero, heroes, getHeroesForPlayer } from '../utils/HeroList';
import { TypeStack } from '../utils/TypeStack';
import { FinalPlayer } from '../utils/FinalPlayer';
import { TwitchWebSocket } from '../utils/TwitchWebSocket';
import { getViewerChoice, getStreamerData } from '../utils/Twitch';

export default class HeroSelectionScene extends Phaser.Scene {

    private streamer: any;
    public players: any[];
    public playerHeroes: { [key: string]: Hero[] } = {};
    public finalPlayers: FinalPlayer[];
    private socket: any;
    public countdown: number;
    public countdownText:any;
    public types:any;
    private initialStacks: TypeStack[];

    constructor() {
        super({ key: 'HeroSelectionScene' });
        this.players = ['','','','','','','',''];
        //used in prep and battle scenes
        this.finalPlayers = [];
        this.countdown = 30;
        this.countdownText = '';
        this.types = '';
        this.initialStacks = [];
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'images/pokemon_background.png');
        this.load.pack('pokemon_icons', 'datas/pokemon.json', 'pokemon_icons');
        this.load.pack('types', 'datas/type.json', 'types');
    }

    init(data:any){
        this.players = data.players;
        // For testing
        // this.players = ['Jay_Delac', 'Nightbot', 'Player3', 'Player4', 'Players5', 'Players6', 'Players7', 'Players8'];
    }

    create() {
        this.add.image(0, 0, 'background1').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 32, 'Type !1, !2 or !3 to select you Pokémon !', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.countdownText = this.add.text(this.cameras.main.centerX, 80,`${this.countdown}`, { font: '48px Arial', color: '#000000' }).setOrigin(0.5);   
        
        const selectedTypes = getRandomTypes(9);
        this.types = selectedTypes;
        this.initialStacks = setInitialStacks(selectedTypes);

        this.players.forEach((player, index) => {
            const heroesForPlayer = getHeroesForPlayer(selectedTypes);
            this.playerHeroes[player] = heroesForPlayer;

            this.add.text(200, 160 + index * 92, `${player} :`, { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);

            heroesForPlayer.forEach((hero, heroIndex) => {
                let typeIcon = this.add.image((450 + heroIndex * 256) - 80, 160 + index * 92,`${hero.type}`).setOrigin(0.5);
                let pokeIcon = this.add.image(450 + heroIndex * 256, 160 + index * 92,`${hero.name}_icon`).setOrigin(0.5);
                typeIcon.scale = 0.5;
                pokeIcon.scale = 0.25;
                
            });
        });

        this.fetchStreamerData();
        this.startCountdown();
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
                const selected = this.add.image(1440, 160 + index * 92,`${player.hero.name}_icon`).setOrigin(0.5);
                selected.scale = 0.25;
            }
        });
        
    }

    addHeroToPlayer(player: [string, string]) {
        if (this.players.includes(player[0]) === true) {
            const chosenHero = this.playerHeroes[player[0]][parseInt(player[1].substring(1)) - 1];
            let playerWithHero: FinalPlayer;

            if (this.finalPlayers.find(p => p.playerName === player[0]) === undefined) {
                playerWithHero = {
                    playerName: player[0],
                    hp: 30,
                    hero: chosenHero,
                    wins: 0,
                    types: [],
                    chosenType: { 'type': '', 'stack': 0 },
                    typeStacks: this.cloneTypeStacks(this.initialStacks)
                };
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

    startCountdown() {
        const countdownInterval = setInterval(() => {
            this.countdown--;
            this.countdownText.setText(`${this.countdown}`);
            if (this.countdown < 0) {
                clearInterval(countdownInterval);
                this.countdownText.destroy();
                this.addFirstHeroToPlayers(this.players,this.finalPlayers)
                this.scene.start('GamePrepScene', {players:this.finalPlayers, selectedTypes:this.types,phase:0});
            }
        }, 1000);
    }

    addFirstHeroToPlayers(players: any[], finalPlayers: FinalPlayer[]) {
        const missingPlayers = players.filter(player =>
            !finalPlayers.some(finalPlayer => finalPlayer.playerName === player)
        );

        missingPlayers.forEach(player => {
            const chosenHero = this.playerHeroes[player][0];
            let playerWithHero = {
                playerName: player,
                hp: 30,
                hero: chosenHero,
                wins: 0,
                types: [],
                chosenType: { 'type': '', 'stack': 0 },
                typeStacks: this.cloneTypeStacks(this.initialStacks)
            };
            this.finalPlayers.push(playerWithHero);
        });
    }

        // Méthode pour cloner typeStacks
        cloneTypeStacks(typeStacks: TypeStack[]): TypeStack[] {
            return typeStacks.map(stack => ({ ...stack }));
        }
}