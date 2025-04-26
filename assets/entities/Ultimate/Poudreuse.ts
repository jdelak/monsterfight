import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';
import { getTypeMultiplier } from '../../utils/TypeChart';

export class Poudreuse extends Ultimate {
    constructor() {
        super('ice');
    }

    execute(hero: Hero, target: Hero): void {
        const multiplier = getTypeMultiplier(this.attackType, target.types);
        const damage = hero.atk * (1.4 + hero.ultimateDamage) * multiplier;
        target.current_hp -= damage;
    }
}