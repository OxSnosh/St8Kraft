import { BigInt, Address } from "@graphprotocol/graph-ts";
import { NationCreated } from "../generated/CountryMinter/CountryMinter";
import { Nation } from "../generated/schema";


export function handleNationCreated(event: NationCreated): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  
  let nation = new Nation(id);
  
  nation.nationId = event.params.countryId;
  nation.ruler = event.params.ruler
  nation.name = event.params.nationName
  nation.owner = event.params.owner;
  nation.createdAt = event.block.timestamp;
  nation.transactionHash = event.transaction.hash.toHex();

  nation.save();
}
