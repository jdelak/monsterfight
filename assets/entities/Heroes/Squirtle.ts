import { Hero } from '../Hero';
import { Ecume } from '../Ultimate/Ecume';

export class Squirtle extends Hero {

    constructor(name: string, copyFrom?: Hero) {
        super(name, ['water']);
        this.ultimate = new Ecume();
        this.base_hp = 450;
        this.hp_level = 70;
        this.base_atk = 106;
        this.atk_level = 2;
        this.base_def = 57;
        this.def_level = 4;
        this.base_attackSpeed = 0.85;
        this.attackSpeed_level = 0.05;
        if(this.level > 19){
            this.name = "Blastoise";
            this.base_hp = 800;
            this.hp_level = 50;
            this.base_atk = 168;
            this.atk_level = 4;
            this.base_def = 91;
            this.def_level = 7;
            this.base_attackSpeed = 1.48;
        }
        if(this.level > 9){
            this.name = "Wartortle";
            this.base_hp = 600;
            this.hp_level = 54;
            this.base_atk = 132;
            this.base_def = 72;
            this.base_attackSpeed = 1.12;
        }
    }

}