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
