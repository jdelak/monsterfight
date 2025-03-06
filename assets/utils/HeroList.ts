import { typeChart } from "./TypeChart";

export interface Hero {
    name: string;
    type: keyof typeof typeChart;
    attack: number;
    defense: number;
    attackSpeed: number;
    hp: number;
    passiveEffect: string;
    ultimate: string;
}

export const heroes: Hero[] = [
    { name: 'Bulbasaur', type: 'grass', attack: 106, defense: 57, attackSpeed: 0.85, hp: 450, passiveEffect: 'boostAttack', ultimate: 'Ultimate1' },
    { name: 'Charmander', type: 'fire', attack: 105, defense: 46, attackSpeed: 1.21, hp: 390, passiveEffect: 'reduceAttack', ultimate: 'Ultimate2' },
    { name: 'Squirtle', type: 'water', attack: 92, defense: 65, attackSpeed: 0.81, hp: 440, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Caterpie', type: 'bug', attack: 49, defense: 27, attackSpeed: 0.85, hp: 450, passiveEffect: 'reduceSpeed', ultimate: 'Ultimate3' },
    { name: 'Pidgey', type: 'flying', attack: 76, defense: 37, attackSpeed: 1.05, hp: 400, passiveEffect: 'reduceAccuracy', ultimate: 'Ultimate3' },
    { name: 'Rattata', type: 'normal', attack: 65, defense: 35, attackSpeed: 1.34, hp: 300, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Ekans', type: 'poison', attack: 94, defense: 49, attackSpeed: 1.03, hp: 350, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Pichu', type: 'electric', attack: 71, defense: 25, attackSpeed: 1.12, hp: 200, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Sandshrew', type: 'ground', attack: 89, defense: 57, attackSpeed: 0.76, hp: 500, passiveEffect: 'boostDefense', ultimate: 'Ultimate3' },
    { name: 'Cleffa', type: 'fairy', attack: 67, defense: 41, attackSpeed: 0.31, hp: 500, passiveEffect: 'reduceAttack', ultimate: 'Ultimate3' },
    { name: 'Mankey', type: 'fighting', attack: 107, defense: 40, attackSpeed: 1.3, hp: 400, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Abra', type: 'psychic', attack: 116, defense: 35, attackSpeed: 1.66, hp: 250, passiveEffect: 'reduceAccuracy', ultimate: 'Ultimate3' },
    { name: 'Geodude', type: 'rock', attack: 103, defense: 65, attackSpeed: 0.4, hp: 400, passiveEffect: 'boostDefense', ultimate: 'Ultimate3' },
    { name: 'Gastly', type: 'ghost', attack: 125, defense: 32, attackSpeed: 1.48, hp: 300, passiveEffect: 'boostAccuracy', ultimate: 'Ultimate3' },
    { name: 'Smoochum', type: 'ice', attack: 125, defense: 40, attackSpeed: 1.21, hp: 450, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Dratini', type: 'dragon', attack: 106, defense: 47, attackSpeed: 0.94, hp: 410, passiveEffect: 'reduceDefense', ultimate: 'Ultimate3' },
    { name: 'Murkrow', type: 'dark', attack: 157, defense: 42, attackSpeed: 1.68, hp: 600, passiveEffect: 'boostAccuracy', ultimate: 'Ultimate3' },
    { name: 'Aron', type: 'steel', attack: 103, defense: 60, attackSpeed: 0.58, hp: 500, passiveEffect: 'boostAccuracy', ultimate: 'Ultimate3' },
];

export function getHeroesForPlayer(selectedTypes: (keyof typeof typeChart)[]): Hero[] {
    const shuffledHeroes = [...heroes].sort(() => 0.5 - Math.random());
    const heroesForPlayer: Hero[] = [];
    const usedTypes = new Set<keyof typeof typeChart>();

    for (const hero of shuffledHeroes) {
        if (selectedTypes.includes(hero.type) && !usedTypes.has(hero.type)) {
            heroesForPlayer.push(hero);
            usedTypes.add(hero.type);
            if (heroesForPlayer.length === 3) break;
        }
    }

    return heroesForPlayer;
}