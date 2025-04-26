import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';
import { getTypeMultiplier } from '../../utils/TypeChart';

export class FouetLiane extends Ultimate {
    constructor() {
        super('grass');
    }

    execute(hero: Hero, target: Hero): void {
        const multiplier = getTypeMultiplier(this.attackType, target.types);
        const damage = hero.atk * (1.45 + hero.ultimateDamage) * multiplier;
        target.current_hp -= damage;
    }
}