import { Ultimate } from '../Ultimate';
import { Hero } from '../Hero';

export class JetSable extends Ultimate {
    constructor() {
        super('ground');
    }

    execute(hero: Hero, target: Hero): void {
        hero.dodgeRate += 0.1;
        target.missNextAttack = true;
    }
}