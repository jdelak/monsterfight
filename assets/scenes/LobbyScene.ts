import Phaser from 'phaser';

export default class LobbyScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LobbyScene' });
    }

    preload() {
        this.load.image('background', 'assets/backgrounds/bg1.png');
        this.load.image('button', 'assets/icons/button.png');
    }

    create() {
        this.add.text(this.cameras.main.centerX, 100, 'Lobby', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(100, 50, 'Back', { font: '24px Arial', color: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('MainScene'));

        this.add.text(this.cameras.main.width - 150, 50, 'Start Game', { font: '24px Arial', color: '#ffffff' })
            .setInteractive()
            .on('pointerdown', () => this.scene.start('GameInitScene'));
    }
}