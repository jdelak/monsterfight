import Phaser from 'phaser';
import { getRandomSelectedTypes } from '../utils/TypeChart';
import { FinalPlayer, getPlayerByName } from '../utils/FinalPlayer';
import { prepChoice, addStacks } from '../utils/TypeStack';
import { TwitchWebSocket } from '../utils/TwitchWebSocket';
import { getViewerChoice, getStreamerData } from '../utils/Twitch';

export default class GamePrepScene extends Phaser.Scene {

    private streamer: any;
    public players:any;
    public types:any;
    public currentPhase:number;
    private socket: any;
    public countdown: number;
    public countdownText:any;

    constructor() {
        super({ key: 'GamePrepScene' });
        this.currentPhase = 0;
        this.countdown = 15;
        this.countdownText = '';
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
        
        let stackNumber = 8;
        this.players.forEach((player:FinalPlayer, index:number) => {
            const typeChoice = getRandomSelectedTypes(3,this.types);
            const playerTypes:any = [];
            //descending sort types
            player.typeStacks.sort((a, b) => b.stack - a.stack);

            //ui
            this.add.text(240, 160 + index * 92, `${player.playerName} :`, { font: '24px Arial', color: '#ffffff' }).setOrigin(0.5);
            let pokeIcon = this.add.image(128, 160 + index * 92,`${player.hero.name}_icon`).setOrigin(0.5);
            pokeIcon.scale = 0.25;
            
            player.typeStacks.forEach((type, typeIndex) => {
                let typeIcon = this.add.image(336 + typeIndex * 92, 160 + index * 92,`${type.type}`).setOrigin(0.5);
                this.add.text(336 + typeIndex * 92, 160 + index * 92,`${type.stack}`, { font: '24px Arial', color: '#000000' }).setOrigin(0.5);
                typeIcon.scale = 0.5;
            });
            
            if(this.currentPhase > 0){
                stackNumber = prepChoice[index];
            } 
           
            typeChoice.forEach((type) => {
                playerTypes.push({"type":type, "stack":stackNumber });
            });

            player.types = playerTypes;
            player.types.forEach((playerType, playerTypeIndex) => {
                let typeIcon = this.add.image(1600 + playerTypeIndex * 92, 160 + index * 92,`${playerType.type}`).setOrigin(0.5);
                this.add.text(1600 + playerTypeIndex * 92, 160 + index * 92,`${playerType.stack}`, { font: '24px Arial', color: '#000000' }).setOrigin(0.5);
                typeIcon.scale = 0.5;
            });

        });
    
        this.fetchStreamerData();
        this.startCountdown();
        
    }

    update(){
        if (this.streamer) {
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.addStackToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        }

        this.players.forEach((player:FinalPlayer, index:number) => {
            //descending sort types
            player.typeStacks.sort((a, b) => b.stack - a.stack);
            //ui
            player.typeStacks.forEach((type, typeIndex) => {
                let typeIcon = this.add.image(336 + typeIndex * 92, 160 + index * 92,`${type.type}`).setOrigin(0.5);
                this.add.text(336 + typeIndex * 92, 160 + index * 92,`${type.stack}`, { font: '24px Arial', color: '#000000' }).setOrigin(0.5);
                typeIcon.scale = 0.5;
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
                this.addFirstTypeToPlayers(this.players)
                
                this.currentPhase++;
                this.scene.start('GameScene', {players:this.players, selectedTypes:this.types,phase:this.currentPhase});
            }
        }, 1000);
    }

    addFirstTypeToPlayers(players:FinalPlayer[]){

        players.forEach(player => {
            if ((player.chosenType.type == '') && (player.chosenType.stack == 0 )){
                player.chosenType = player.types[0];
                addStacks(player.chosenType.type,player.typeStacks,player.chosenType.stack);
            }
        })

    }

    addStackToPlayer(player: [string, string]){
        const playerObject = getPlayerByName(this.players, player[0]);
        if(playerObject != undefined) {
            playerObject.chosenType = playerObject.types[parseInt(player[1].substring(1)) - 1];
            addStacks(playerObject.chosenType.type,playerObject.typeStacks,playerObject.chosenType.stack);
        }
        
    }

    async fetchStreamerData() {
        try {
            this.streamer = await getStreamerData();
            this.socket = TwitchWebSocket.getInstance(this.streamer);
            getViewerChoice(this.streamer, this.socket).then(choice => {
                this.addStackToPlayer(choice);
            }).catch(error => {
                console.error("Erreur lors de la récupération des données du joueur:", error);
            });
        } catch (error) {
            console.error("Erreur lors de la récupération des données du streamer:", error);
        }
    }
}