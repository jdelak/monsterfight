import Phaser from 'phaser';

export default class GamePrepScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GamePrepScene' });
    }

    preload() {
        this.load.image('background', 'assets/images/background.png');
    }

    create() {
        this.add.text(this.cameras.main.centerX, 100, 'Preparation Phase', { font: '48px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.add.image(0, 0, 'background');

        // Ajoutez ici la logique pour afficher les joueurs et leurs statistiques

    

        // Ajoutez ici la logique pour passer à la scène suivante après la préparation
    }
}