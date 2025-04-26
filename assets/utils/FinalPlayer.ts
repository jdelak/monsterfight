import { Hero } from "../entities/Hero";

export interface FinalPlayer {
    
    playerName: string;
    hp: number;
    // elo:number;
    hero: Hero;
    wins:number;
    availableStats:any;
    selectedChoice:any;
}

export function getPlayerByName(players: FinalPlayer[], playerName: string): FinalPlayer | undefined {
    return players.find(player => player.playerName === playerName);
}