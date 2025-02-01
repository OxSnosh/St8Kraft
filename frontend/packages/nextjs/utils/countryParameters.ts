
export const setRulerName = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    rulerName: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !rulerName) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(rulerName, "rulerName")
        console.error("Missing required data: publicClient, nationContract, nationId, or rulerName.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setRulerName",
        args: [rulerName, nationId],
    });
}

export const setNationName = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    nationName: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !nationName) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(nationName, "nationName")
        console.error("Missing required data: publicClient, nationContract, nationId, or nationName.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setNationName",
        args: [nationName, nationId],
    });
}

export const setCapitalCity = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    capitalCity: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !capitalCity) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(capitalCity, "capitalCity")
        console.error("Missing required data: publicClient, nationContract, nationId, or capitalCity.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setCapitalCity",
        args: [capitalCity, nationId],
    });
}

export const setNationSlogan = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    nationSlogan: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !nationSlogan) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(nationSlogan, "nationSlogan")
        console.error("Missing required data: publicClient, nationContract, nationId, or nationSlogan.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setNationSlogan",
        args: [nationSlogan, nationId],
    });
}

export const setAlliance = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    alliance: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !alliance) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(alliance, "alliance")
        console.error("Missing required data: publicClient, nationContract, nationId, or alliance.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setAlliance",
        args: [alliance, nationId],
    });
}

export const setTeam = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    team: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !team) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(team, "team")
        console.error("Missing required data: publicClient, nationContract, nationId, or team.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setTeam",
        args: [nationId, team],
    });
}

export const setGovernment = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    government: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !government) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(government, "government")
        console.error("Missing required data: publicClient, nationContract, nationId, or government.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setGovernment",
        args: [nationId, government],
    });
}

export const setReligion = async (
    nationId: string,
    publicClient: any,
    parametersContract: any,
    religion: string,
    writeContractAsync: (args: any) => Promise<any>
) => {
    if (!publicClient || !parametersContract || !nationId || !religion) {
        console.log(publicClient, "publicClient")
        console.log(parametersContract, "nationContract")
        console.log(nationId, "nationId")
        console.log(religion, "religion")
        console.error("Missing required data: publicClient, nationContract, nationId, or religion.");
        return;
    }

    return await writeContractAsync({
        abi: parametersContract.abi,
        address: parametersContract.address,
        functionName: "setReligion",
        args: [nationId, religion],
    });
}



