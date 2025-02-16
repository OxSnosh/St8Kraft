import { BigInt, Address } from "@graphprotocol/graph-ts";
import { CruiseMissileAttackResults } from "../generated/CruiseMissileContract/CruiseMissileContract";
import { CruiseMissileAttack } from "../generated/schema";


export function handleCruiseMissileAttackResults(event: CruiseMissileAttackResults): void {
    let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
    
    let cruiseMissile = new CruiseMissileAttack(id);

    cruiseMissile.attackId = event.params.attackId;
    cruiseMissile.attackerId = event.params.attackerId
    cruiseMissile.defenderId = event.params.defenderId
    cruiseMissile.landed = event.params.landed
    cruiseMissile.warId = event.params.warId
    cruiseMissile.damageTypeNumber = event.params.damageTypeNumber
    cruiseMissile.transactionHash = event.transaction.hash.toHex();

    cruiseMissile.save();
}
