import { BigInt, Address } from "@graphprotocol/graph-ts";
import { AirAssaultCasualties } from "../generated/AdditionalAirBattle/AdditionalAirBattle";
import { AirBattle } from "../generated/schema";

export function handleAirBattle(event: AirAssaultCasualties): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let airBattle = new AirBattle(id)
    
    airBattle.battleId = event.params.battleId,
    airBattle.attackerId = event.params.attackerId,
    airBattle.defenderId = event.params.defenderId,
    airBattle.attackerFighterLosses = event.params.attackerFighterCasualties,
    airBattle.attackerBomberLosses = event.params.attackerBomberCasualties,
    airBattle.defenderFighterLosses = event.params.defenderFighterCasualties,
    airBattle.infrastructureDamage = event.params.infrastructureDamage,
    airBattle.tankDamage = event.params.tankDamage,
    airBattle.cruiseMissileDamage = event.params.cruiseMissileDamage,
    airBattle.transactionHash = event.transaction.hash.toHex()
    
    airBattle.save();

}