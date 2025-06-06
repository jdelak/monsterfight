import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';
import { getTypeMultiplier } from '../../utils/TypeChart';

export class GriffeAcier extends Ultimate {
    constructor() {
        super('steel');
    }

    execute(hero: Hero, target: Hero): void {
        const multiplier = getTypeMultiplier(this.attackType, target.types);
        const damage = hero.atk * (1.5 + hero.ultimateDamage) * multiplier;
        target.current_hp -= damage;
        hero.atk += 2;
    }
}