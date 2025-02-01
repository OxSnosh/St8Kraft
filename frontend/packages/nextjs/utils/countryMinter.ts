

export const checkOwnership = async (
    nationId: string,
    callerAddress: string,
    publicClient: any,
    countryMinterContract: any
) => {
    if (!publicClient || !countryMinterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(countryMinterContract, "countryMinterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, countryMinterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: "checkOwnership",
        args: [nationId, callerAddress],
    });
}

export const getCountryCount = async (
    publicClient: any,
    countryMinterContract: any
) => {
    if (!publicClient || !countryMinterContract) {
        console.log(publicClient, "publicClient")
        console.log(countryMinterContract, "countryMinterContract")
        console.error("Missing required data: publicClient, countryMinterContract.");
        return;
    }

    return await publicClient.readContract({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: "getCountryCount",
        args: [],
    });
}

export const tokensOfOwner = async (
    addressOwner: string,
    publicClient: any,
    countryMinterContract: any
) => {
    if (!publicClient || !countryMinterContract || !addressOwner) {
        console.log(publicClient, "publicClient")
        console.log(countryMinterContract, "countryMinterContract")
        console.log(addressOwner, "owner")
        console.error("Missing required data: publicClient, countryMinterContract, or owner.");
        return;
    }

    return await publicClient.readContract({
        abi: countryMinterContract.abi,
        address: countryMinterContract.address,
        functionName: "tokensOfOwner",
        args: [addressOwner],
    });
}