import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {

    public players:any;
    
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'images/pokemon_background.png');
        this.load.pack('pokemon_icons', 'datas/pokemon.json', 'pokemon_icons');
        this.load.pack('types', 'datas/type.json', 'types');
    }

    init(data:any) {
        this.players = data.players;
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        console.log(this.players);
        // Ajoutez ici la logique pour afficher les combats entre les joueurs


        // Ajoutez ici la logique pour gérer les combats et passer à la scène suivante
    }
}