import { BigInt, Address } from "@graphprotocol/graph-ts";
import { NavalAttackComplete } from "../generated/NavalAttackContract/NavalAttackContract";
import { NavalAttack } from "../generated/schema";

export function handleNavyAttack(event: NavalAttackComplete): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let navalAttack = new NavalAttack(id)
    
    navalAttack.attackId = event.params.battleId,
    navalAttack.attackerLosses = event.params.attackerLosses,
    navalAttack.defenderLosses = event.params.defenderLosses,
    navalAttack.transactionHash = event.transaction.hash.toHex()
    
    navalAttack.save();

}