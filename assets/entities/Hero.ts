import { typeChart } from "../utils/TypeChart";
import { Ultimate } from "./Ultimate";

export class Hero {

    public name:string;
    public level:number;
    public base_hp:number;
    public hp_level:number;
    public hp:number;
    public current_hp:number;
    public base_atk:number;
    public atk_level:number;
    public atk:number;
    public base_def:number;
    public def_level:number;
    public def:number;
    public base_attackSpeed:number;
    public attackSpeed_level:number;
    public attackSpeed:number;
    public mana:number;
    public dodgeRate:number;
    public critRate:number;
    public types: (keyof typeof typeChart)[];
    public stunned:boolean;
    public canAttack:boolean;
    public nextAttackTime:number;
    public ultimate!: Ultimate;
    public missNextAttack:boolean;
    public ultimateDamage: number;
    public x!:number;
    public y!:number;

    constructor(name:string, types: (keyof typeof typeChart)[], copyFrom = null) {
        this.name = name;
        this.level = 1;
        this.base_hp = 100;
        this.hp_level = 1;
        this.hp = this.base_hp + (this.level * this.hp_level);
        this.current_hp = this.hp;
        this.base_atk = 10;
        this.atk_level = 1;
        this.atk = this.base_atk + (this.level * this.atk_level);
        this.base_def = 5;
        this.def_level = 1;
        this.def = this.base_def + (this.level * this.def_level);
        this.base_attackSpeed = 10;
        this.attackSpeed_level = 1;
        this.attackSpeed = this.base_attackSpeed + (this.level * this.attackSpeed_level);
        this.mana = 0;
        this.dodgeRate = 0.1;
        this.critRate = 0.1;
        this.types = types;
        this.nextAttackTime = 0; // Temps pour la prochaine attaque
        this.stunned = false; // État étourdi
        this.canAttack = true;
        this.missNextAttack = false;
        this.ultimateDamage = 1;

        // if (copyFrom) {
        //     this.hp = copyFrom.hp;
        //     this.attack = copyFrom.attack;
        //     this.defense = copyFrom.defense;
        //     this.attackSpeed = copyFrom.attackSpeed;
        //     this.mana = copyFrom.mana;
        //     this.dodgeRate = copyFrom.dodgeRate;
        //     this.critRate = copyFrom.critRate;
        //     this.ultimateDamage = copyFrom.ultimateDamage;
        // }
    }


    applyStun(target:Hero) {
        target.stunned = true;
        target.canAttack = false;
    }

    attack(target:Hero, currentTime:number) {
        
        if (currentTime >= this.nextAttackTime) {
            if (this.mana >= 100) {
                this.ultimate.execute(this, target);
                this.mana = 0;
            } else {
                this.mana += 10;
                this.basicAttack(target);
            }
            this.nextAttackTime = currentTime + this.attackSpeed;
        }
    }

    basicAttack(target:Hero) {
        let damage = this.atk- target.def;
        if (Math.random() < this.critRate) {
            damage *= 2;
        }
        if (Math.random() < target.dodgeRate) {
            damage = 0;
        }
        if(this.missNextAttack === true){
            damage = 0;
        }
        target.hp -= damage;
        this.applyPassiveEffects(this,target);
    }

    selfAttack(){
        this.current_hp -= this.atk;
    }

    applyPassiveEffects(hero:Hero, target:Hero){
        return;
    }

    applyBurn(target:Hero) {
        const damage = target.hp / 8;
        target.current_hp -= damage;
    }

    applyFreeze(target:Hero) {
        target.stunned = true;
        target.canAttack = false;
    }

    selfHeal(amount:number) {
        this.current_hp += amount;
    }

    applyConfusion(target:Hero){
        target.selfAttack();
    }

    applyPoison(target:Hero){
        const noDamageTypes = ['poison', 'steel'];
        if(target.types.some(type => noDamageTypes.includes(type))) {
            return;
        } else {
            while(target.current_hp > 0 && this.current_hp > 0) {
                const poisonDamage = target.hp / 16;
                target.current_hp -= poisonDamage; 
            }
        }
       
    }

}
