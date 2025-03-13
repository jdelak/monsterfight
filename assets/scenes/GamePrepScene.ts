import Phaser from 'phaser';

export default class GamePrepScene extends Phaser.Scene {

    public players:any;

    constructor() {
        super({ key: 'GamePrepScene' });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'images/pokemon_background.png');
        this.load.pack('pokemon_icons', 'datas/pokemon.json', 'pokemon_icons');
    }

    init(data:any){
        this.players = data.players;
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(this.cameras.main.centerX, 32, 'Preparation Phase', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
        console.log(this.players);
        // Ajoutez ici la logique pour afficher les joueurs et leurs statistiques

    

        // Ajoutez ici la logique pour passer à la scène suivante après la préparation
    }
}