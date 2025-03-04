

export const getImprovements = async (
    nationId: string,
    improvementsContract1: any,
    improvementsContract2: any,
    improvementsContract3: any,
    improvementsContract4: any,
    publicClient: any
) => {
    const improvements: { improvementCount: any; name: string }[] = [];

    if (!publicClient || !improvementsContract1 || !improvementsContract2 || !improvementsContract3 || !improvementsContract4 || !nationId) {
        console.log(publicClient, "publicClient")
        console.log(improvementsContract1, "improvementsContract1")
        console.log(improvementsContract2, "improvementsContract2")
        console.log(improvementsContract3, "improvementsContract3")
        console.log(improvementsContract4, "improvementsContract4")
        console.log(nationId, "nationId")
        console.error("Missing required data: publicClient, improvementsContract1, improvementsContract2, improvementsContract3, improvementsContract4, or nationId.");
        return;
    }

    try {
        const improvementNames1 = [
            { key: "getAirportCount", name: "Airports" },
            { key: "getBankCount", name: "Banks" },
            { key: "getBarracksCount", name: "Barracks" },
            { key: "getBorderFortificationCount", name: "Border Fortifications" },
            { key: "getBorderWallCount", name: "Border Walls" },
            { key: "getBunkerCount", name: "Bunkers" },
            { key: "getCasinoCount", name: "Casinos" },
            { key: "getChurchCount", name: "Churches" },
            { key: "getClinicCount", name: "Clinics" },
            { key: "getDrydockCount", name: "Drydocks" },
            { key: "getFactoryCount", name: "Factories" },
        ]

        for (const { key, name } of improvementNames1) {
            const improvementCount = await publicClient.readContract({
                abi: improvementsContract1.abi,
                address: improvementsContract1.address,
                functionName: key,
                args: [nationId],
            });

            if (improvementCount > 0) {
                improvements.push({ improvementCount, name });
            }
        }

        const improvementNames2 = [
            { key: "getForeignMinistryCount", name: "Foreign Ministries" },
            { key: "getForwardOperatingBaseCount", name: "Forward Operating Bases" },
            { key: "getGuerillaCampCount", name: "Guerilla Camps" },
            { key: "getHarborCount", name: "Harbors" },
            { key: "getHospitalCount", name: "Hospitals" },
            { key: "getIntelAgencyCount", name: "Intel Agencies" },
            { key: "getJailCount", name: "Jails" },
            { key: "getLaborCampCount", name: "Labor Camps" },
        ]

        for (const { key, name } of improvementNames2) {
            const improvementCount = await publicClient.readContract({
                abi: improvementsContract2.abi,
                address: improvementsContract2.address,
                functionName: key,
                args: [nationId],
            });

            if (improvementCount > 0) {
                improvements.push({ improvementCount, name });
            }
        }

        const improvements3 = [
            { key: "getPrisonCount", name: "Prisons"},
            { key: "getRadiationContainmentChamberCount", name: "Radiation Containment Chambers" },
            { key: "getRedLightDistrictCount", name: "Red Light Districts"},
            { key: "getRehabilitationFacilityCount", name: "Rehabilitation Facilities"},
            { key: "getSatelliteCount", name: "Satellites" },
            { key: "getSchoolCount", name: "Schools" },
            { key: "getShipyardCount", name: "Shipyards" },
            { key: "getStadiumCount", name: "Stadiums" },
            { key: "getUniversityCount", name: "Universities" },
        ]

        for (const { key, name } of improvements3) {
            const improvementCount = await publicClient.readContract({
                abi: improvementsContract3.abi,
                address: improvementsContract3.address,
                functionName: key,
                args: [nationId],
            });

            if (improvementCount > 0) {
                improvements.push({ improvementCount, name });
            }
        }

        const improvements4 = [
            { key: "getMissileDefenseCount", name: "Missile Defense Systems" },
            { key: "getMunitionsFactoryCount", name: "Munitions Factories" },
            { key: "getNavalAcademyCount", name: "Naval Academies" },
            { key: "getNavalConstructionYardCount", name: "Naval Construction Yards" },
            { key: "getOfficeOfPropagandaCount", name : "Offices of Propaganda" },
            { key: "getPoliceHeadquartersCount", name: "Police Headquarters" },
        ]

        for (const { key, name } of improvements4) {
            const improvementCount = await publicClient.readContract({
                abi: improvementsContract4.abi,
                address: improvementsContract4.address,
                functionName: key,
                args: [nationId],
            });

            if (improvementCount > 0) {
                improvements.push({ improvementCount, name });
            }
        }

        return improvements;

    } catch (error) {
        console.error("Error fetching improvements:", error);
        return [];
    }
}

