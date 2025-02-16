import { BigInt, Address } from "@graphprotocol/graph-ts";
import { NukeAttackEvent } from "../generated/NukeContract/NukeContract";
import { NukeAttack } from "../generated/schema";

export function handleNukeAttackResults(event: NukeAttackEvent): void {
    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let nukeAttack = new NukeAttack(id)
    
    nukeAttack.attackId = event.params.id,
    nukeAttack.attackerId = event.params.attackerId,
    nukeAttack.defenderId = event.params.defenderId,
    nukeAttack.warId = event.params.warId,
    nukeAttack.landed = event.params.landed,
    
    event.transaction.hash.toHex()
    
    nukeAttack.save();
}
