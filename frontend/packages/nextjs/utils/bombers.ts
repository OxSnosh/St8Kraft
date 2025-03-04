export const getBombers = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(bomberContract, "bomberContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    const bombers : { bomberCount: any, name: string }[] = []

    try {
        const bomberNames = [
            { key: "getAh1CobraCount", name: "AH-1 Cobras" },
            { key: "getAh64ApacheCount", name: "AH-64 Apaches" },
            { key: "getBristolBlenheimCount", name: "Bristol Blenheims" },
            { key: "getB52MitchellCount", name: "B-52 Mitchells" },
            { key: "getB17gFlyingFortressCount", name: "B-17G Flying Fortresses" },
            { key: "getB52StratofortressCount", name: "B-52 Stratofortresses" },
            { key: "getB2SpiritCount", name: "B-2 Spirits" },
            { key: "getB1bLancerCount", name: "B-1B Lancers" },
            { key: "getTupolevTu160Count", name: "Tupolev Tu-95s" },
        ]

        for (const { key, name } of bomberNames) {
            const bomberCount = await publicClient.readContract({
                abi: bomberContract.abi,
                address: bomberContract.address,
                functionName: key,
                args: [nationId],
            });

            if (bomberCount > 0) {
                bombers.push({ bomberCount, name });
            }
        }

        return bombers;

    } catch (error) {
        console.error("Error getting bombers:", error);
    }

}

export const getAh1CobraCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getAh1CobraCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting AH-1 Cobra count:", error);
    }
}

export const getAh64ApacheCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getAh64ApacheCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting AH-64 Apache count:", error);
    }
}

export const getBristolBlenheimCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getBristolBlenheimCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting Bristol Blenheim count:", error);
    }
}

export const getB52MitchellCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getB52MitchellCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting B-52 Mitchell count:", error);
    }
}

export const getB17gFlyingFortressCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getB17gFlyingFortressCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting B-17G Flying Fortress count:", error);
    }
}

export const getB52StratofortressCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getB52StratofortressCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting B-52 Stratofortress count:", error);
    }
}

export const getB2SpiritCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getB2SpiritCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting B-2 Spirit count:", error);
    }
}

export const getB1bLancerCount = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getB1bLancerCount",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting B-1B Lancer count:", error);
    }
}

export const getTupolevTu160Count = async (
    nationId: string,
    publicClient: any,
    bomberContract: any
) => {
    if (!publicClient || !bomberContract || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        const count = await publicClient.readContract({
            abi: bomberContract.abi,
            address: bomberContract.address,
            functionName: "getTupolevTu160Count",
            args: [nationId],
        });

        return count;
    } catch (error) {
        console.error("Error getting Tupolev Tu-160 count:", error);
    }
}

export const buyAh1Cobra = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "buyAh1Cobra",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying AH-1 Cobra:", error);
    }
}

export const buyAh64Apache = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "buyAh64Apache",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying AH-64 Apache:", error);
    }
}

export const buyBristolBlenheim = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "buyBristolBlenheim",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying Bristol Blenheim:", error);
    }
}

export const buyB52Mitchell = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "buyB52Mitchell",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying B-52 Mitchell:", error);
    }
}

export const buyB17gFlyingFortress = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "buyB17gFlyingFortress",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying B-17G Flying Fortress:", error);
    }
}

export const buyB52Stratofortress = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "buyB52Stratofortress",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying B-52 Stratofortress:", error);
    }
}

export const buyB2Spirit = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "buyB2Spirit",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying B-2 Spirit:", error);
    }
}

export const buyB1bLancer = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "buyB1bLancer",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying B-1B Lancer:", error);
    }
}

export const buyTupolevTu160 = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "buyTupolevTu160",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying Tupolev Tu-160:", error);
    }
}

export const scrapAh1Cobra = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "scrapAh1Cobra",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping AH-1 Cobra:", error);
    }
}

export const scrapAh64Apache = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "scrapAh64Apache",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping AH-64 Apache:", error);
    }
}

export const scrapBristolBlenheim = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "scrapBristolBlenheim",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping Bristol Blenheim:", error);
    }
}

export const scrapB52Mitchell = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "scrapB52Mitchell",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping B-52 Mitchell:", error);
    }
}

export const scrapB17gFlyingFortress = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract1 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract1.abi,
            address: bomberContract1.address,
            functionName: "scrapB17gFlyingFortress",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping B-17G Flying Fortress:", error);
    }
}

export const scrapB52Stratofortress = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "scrapB52Stratofortress",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping B-52 Stratofortress:", error);
    }
}

export const scrapB2Spirit = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "scrapB2Spirit",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping B-2 Spirit:", error);
    }
}

export const scrapB1bLancer = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "scrapB1bLancer",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping B-1B Lancer:", error);
    }
}

export const scrapTupolevTu160 = async (
    nationId: string,
    amount: number,
    publicClient: any,
    bomberContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !bomberContract2 || !nationId) {
        console.error("Missing required data: publicClient, bomberContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: bomberContract2.abi,
            address: bomberContract2.address,
            functionName: "scrapTupolevTu160",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error scrapping Tupolev Tu-160:", error);
    }
}
