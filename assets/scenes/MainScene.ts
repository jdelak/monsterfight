import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {

    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        this.load.image('background1', 'assets/images/pokemon_background.png');
        this.load.image('button', 'assets/icons/button.png');
    }

    create() {

        this.add.image(0, 0, 'background1').setOrigin(0,0);


        //streamer name get from back
        this.add.text(1600,100, streamer, { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);;
        this.add.text(this.cameras.main.centerX, 100, 'PokéFight', { font: '64px Arial', color: '#ffffff' }).setOrigin(0.5);

        this.add.text(this.cameras.main.centerX, 300, 'Create a Game', { font: '32px Arial', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('LobbyScene'));

        this.add.text(this.cameras.main.centerX, 400, 'Leaderboard', { font: '32px Arial', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('RankingScene'));

        this.add.text(this.cameras.main.centerX, 500, 'Settings', { font: '32px Arial', color: '#ffffff' })
            .setOrigin(0.5)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('SettingsScene'));
    }

}