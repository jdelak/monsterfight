import Phaser from 'phaser';
import { typeChart, getRandomTypes } from '../utils/TypeChart';
import { Hero, heroes, getHeroesForPlayer } from '../utils/HeroList';

export default class GameInitScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameInitScene' });
    }

    preload() {
        this.load.image('background', 'assets/backgrounds/bg1.png');
        this.load.spritesheet('hero', 'assets/sprites/hero.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        this.add.text(this.cameras.main.centerX, 100, 'Choose your hero! (type !1, !2 or !3)', { font: '48px Arial', color: '#ffffff' }).setOrigin(0.5);

        const selectedTypes = getRandomTypes(9);
        const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5', 'Player6', 'Player7', 'Player8'];
        const playerHeroes: { [key: string]: Hero[] } = {};

        players.forEach((player, index) => {
            const heroesForPlayer = getHeroesForPlayer(selectedTypes);
            playerHeroes[player] = heroesForPlayer;

            this.add.text(200, 200 + index * 150, `${player}:`, { font: '32px Arial', color: '#ffffff' });

            heroesForPlayer.forEach((hero, heroIndex) => {
                this.add.text(350 + heroIndex * 300, 200 + index * 150, `${heroIndex + 1}. ${hero.name} (${hero.type})`, { font: '24px Arial', color: '#ffffff' });
            });
        });

        // Gérer les commandes du chat Twitch
        // this.input.keyboard.on('keydown', (event) => {
        //     if (event.key === '!') {
        //         const command = event.key + event.code.slice(-1);
        //         if (command === '!1' || command === '!2' || command === '!3') {
        //             const player = 'Player1'; // Remplacez par le joueur actuel
        //             const chosenHero = playerHeroes[player][parseInt(event.code.slice(-1)) - 1];
        //             console.log(`${player} a choisi ${chosenHero.name}`);
        //             // Mettre à jour l'interface pour montrer le choix du joueur
        //         }
        //     }
        // });
    }
}