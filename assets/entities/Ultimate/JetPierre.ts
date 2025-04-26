import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';
import { getTypeMultiplier } from '../../utils/TypeChart';

export class JetPierre extends Ultimate {
    constructor() {
        super('rock');
    }

    execute(hero: Hero, target: Hero): void {
        const multiplier = getTypeMultiplier(this.attackType, target.types);
        const damage = hero.atk * (1.5 + hero.ultimateDamage) * multiplier;
        target.current_hp -= damage;
        target.def -= 4;
    }
}