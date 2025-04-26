import Phaser from 'phaser';
import { FinalPlayer } from '../utils/FinalPlayer';
import { Hero } from '../entities/Hero';

export default class GameScene extends Phaser.Scene {

    public players:any;
    private battles!: Array<{
        p1: FinalPlayer;
        p2: FinalPlayer;
      }>;
    //   private heroSprites = new Map<Hero, Phaser.Physics.Arcade.Sprite>();
    private playerTexts: Phaser.GameObjects.Text[] = [];
    private battleResults: Set<string> = new Set(); // Pour suivre les combats déjà terminés
    private playerNameTexts: Map<Hero, Phaser.GameObjects.Text> = new Map();
    
    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
        this.load.setPath('assets');
        this.load.image('background', 'images/pokemon_background.png');
        this.load.pack('pokemon_icons', 'datas/pokemon.json', 'pokemon_icons');
        this.load.image('projectile', 'images/projectile.gif'); 
    }

    init(data:any) {
        this.players = data.players as FinalPlayer[];
    }

    create() {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.setupBattles();

    }

    private setupBattles(){
        // on récupère les joueurs vivants
        const alive = this.players.filter((p:any) => p.hp > 0);

        //si impair on clone un joueur vivant pour former les pairs
        if (alive.length % 2 === 1) {
            const idx = Phaser.Math.Between(0, alive.length - 1);
            alive.push(this.clonePlayer(alive[idx]));
        }

        this.battles = [];

        for (let i = 0; i < 8; i += 2) {

            const p1 = alive[i];
            const p2 = alive[i+1];

            const battleZone = Math.floor(i / 2);
            const x1 = 200 + (battleZone % 2) * 800;
            const x2 = 600 + (battleZone % 2) * 800;
            const y = 200 + Math.floor(battleZone / 2) * 400;

            //plaçage des pokémon à gauche
            p1.hero.side = 'left';
            p1.hero.x = x1;
            p1.hero.y = y;
            const spr1 = this.add.image(x1, y,`${p1.hero.name.toLowerCase()}_icon`).setOrigin(0.5);
            spr1.setScale(0.5); 

            // plaçage des pokémon à droite
            p2.hero.side = 'right';
            p2.hero.x = x2;
            p2.hero.y = y;
            const spr2 = this.add.image(x2, y,`${p2.hero.name.toLowerCase()}_icon`).setOrigin(0.5); 
            spr2.setScale(0.5); 

            this.battles.push({p1, p2});

            // Créer les textes pour les noms des joueurs
            this.createPlayerNameText(p1.hero, p1, x1, y);
            this.createPlayerNameText(p2.hero, p2, x2, y);

            // Créer le listing initial des joueurs
            this.updatePlayerListing();

        }

    }

    update(time: number, delta: number): void {
        this.playerNameTexts.forEach((text, hero) => {
            text.setPosition(hero.x, hero.y - 96);
        });
    }


    private clonePlayer(player: FinalPlayer): FinalPlayer {
        // copie superficielle, mais on recrée un Hero neuf pour que HP soit indépendant
        const h = player.hero;
        const hc = new Hero(h.name, h.types);
        // recopier l’essentiel des stats et de l’HP
        hc.current_hp = h.current_hp;
        hc.hp = h.hp;
        hc.atk = h.atk;
        hc.def = h.def;
        hc.attackSpeed = h.attackSpeed;
        hc.mana = h.mana;
        hc.critRate = h.critRate;
        hc.dodgeRate = h.dodgeRate;
        hc.ultimateDamage = h.ultimateDamage;

        return {
        ...player,
        hero: hc
        };
    }

    private createPlayerNameText(hero: Hero, player:FinalPlayer, x:number, y:number){
        const text = this.add.text(x, y - 96, player.playerName, {
            fontSize: '20px',
            color: '#000000',
            padding: { x: 5, y: 2 }
        }).setOrigin(0.5);
        this.playerNameTexts.set(hero, text);
    }

    private updatePlayerListing(){
         // Supprimer les anciens textes
         this.playerTexts.forEach(text => text.destroy());
         this.playerTexts = [];
 
         // Trier les joueurs par points de vie décroissant
         const sortedPlayers = [...this.players].sort((a, b) => b.hp - a.hp);
 
         // Créer les nouveaux textes
         sortedPlayers.forEach((player, index) => {
             if (player.hero) {
                 const pokeIcon = this.add.image(1546, 128 + index * 80,`${player.hero.name.toLowerCase()}_icon`).setOrigin(0.5);
                 pokeIcon.setScale(0.25);
                 const text = this.add.text(1600, (128 + index * 80) - 16, 
                     `${player.playerName} (${player.hp} PV)`, 
                     { 
                         fontSize: '24px', 
                         color: '#ffffff',
                         backgroundColor: '#000000',
                         padding: { x: 10, y: 5 }
                     }
                 );
                 this.playerTexts.push(text);
             }
         });
    }
}