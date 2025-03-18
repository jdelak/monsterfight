import { Hero } from "./HeroList";
import { TypeStack } from "./TypeStack";

export interface FinalPlayer {
    
    playerName: string;
    hp: number;
    // elo:number;
    hero: Hero;
    wins:number;
    types:any[];
    chosenType:TypeStack;
    typeStacks:TypeStack[];
}

export function getPlayerByName(players: FinalPlayer[], playerName: string): FinalPlayer | undefined {
    return players.find(player => player.playerName === playerName);
}