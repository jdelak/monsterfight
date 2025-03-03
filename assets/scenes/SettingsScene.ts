import Phaser from 'phaser';

export default class SettingsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SettingsScene' });
    }

    preload() {
        this.load.image('background', 'assets/backgrounds/bg1.png');
    }

    create() {
        this.add.image(960, 540, 'background');

        // Ajoutez ici la logique pour afficher les paramètres

        this.add.text(this.cameras.main.centerX, 100, 'Settings', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 200, 'Language', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 300, 'Music Volume', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);
        this.add.text(this.cameras.main.centerX, 400, 'Deactivate Music', { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);


        const backButton = this.add.text(100, 50, 'Back', { fontSize: '32px', color: '#fff' }).setInteractive();
        
        backButton.on('pointerdown', () => this.scene.start('MainScene'));
    }
}