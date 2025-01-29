
export const getNavy = async (
    nationId: string,
    publicClient: any,
    navyContract: any,
    NavyContract2: any
) => {
    if (!publicClient || !navyContract || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(navyContract, "navyContract")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    const navy : { navyCount : any, name : string }[] = [];

    try {
        const navyVessels = [
            { key: "getCorvetteCount", name: "Corvettes" },
            { key: "getLandingShipCount", name: "Landing Ships" },
            { key: "getBattleshipCount", name: "Battleships" },
            { key: "getCruiserCount", name: "Cruisers" },
        ]

        const navyVessels2 = [
            { key: "getFrigateCount", name: "Frigates" },
            { key: "getDestroyerCount", name: "Destroyers" },
            { key: "getSubmarineCount", name: "Submarines" },
            { key: "getAircraftCarrierCount", name: "Aircraft Carriers" },
        ]

        for (const { key, name } of navyVessels) {
            const navyCount = await publicClient.readContract({
                abi: navyContract.abi,
                address: navyContract.address,
                functionName: key,
                args: [nationId],
            });

            if (navyCount > 0) {
                navy.push({ navyCount, name });
            }
        }

        for (const { key, name } of navyVessels2) {
            const navyCount = await publicClient.readContract({
                abi: NavyContract2.abi,
                address: NavyContract2.address,
                functionName: key,
                args: [nationId],
            });

            if (navyCount > 0) {
                navy.push({ navyCount, name });
            }
        }

        return navy;

    } catch (error) {
        console.error("Error getting navy", error);
    }

    
}