export const buyImprovement = async (
    nationId: string,
    improvementKey: string,
    amount: number,
    publicClient: any,
    improvementContract1: any,
    improvementContract2: any,
    improvementContract3: any,
    improvementContract4: any,
    writeContractAsync: any
) => {
    if (!publicClient || !improvementContract1 || !improvementContract2 || !improvementContract3 || !improvementContract4 || !nationId) {
        console.error("Missing required data: publicClient, improvementContract1, improvementContract2, improvementContract3, improvementContract4, or nationId.");
        return;
    }

    console.log(improvementKey, "improvementKey")
    console.log(amount, "amount")
    
    try {
        if (improvementKey === "buyAirport") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 1]
            });
        } else if (improvementKey === "buyBank") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 2]
            })
        } else if (improvementKey === "buyBarracks") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 3]
            });
        } else if (improvementKey === "buyBorderFortification") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 4]
            });
        } else if (improvementKey === "buyBorderWall") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 5]
            });
        } else if (improvementKey === "buyBunker") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 6]
            });
        } else if (improvementKey === "buyCasino") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 7]
            });
        } else if (improvementKey === "buyChurch") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 8]
            });
        } else if (improvementKey === "buyClinic") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 9]
            });
        } else if (improvementKey === "buyDrydock") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 10]
            });
        } else if (improvementKey === "buyFactory") {
            await writeContractAsync({
                abi: improvementContract1.abi,
                address: improvementContract1.address,
                functionName: "buyImprovement1",
                args: [amount, nationId, 11]
            });
        } else if (improvementKey === "buyForeignMinistry") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 1]
            });
        } else if (improvementKey === "buyForwardOperatingBase") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 2]
            });
        } else if (improvementKey === "buyGuerillaCamp") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 3]
            });
        } else if (improvementKey === "buyHarbor") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 4]
            });
        } else if (improvementKey === "buyHospital") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 5]
            });
        } else if (improvementKey === "buyIntelAgency") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 6]
            });
        } else if (improvementKey === "buyJail") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 7]
            });
        } else if (improvementKey === "buyLaborCamp") {
            await writeContractAsync({
                abi: improvementContract2.abi,
                address: improvementContract2.address,
                functionName: "buyImprovement2",
                args: [amount, nationId, 8]
            });
        } else if (improvementKey === "buyPrison") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 1]
            });
        } else if (improvementKey === "buyRadiationContainmentChamber") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 2]
            });
        } else if (improvementKey === "buyRedLightDistrict") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 3]
            });
        } else if (improvementKey === "buyRehabilitationFacility") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 4]
            });
        } else if (improvementKey === "buySatellite") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 5]
            });
        } else if (improvementKey === "buySchool") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 6]
            });
        } else if (improvementKey === "buyShipyard") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 7]
            });
        } else if (improvementKey === "buyStadium") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 8]
            });
        } else if (improvementKey === "buyUniversity") {
            await writeContractAsync({
                abi: improvementContract3.abi,
                address: improvementContract3.address,
                functionName: "buyImprovement3",
                args: [amount, nationId, 9]
            });
        } else if (improvementKey === "buyMissileDefense") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 1]
            });
        } else if (improvementKey === "buyMunitionsFactory") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 2]
            });
        } else if (improvementKey === "buyNavalAcademy") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 3]
            });
        } else if (improvementKey === "buyNavalConstructionYard") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 4]
            });
        } else if (improvementKey === "buyOfficeOfPropaganda") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 5]
            });
        } else if (improvementKey === "buyPoliceHeadquarters") {
            await writeContractAsync({
                abi: improvementContract4.abi,
                address: improvementContract4.address,
                functionName: "buyImprovement4",
                args: [amount, nationId, 6]
            });
        } else {
            console.error("Improvement key not recognized.");
        }
    } catch (error) {
        console.error("Error buying improvement:", error);
    }
}

