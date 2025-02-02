
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

export const getCorvetteCount = async (
    nationId: string,
    publicClient: any,
    navyContract: any
) => {
    if (!publicClient || !navyContract || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const corvetteCount = await publicClient.readContract({
            abi: navyContract.abi,
            address: navyContract.address,
            functionName: "getCorvetteCount",
            args: [nationId],
        });

        return corvetteCount;
    } catch (error) {
        console.error("Error fetching corvette count:", error);
    }
}

export const getLandingShipCount = async (
    nationId: string,
    publicClient: any,
    navyContract: any
) => {
    if (!publicClient || !navyContract || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const landingShipCount = await publicClient.readContract({
            abi: navyContract.abi,
            address: navyContract.address,
            functionName: "getLandingShipCount",
            args: [nationId],
        });

        return landingShipCount;
    } catch (error) {
        console.error("Error fetching landing ship count:", error);
    }
}

export const getBattleshipCount = async (
    nationId: string,
    publicClient: any,
    navyContract: any
) => {
    if (!publicClient || !navyContract || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const battleshipCount = await publicClient.readContract({
            abi: navyContract.abi,
            address: navyContract.address,
            functionName: "getBattleshipCount",
            args: [nationId],
        });

        return battleshipCount;
    } catch (error) {
        console.error("Error fetching battleship count:", error);
    }
}

export const getCruiserCount = async (
    nationId: string,
    publicClient: any,
    navyContract: any
) => {
    if (!publicClient || !navyContract || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const cruiserCount = await publicClient.readContract({
            abi: navyContract.abi,
            address: navyContract.address,
            functionName: "getCruiserCount",
            args: [nationId],
        });

        return cruiserCount;
    } catch (error) {
        console.error("Error fetching cruiser count:", error);
    }
}   

export const getFrigateCount = async (
    nationId: string,
    publicClient: any,
    NavyContract2: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const frigateCount = await publicClient.readContract({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "getFrigateCount",
            args: [nationId],
        });

        return frigateCount;
    } catch (error) {
        console.error("Error fetching frigate count:", error);
    }
}

export const getDestroyerCount = async (
    nationId: string,
    publicClient: any,
    NavyContract2: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const destroyerCount = await publicClient.readContract({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "getDestroyerCount",
            args: [nationId],
        });

        return destroyerCount;
    } catch (error) {
        console.error("Error fetching destroyer count:", error);
    }
}


export const getSubmarineCount = async (
    nationId: string,
    publicClient: any,
    NavyContract2: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const submarineCount = await publicClient.readContract({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "getSubmarineCount",
            args: [nationId],
        });

        return submarineCount;
    } catch (error) {
        console.error("Error fetching submarine count:", error);
    }
}

export const getAircraftCarrierCount = async (
    nationId: string,
    publicClient: any,
    NavyContract2: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        const aircraftCarrierCount = await publicClient.readContract({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "getAircraftCarrierCount",
            args: [nationId],
        });

        return aircraftCarrierCount;
    } catch (error) {
        console.error("Error fetching aircraft carrier count:", error);
    }
}

export const buyCorvette = async (
    nationId: string,
    amount: number,
    publicClient: any,
    navyMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !navyMarket1 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(navyMarket1, "navyMarket1")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: navyMarket1.abi,
            address: navyMarket1.address,
            functionName: "buyCorvette",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying corvette:", error);
    }
}

export const buyLandingShip = async (
    nationId: string,
    amount: number,
    publicClient: any,
    navyMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !navyMarket1 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: navyMarket1.abi,
            address: navyMarket1.address,
            functionName: "buyLandingShip",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying landing ship:", error);
    }
}

export const buyBattleship = async (
    nationId: string,
    amount: number,
    publicClient: any,
    navyMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !navyMarket1 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: navyMarket1.abi,
            address: navyMarket1.address,
            functionName: "buyBattleship",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying battleship:", error);
    }
}

export const buyCruiser = async (
    nationId: string,
    amount: number,
    publicClient: any,
    navyMarket1: any,
    writeContractAsync: any
) => {
    if (!publicClient || !navyMarket1 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: navyMarket1.abi,
            address: navyMarket1.address,
            functionName: "buyCruiser",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying cruiser:", error);
    }
}

export const buyFrigate = async (
    nationId: string,
    amount: number,
    publicClient: any,
    NavyContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "buyFrigate",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying frigate:", error);
    }
}

export const buyDestroyer = async (
    nationId: string,
    amount: number,
    publicClient: any,
    NavyContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "buyDestroyer",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying destroyer:", error);
    }
}

export const buySubmarine = async (
    nationId: string,
    amount: number,
    publicClient: any,
    NavyContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "buySubmarine",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying submarine:", error);
    }
}

export const buyAircraftCarrier = async (
    nationId: string,
    amount: number,
    publicClient: any,
    NavyContract2: any,
    writeContractAsync: any
) => {
    if (!publicClient || !NavyContract2 || !nationId) {
        console.error("Missing required data: publicClient, navyContract, or nationId.");
        return;
    }

    try {
        await writeContractAsync({
            abi: NavyContract2.abi,
            address: NavyContract2.address,
            functionName: "buyAircraftCarrier",
            args: [amount, nationId],
        });
    } catch (error) {
        console.error("Error buying aircraft carrier:", error);
    }
}

