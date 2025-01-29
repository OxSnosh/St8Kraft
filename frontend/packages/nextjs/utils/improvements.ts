

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
            { key: "getBarracksCount", name: "Barracks" },
            { key: "getBorderFortificationCount", name: "Border Fortifications" },
            { key: "getBorderWallCount", name: "Border Walls" },
            { key: "getBankCount", name: "Banks" },
            { key: "getBunkerCount", name: "Bunkers" },
            { key: "getCasinoCount", name: "Casinos" },
            { key: "getChurchCount", name: "Churches" },
            { key: "getDrydockCount", name: "Drydocks" },
            { key: "getClinicCount", name: "Clinics" },
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