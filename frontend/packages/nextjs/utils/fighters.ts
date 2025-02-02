
export const getFighters = async (
    nationId: string,
    publicClient: any,
    fightersContract: any
) => {
    if (!publicClient || !fightersContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fightersContract, "fightersContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fightersContract, or nationId.");
        return;
    }

    const fighters: { fighterCount: any; name: string }[] = [];

    try {
        const fightersNames = [
            { key: "getYak9Count", name: "Yak-9s" },
            { key: "getP51MustangCount", name : "P-51 Mustangs" },
            { key: "getF86SabreCount", name: "F-86 Sabres" },
            { key: "getMig15Count", name: "MiG-15s" },
            { key: "getF100SuperSabreCount", name: "F-100 Super Sabres" },
            { key: "getF35LightningCount", name: "F-35 Lightnings" },
            { key: "getF15EagleCount", name: "F-15 Eagles" },
            { key: "getSu30MkiCount", name: "Su-30 MKIs" },
            { key: "getF22RaptorCount", name: "F-22 Raptors" },
        ]
        
        for (const { key, name } of fightersNames) {
            const fighterCount = await publicClient.readContract({
                abi: fightersContract.abi,
                address: fightersContract.address,
                functionName: key,
                args: [nationId],
            });

            if (fighterCount > 0) {
                fighters.push({ fighterCount, name });
            }
        }

        return fighters;

    } catch (error) {
        console.error("Error getting fighters", error);
    }
}

export const buyYak9 = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket1, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket1.abi,
            address: fighterMarket1.address,
            functionName: "buyYak9",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying Yak9:", error);
    }
}

export const buyP51Mustang = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket1, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket1.abi,
            address: fighterMarket1.address,
            functionName: "buyP51Mustang",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying P51Mustang:", error);
    }
}

export const buyF86Sabre = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket1, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket1.abi,
            address: fighterMarket1.address,
            functionName: "buyF86Sabre",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying F86Sabre:", error);
    }
}

export const buyMig15 = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket1, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket1.abi,
            address: fighterMarket1.address,
            functionName: "buyMig15",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying Mig15:", error);
    }
}

export const buyF100SuperSabre = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket1, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket1.abi,
            address: fighterMarket1.address,
            functionName: "buyF100SuperSabre",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying F100SuperSabre:", error);
    }
}

export const buyF35Lightning = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket2 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket2, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket2.abi,
            address: fighterMarket2.address,
            functionName: "buyF35Lightning",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying F35Lightning:", error);
    }
}

export const buyF15Eagle = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket2 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket2, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket2.abi,
            address: fighterMarket2.address,
            functionName: "buyF15Eagle",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying F15Eagle:", error);
    }
}

export const buySu30Mki = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket2 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket2, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket2.abi,
            address: fighterMarket2.address,
            functionName: "buySu30Mki",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying Su30Mki:", error);
    }
}

export const buyF22Raptor = async (
    nationId: string,
    amount: number,
    publicClient: any,
    fighterMarket2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !fighterMarket2 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterMarket2, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: fighterMarket2.abi,
            address: fighterMarket2.address,
            functionName: "buyF22Raptor",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying F22Raptor:", error);
    }
}

export const getYak9Count = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getYak9Count",
        args: [nationId],
    });
}

export const getP51MustangCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getP51MustangCount",
        args: [nationId],
    });
}

export const getF86SabreCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getF86SabreCount",
        args: [nationId],
    });
}

export const getMig15Count = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getMig15Count",
        args: [nationId],
    });
}

export const getF100SuperSabreCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getF100SuperSabreCount",
        args: [nationId],
    });
}

export const getF35LightningCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getF35LightningCount",
        args: [nationId],
    });
}

export const getF15EagleCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getF15EagleCount",
        args: [nationId],
    });
}

export const getSu30MkiCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getSu30MkiCount",
        args: [nationId],
    });
}

export const getF22RaptorCount = async (
    nationId: string,
    publicClient: any,
    fighterContract: any
) => {
    if (!publicClient || !fighterContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(fighterContract, "fighterContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, fighterContract, or nationId.");
        return;
    }

    return await publicClient.readContract({
        abi: fighterContract.abi,
        address: fighterContract.address,
        functionName: "getF22RaptorCount",
        args: [nationId],
    });
}
