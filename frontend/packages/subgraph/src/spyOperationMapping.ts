import { BigInt, Address } from "@graphprotocol/graph-ts";
import { SpyAttackResults } from "../generated/SpyOperationsContract/SpyOperationsContract";
import { SpyOperation } from "../generated/schema";

export function handleSpyOperation(event: SpyAttackResults): void {

    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let spyAttack = new SpyOperation(id)
    
    spyAttack.attackId = event.params.attackId,
    spyAttack.attackerId = event.params.attackerId,
    spyAttack.defenderId = event.params.defenderId,
    spyAttack.success = event.params.success,
    spyAttack.transactionHash = event.transaction.hash.toHex()
    
    spyAttack.save();

}