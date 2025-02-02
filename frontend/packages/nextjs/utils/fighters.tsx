


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

