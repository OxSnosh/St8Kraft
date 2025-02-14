import { BigInt, Address } from "@graphprotocol/graph-ts";
import { WarDeclared } from "../generated/WarContract/WarContract";
import { War } from "../generated/schema";


export function handleWarDeclared(event: WarDeclared): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  
  let war = new War(id);
  
  war.warId = event.params.warId;
  war.offenseId = event.params.offenseId
  war.defenseId = event.params.defenseId
  war.transactionHash = event.transaction.hash.toHex();

  war.save();
}
