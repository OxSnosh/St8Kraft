import { BigInt, Address } from "@graphprotocol/graph-ts";
import { BlockadeCompleted } from "../generated/NavalBlockadeContract/NavalBlockadeContract";
import { Blockade } from "../generated/schema";

export function handleBlockade(event: BlockadeCompleted): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let blockade = new Blockade(id)
    
    blockade.battleId = event.params.battleId,
    blockade.attackerLosses = event.params.attackerLosses,
    blockade.defenderLosses = event.params.defenderLosses,
    blockade.transactionHash = event.transaction.hash.toHex()
    
    blockade.save();

}