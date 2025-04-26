import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';
import { getTypeMultiplier } from '../../utils/TypeChart';

export class ViveAttaque extends Ultimate {
    constructor() {
        super('normal');
    }

    execute(hero: Hero, target: Hero): void {
        const multiplier = getTypeMultiplier(this.attackType, target.types);
        const damage = hero.atk * (1.4 + hero.ultimateDamage) * multiplier;
        target.current_hp -= damage;
        hero.attackSpeed += 0.05;
    }
}