import { typeChart } from "../utils/TypeChart";
import { Hero } from "./Hero";

export abstract class Ultimate {

    attackType: keyof typeof typeChart;

    constructor(attackType:keyof typeof typeChart) {
        this.attackType = attackType;
    }

    abstract execute(hero:Hero, target:Hero):void;

}