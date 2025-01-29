
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