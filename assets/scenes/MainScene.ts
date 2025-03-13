import Phaser from 'phaser';

export default class MainScene extends Phaser.Scene {

    public streamerName:string;
    constructor() {
        super({ key: 'MainScene' });
        this.streamerName = streamer;
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background1', 'images/pokemon_background.png');
        this.load.image('logo', 'images/pokefight.png');
        this.load.image('button', 'images/round-rectangle-white.png');
    }

    create() {

        
        this.add.image(0, 0, 'background1').setOrigin(0,0);
        this.add.image(this.cameras.main.centerX, 100, 'logo');

        //streamer name get from back
        this.add.text(1600,100, this.streamerName, { font: '32px Arial', color: '#ffffff' }).setOrigin(0.5);

        // Create Game
        const createGameBtn = this.add.image(0,0, 'button')
        .setOrigin(0.5);
        const createGameText = this.add.text(0,0, 'Create a Game', { font: '32px Arial', color: '#000000' }).setOrigin(0.5);
        const gameContainer = this.add.container(this.cameras.main.centerX, 300,[createGameBtn, createGameText]);
        gameContainer.setSize(400,82)
        .setInteractive()
        .on('pointermove', () =>
            {
                createGameBtn.setTint(0x000000);
                createGameText.setColor('#ffffff');
            }, 
        )
        .on('pointerdown', () => this.scene.start('LobbyScene'))
        .on('pointerout', () => {
            createGameText.setColor('#000000');
            createGameBtn.clearTint();
            
        });
               
    
        // LeaderBoard
        const rankingBtn = this.add.image(0, 0, 'button').setOrigin(0.5); 
        const rankingText = this.add.text(0, 0, 'Leaderboard', { font: '32px Arial', color: '#000000' }).setOrigin(0.5);
        const rankingContainer = this.add.container(this.cameras.main.centerX, 450,[rankingBtn, rankingText]);
        rankingContainer.setSize(400,82)
        .setInteractive()
        .on('pointermove', () =>
            {
                rankingBtn.setTint(0x000000);
                rankingText.setColor('#ffffff');
            }, 
        )
        .on('pointerdown', () => this.scene.start('RankingScene'))
        .on('pointerout', () => {
            rankingText.setColor('#000000');
            rankingBtn.clearTint();
            
        });


        //Settings
        const settingsBtn = this.add.image(0, 0, 'button').setOrigin(0.5); 
        const settingsText = this.add.text(0, 0, 'Settings', { font: '32px Arial', color: '#000000' })
            .setOrigin(0.5);
        const settingsContainer = this.add.container(this.cameras.main.centerX, 600,[settingsBtn, settingsText]);
        settingsContainer.setSize(400,82)
        .setInteractive()
        .on('pointermove', () =>
            {
                settingsBtn.setTint(0x000000);
                settingsText.setColor('#ffffff');
            }, 
        )
        .on('pointerdown', () => this.scene.start('SettingsScene'))
        .on('pointerout', () => {
            settingsText.setColor('#000000');
            settingsBtn.clearTint();
            
        });
    }

}