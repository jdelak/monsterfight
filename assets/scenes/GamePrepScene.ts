import Phaser from 'phaser';
import { FinalPlayer, getPlayerByName } from '../utils/FinalPlayer';
import { initialChoices, statChoices } from '../utils/Choice';
import { TwitchWebSocket } from '../utils/TwitchWebSocket';
import { getViewerChoice, getStreamerData } from '../utils/Twitch';
import { Hero } from '../entities/Hero';

export default class GamePrepScene extends Phaser.Scene {

    private streamer: any;
    public players:any;
    public types:any;
    public currentPhase:number;
    private socket: any;
    public countdown: number;
    public countdownText:any;
    public choices:any;
    public statsContainer: Phaser.GameObjects.Container[];

    constructor() {
        super({ key: 'GamePrepScene' });
        this.currentPhase = 0;
        this.countdown = 15;
        this.countdownText = '';
        this.choices = initialChoices[0];
        this.statsContainer = [];
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'images/pokemon_background.png');
        this.load.pack('pokemon_icons', 'datas/pokemon.json', 'pokemon_icons');
        this.load.pack('types', 'datas/type.json', 'types');
    }

    init(data:any){
        this.players = data.players;
        this.types = data.selectedTypes;
        this.currentPhase = data.phase;
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 32, 'Preparation Phase', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.countdownText = this.add.text(this.cameras.main.centerX, 80,`${this.countdown}`, { font: '48px Arial', color: '#000000' }).setOrigin(0.5);   

        
        const sortedPlayers = [...this.players].sort((a, b) => a.hp - b.hp);
        if(this.currentPhase > 0){
            this.players = sortedPlayers;
        } 

        this.players.forEach((player:FinalPlayer, index:number) => {

            //on tire aléaoirement 3 amélioration de stats
            if(this.currentPhase > 0){
                const playerIndex = sortedPlayers.indexOf(player);
                this.choices = statChoices[playerIndex];
            }
            const statEntries = Object.entries(this.choices); // transforme en tableau de [clé, valeur]
            const shuffledStats = statEntries.sort(() => Math.random() - 0.5);
            const selectedStats = shuffledStats.slice(0, 3);
            player.availableStats = selectedStats;
            
            //ui
            this.add.text(240, 160 + index * 92, `${player.playerName} :`, { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);
            let pokeIcon = this.add.image(128, 160 + index * 92,`${player.hero.name.toLowerCase()}_icon`).setOrigin(0.5);
            pokeIcon.scale = 0.25;

            //stat container
            let playerContainer = this.add.container(400, 160 + index * 92);
            let playerstats = [];
            
            const attributs = ['level', 'base_hp', 'base_atk', 'base_def', 'base_def', 'ultimateDamage'] as (keyof Hero)[];

            attributs.forEach((attribut, i) => {
                let texte = this.add.text(i * 200, 0, `${attribut}: ${player.hero[attribut]}`, { font: '18px Arial', color: '#ffffff' }).setOrigin(0.5);
                playerstats.push(texte);
                playerContainer.add(texte);
            });

            this.statsContainer.push(playerContainer);

            selectedStats.forEach(([statName, statValue], i) => {
                this.add.text(1600, 160 + index * 92 + i * 20, `${statName} : +${statValue}`, {
                    font: '18px Arial',
                    color: '#ffff00'
                }).setOrigin(0, 0.5);
            });

        });
    
        this.fetchStreamerData();
        this.startCountdown();
        
    }

    update(){
        if (this.streamer) {
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.applySelectedStatToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        }

        //on affiche les stats mis à jour
        this.statsContainer.forEach(( container, playerIndex) => {
            const player = this.players[playerIndex];
            const attributs = ['level', 'base_hp', 'base_atk', 'base_def', 'base_def', 'ultimateDamage'] as (keyof Hero)[];
            container.list.forEach((textAttribute, indexText) => {
                if (textAttribute instanceof Phaser.GameObjects.Text) {
                    const attribut = attributs[indexText];
                    textAttribute.setText(`${attribut}: ${player.hero[attribut]}`);
                }
            });
        });

    }

    startCountdown() {
        const countdownInterval = setInterval(() => {
            this.countdown--;
            this.countdownText.setText(`${this.countdown}`);
            if (this.countdown < 0) {
                clearInterval(countdownInterval);
                this.countdownText.destroy();
                this.addFirstStatToPlayers(this.players)
                
                this.currentPhase++;
                this.scene.start('GameScene', {players:this.players, phase:this.currentPhase});
            }
        }, 1000);
    }

    addFirstStatToPlayers(players:FinalPlayer[]){

        players.forEach(player => {
            if (player.selectedChoice == ''){
                const selected= player.availableStats[0];
                this.addStat(selected, player);
            }
        })

    }

    applySelectedStatToPlayer(player:[string,string]){
        const playerObject = getPlayerByName(this.players, player[0]);
        if(playerObject != undefined) {
            const selected = playerObject.availableStats[parseInt(player[1].substring(1)) - 1];
            playerObject.selectedChoice = selected;
            this.addStat(selected, playerObject);
        }
    }

    addStat(selected:any, player:FinalPlayer){
        const [statName, statValue] = selected;
        switch (statName) {
            case 'base_hp':
                player.hero.base_hp += statValue;
                break;
            case 'base_atk':
               player.hero.base_atk += statValue;
                break;
            case 'base_def':
               player.hero.base_def += statValue;
                break;
            case 'base_attackSpeed':
               player.hero.base_attackSpeed += statValue;
                break;
            case 'ultimate_damage':
               player.hero.ultimateDamage += statValue;
                break;
        }
    
        // console.log(`${player.playerName} a choisi d'augmenter ${statName} de ${statValue}`);
        // console.log('Stats après choix : ', player.hero);
    }

    async fetchStreamerData() {
        try {
            this.streamer = await getStreamerData();
            this.socket = TwitchWebSocket.getInstance(this.streamer);
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.applySelectedStatToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données du streamer:", error);
        }
    }
}