export const deleteImprovement = async (
    nationId: string,
    improvementKey: string,
    amount: number,
    publicClient: any,
    improvementContract1: any,
    improvementContract2: any,
    improvementContract3: any,
    improvementContract4: any,
    writeContractAsync: any
) => {
    if (!publicClient || !improvementContract1 || !improvementContract2 || !improvementContract3 || !improvementContract4 || !nationId) {
        console.error("Missing required data: publicClient, improvementContract1, improvementContract2, improvementContract3, improvementContract4, or nationId.");
        return;
    }

    console.log(improvementKey, "improvementKey");
    console.log(amount, "amount");
    
    try {
        const improvementMapping: { [key: string]: { contract: any; functionName: string; id: number } } = {
            "deleteAirport": { contract: improvementContract1, functionName: "deleteImprovement1", id: 1 },
            "deleteBank": { contract: improvementContract1, functionName: "deleteImprovement1", id: 2 },
            "deleteBarracks": { contract: improvementContract1, functionName: "deleteImprovement1", id: 3 },
            "deleteBorderFortification": { contract: improvementContract1, functionName: "deleteImprovement1", id: 4 },
            "deleteBorderWall": { contract: improvementContract1, functionName: "deleteImprovement1", id: 5 },
            "deleteBunker": { contract: improvementContract1, functionName: "deleteImprovement1", id: 6 },
            "deleteCasino": { contract: improvementContract1, functionName: "deleteImprovement1", id: 7 },
            "deleteChurch": { contract: improvementContract1, functionName: "deleteImprovement1", id: 8 },
            "deleteClinic": { contract: improvementContract1, functionName: "deleteImprovement1", id: 9 },
            "deleteDrydock": { contract: improvementContract1, functionName: "deleteImprovement1", id: 10 },
            "deleteFactory": { contract: improvementContract1, functionName: "deleteImprovement1", id: 11 },

            "deleteForeignMinistry": { contract: improvementContract2, functionName: "deleteImprovement2", id: 1 },
            "deleteForwardOperatingBase": { contract: improvementContract2, functionName: "deleteImprovement2", id: 2 },
            "deleteGuerillaCamp": { contract: improvementContract2, functionName: "deleteImprovement2", id: 3 },
            "deleteHarbor": { contract: improvementContract2, functionName: "deleteImprovement2", id: 4 },
            "deleteHospital": { contract: improvementContract2, functionName: "deleteImprovement2", id: 5 },
            "deleteIntelAgency": { contract: improvementContract2, functionName: "deleteImprovement2", id: 6 },
            "deleteJail": { contract: improvementContract2, functionName: "deleteImprovement2", id: 7 },
            "deleteLaborCamp": { contract: improvementContract2, functionName: "deleteImprovement2", id: 8 },

            "deletePrison": { contract: improvementContract3, functionName: "deleteImprovement3", id: 1 },
            "deleteRadiationContainmentChamber": { contract: improvementContract3, functionName: "deleteImprovement3", id: 2 },
            "deleteRedLightDistrict": { contract: improvementContract3, functionName: "deleteImprovement3", id: 3 },
            "deleteRehabilitationFacility": { contract: improvementContract3, functionName: "deleteImprovement3", id: 4 },
            "deleteSatellite": { contract: improvementContract3, functionName: "deleteImprovement3", id: 5 },
            "deleteSchool": { contract: improvementContract3, functionName: "deleteImprovement3", id: 6 },
            "deleteShipyard": { contract: improvementContract3, functionName: "deleteImprovement3", id: 7 },
            "deleteStadium": { contract: improvementContract3, functionName: "deleteImprovement3", id: 8 },
            "deleteUniversity": { contract: improvementContract3, functionName: "deleteImprovement3", id: 9 },

            "deleteMissileDefense": { contract: improvementContract4, functionName: "deleteImprovement4", id: 1 },
            "deleteMunitionsFactory": { contract: improvementContract4, functionName: "deleteImprovement4", id: 2 },
            "deleteNavalAcademy": { contract: improvementContract4, functionName: "deleteImprovement4", id: 3 },
            "deleteNavalConstructionYard": { contract: improvementContract4, functionName: "deleteImprovement4", id: 4 },
            "deleteOfficeOfPropaganda": { contract: improvementContract4, functionName: "deleteImprovement4", id: 5 },
            "deletePoliceHeadquarters": { contract: improvementContract4, functionName: "deleteImprovement4", id: 6 },
        };

        if (!(improvementKey in improvementMapping)) {
            console.error("Improvement key not recognized.");
            return;
        }

        const { contract, functionName, id } = improvementMapping[improvementKey];

        await writeContractAsync({
            abi: contract.abi,
            address: contract.address,
            functionName,
            args: [amount, nationId, id]
        });

        console.log(`Successfully deleted ${amount} of ${improvementKey}.`);
    } catch (error) {
        console.error("Error deleting improvement:", error);
    }
};
