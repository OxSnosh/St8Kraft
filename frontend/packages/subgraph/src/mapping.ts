import { BigInt, Address } from "@graphprotocol/graph-ts";
import {
  CountryMinter,
  NationCreated,
} from "../generated/CountryMinter/CountryMinter";
import { Nation } from "../generated/schema";


export function handleNationCreated(event: NationCreated): void {
  let id = event.transaction.hash.toHex() + "-" + event.logIndex.toString();
  
  let nation = new Nation(id);
  
  nation.nationId = event.params.countryId;
  nation.ruler = event.params.ruler
  nation.name = event.params.nationName
  nation.owner = event.params.owner; // Ensure it's stored as Bytes
  nation.createdAt = event.block.timestamp;
  nation.transactionHash = event.transaction.hash.toHex(); // Fix missing field

  nation.save();
}




// export function handleGreetingChange(event: GreetingChange): void {
//   let senderString = event.params.greetingSetter.toHexString();

//   let sender = Sender.load(senderString);

//   if (sender === null) {
//     sender = new Sender(senderString);
//     sender.address = event.params.greetingSetter;
//     sender.createdAt = event.block.timestamp;
//     sender.greetingCount = BigInt.fromI32(1);
//   } else {
//     sender.greetingCount = sender.greetingCount.plus(BigInt.fromI32(1));
//   }

//   let greeting = new Greeting(
//     event.transaction.hash.toHex() + "-" + event.logIndex.toString()
//   );

//   greeting.greeting = event.params.newGreeting;
//   greeting.sender = senderString;
//   greeting.premium = event.params.premium;
//   greeting.value = event.params.value;
//   greeting.createdAt = event.block.timestamp;
//   greeting.transactionHash = event.transaction.hash.toHex();

//   greeting.save();
//   sender.save();
// }
