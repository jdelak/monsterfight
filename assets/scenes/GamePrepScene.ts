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
            
            if(this.currentPhase > 0){
                stackNumber = prepChoice[index];
            } 
           
            typeChoice.forEach((type) => {
                playerTypes.push({"type":type, "stack":stackNumber });
            });

            player.types = playerTypes;
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
    }

    startCountdown() {
        const countdownInterval = setInterval(() => {
            this.countdown--;
            this.countdownText.setText(`${this.countdown}`);
            if (this.countdown < 0) {
                clearInterval(countdownInterval);
                this.countdownText.destroy();
                this.addFirstTypeToPlayers(this.players)
                // this.scene.start('GamePrepScene', {players:this.finalPlayers, selectedTypes:this.types,phase:0});
                console.log(this.players);
                this.currentPhase++;
                // this.scene.start('GamePrepScene', {players:this.players, selectedTypes:this.types,phase:this.currentPhase});
            }
        }, 1000);
    }

    addFirstTypeToPlayers(players:FinalPlayer[]){

        players.forEach(player => {
            if ((player.chosenType.type == '') && (player.chosenType.stack == 0 )){
                player.chosenType = player.types[0];
                console.log(player.chosenType);
                addStacks(player.chosenType.type,player.typeStacks,player.chosenType.stack)      
            }
        })

    }

    addStackToPlayer(player: [string, string]){
        const playerObject = getPlayerByName(this.players, player[0]);
        if(playerObject != undefined) {
            playerObject.chosenType = playerObject.types[parseInt(player[1].substring(1)) - 1];
            console.log(playerObject.chosenType);
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