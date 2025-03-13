import  { Boot }  from './scenes/Boot';
import  { Game } from 'phaser';
import  Preloader  from './scenes/Preloader';
import  MainScene  from './scenes/MainScene';
import  LobbyScene  from  './scenes/LobbyScene';
import  HeroSelectionScene  from  './scenes/HeroSelectionScene';
import  GamePrepScene  from  './scenes/GamePrepScene';
import  GameScene  from  './scenes/GameScene';
import  RankingScene  from  './scenes/RankingScene';
import  SettingsScene  from  './scenes/SettingsScene';


//  Find out more information about the Game Config at: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
    type: Phaser.AUTO,
    width: 1920,
    height: 900,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
        }
    },
    scene: [
        // Boot,
        Preloader,
        MainScene,
        LobbyScene,
        HeroSelectionScene,
        GamePrepScene,
        GameScene,
        RankingScene,
        SettingsScene
    ],
   
};

export default new Game(config);
