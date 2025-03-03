import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/backgrounds/bg1.png');
    }

    create() {
        this.add.image(960, 540, 'background');

        // Ajoutez ici la logique pour afficher les combats entre les joueurs


        // Ajoutez ici la logique pour gérer les combats et passer à la scène suivante
    }
}