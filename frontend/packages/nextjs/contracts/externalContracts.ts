import { GenericContractsDeclaration } from "~~/utils/scaffold-eth/contract";
import metadata from "../../../../backend/script-metadata.json";
import { Address } from "viem";
import { Abi, AbiParameter } from "abitype";
import { CountryMinter } from '../../../../backend/typechain-types/contracts/CountryMinter';

const fixAbi = (abi: any[]): Abi => {
  return abi.map((entry) => {
    if (entry.inputs) {
      entry.inputs = entry.inputs.map((input: AbiParameter) => ({
        ...input,
        name: input.name || "", // Provide a default name if undefined
      }));
    }
    return entry;
  });
};

const externalContracts: GenericContractsDeclaration = {
  31337: {
    CountryMinter: {
      address: metadata.HARDHAT.countryminter.address as Address,
      abi: fixAbi(metadata.HARDHAT.countryminter.Abi),
    },
    
  },
};

export default externalContracts;
