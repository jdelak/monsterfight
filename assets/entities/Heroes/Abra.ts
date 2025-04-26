import { Hero } from '../Hero';
import { ChocMental } from '../Ultimate/ChocMental';

export class Abra extends Hero {

    constructor(name: string, copyFrom?: Hero) {
        super(name, ['psychic']);
        this.ultimate = new ChocMental();
        this.base_hp = 250;
        this.hp_level = 100;
        this.base_atk = 63;
        this.atk_level = 4;
        this.base_def = 35;
        this.def_level = 5;
        this.base_attackSpeed = 1.66;
        this.attackSpeed_level = 0.03;
        //evo2
        if(this.level > 19){
            this.name = "Alakazam";
            this.base_hp = 550;
            this.hp_level = 60;
            this.base_atk = 93;
            this.atk_level = 3;
            this.base_def = 70;
            this.def_level = 4;
            this.base_attackSpeed = 2.2;
        }
        //evo1
        if(this.level > 9){
            this.name = "Kadabra";
            this.base_hp = 400;
            this.hp_level = 70;
            this.base_atk = 73;
            this.atk_level = 4;
            this.base_def = 50;
            this.def_level = 4;
            this.base_attackSpeed = 1.93;
        }
    }

}