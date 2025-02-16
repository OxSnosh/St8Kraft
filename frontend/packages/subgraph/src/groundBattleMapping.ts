import { BigInt, Address } from "@graphprotocol/graph-ts";
import { GroundBattleResultsEvent } from "../generated/GroundBattleContract/GroundBattleContract";
import { GroundBattle } from "../generated/schema";


export function handleGroundBattleResults(event: GroundBattleResultsEvent): void {
    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let groundBattle = new GroundBattle(id);
    
    groundBattle.groundBattleId = event.params.battleId;
    groundBattle.warId = event.params.warId;
    groundBattle.attackerId = event.params.attackerId
    groundBattle.attackerSoldierLosses = event.params.attackSoldierLosses
    groundBattle.attackerTankLosses = event.params.attackTankLosses
    groundBattle.defenderId = event.params.defenderId
    groundBattle.defenderSoldierLosses = event.params.defenderSoldierLosses
    groundBattle.defenderTankLosses = event.params.defenderTankLosses
    groundBattle.transactionHash = event.transaction.hash.toHex();

    groundBattle.save();
}
