import { typeChart } from "./TypeChart";
import { Hero } from "../entities/Hero";
//Import de tous les pokémon


export const heroes: Hero[] = [
    new Hero('Bulbasaur', ['grass','poison']),     
    new Hero('Charmander', ['fire']),             
    new Hero('Squirtle', ['water']),               
    new Hero('Caterpie', ['bug']),                
    new Hero('Pidgey', ['normal','flying']),       
    new Hero('Rattata', ['normal']),               
    new Hero('Ekans', ['poison']),                 
    new Hero('Pichu', ['electric']),               
    new Hero('Sandshrew', ['ground']),             
    new Hero('Cleffa', ['fairy']),                 
    new Hero('Mankey', ['fighting']),              
    new Hero('Abra', ['psychic']),                 
    new Hero('Geodude', ['rock','ground']),        
    new Hero('Gastly', ['ghost','poison']),        
    new Hero('Smoochum', ['ice','psychic']),       
    new Hero('Dratini', ['dragon']),               
    new Hero('Murkrow', ['dark']),        
    new Hero('Aron', ['steel','rock']),            
];

export function getHeroesForPlayer(selectedTypes: (keyof typeof typeChart)[]): Hero[] {
    const shuffledHeroes = [...heroes].sort(() => 0.5 - Math.random());
    let heroesForPlayer: Hero[] = [];
    const usedTypes = new Set<keyof typeof typeChart>();

    for (const hero of shuffledHeroes) {

        if (hero.types.some(type => selectedTypes.includes(type)) && !hero.types.some(type => usedTypes.has(type))) {
            heroesForPlayer.push(hero);
            hero.types.forEach(type => usedTypes.add(type)); // Ajoute tous les types du héros au set utilisé
            // Si on a 3 héros, on arrête
            if (heroesForPlayer.length === 3) break;
            
        }
    }

    return heroesForPlayer;
}