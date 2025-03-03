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
    { name: 'Bulbasaur', type: 'grass', attack: 10, defense: 5, attackSpeed: 1.0, hp: 100, passiveEffect: 'attackSpeed', ultimate: 'Ultimate1' },
    { name: 'Charmander', type: 'fire', attack: 12, defense: 4, attackSpeed: 0.9, hp: 90, passiveEffect: 'attack', ultimate: 'Ultimate2' },
    { name: 'Squirtle', type: 'water', attack: 8, defense: 7, attackSpeed: 1.1, hp: 110, passiveEffect: 'defense', ultimate: 'Ultimate3' },
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