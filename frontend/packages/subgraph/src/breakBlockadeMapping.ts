import { BigInt, Address } from "@graphprotocol/graph-ts";
import { BreakBlockadeComlpete } from "../generated/BreakBlocadeContract/BreakBlocadeContract";
import { BreakBlockade } from "../generated/schema";

export function handleBreakBlockade(event: BreakBlockadeComlpete): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let breakBlockade = new BreakBlockade(id)
    
    breakBlockade.battleId = event.params.battleId,
    breakBlockade.attackerLosses = event.params.attackerLosses,
    breakBlockade.defenderLosses = event.params.defenderLosses,
    breakBlockade.transactionHash = event.transaction.hash.toHex()
    
    breakBlockade.save();

}