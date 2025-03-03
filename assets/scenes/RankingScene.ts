import Phaser from 'phaser';

export default class RankingScene extends Phaser.Scene {
    constructor() {
        super({ key: 'RankingScene' });
    }

    preload() {
        // Charger les ressources ici
    }

    create() {
        this.add.text(this.cameras.main.centerX, 100, 'Leaderboard', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, this.cameras.main.height - 50, 'Back', { font: '24px Arial', color: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene'));

        // Ajouter les éléments pour le classement ici
    }
}