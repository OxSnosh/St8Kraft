"use client";

import { useEffect, useState } from "react";
import { GetAirBattlesDocument, execute } from "~~/.graphclient";

const AirBattleTable = () => {
  const [airBattleData, setAirBattleData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetAirBattlesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetAirBattlesDocument, {});
        console.log(result.airBattles);
        setAirBattleData(result);
        console.log(result);
      } catch (err) {
        setError(err);
      } finally {
      }
    };

    fetchData();
  }, []);

  if (error) {
    return null;
  }

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="overflow-x-auto shadow-2xl rounded-xl">
        <table className="table bg-base-100 table-zebra">
          <thead>
            <tr className="rounded-xl">
              <th className="bg-primary">Battle ID</th>
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Attacker Fighter Losses</th>
              <th className="bg-primary">Attacker Bomber Losses</th>
              <th className="bg-primary">Defender Fighter Losses</th>
              <th className="bg-primary">Infrastructure Damage</th>
              <th className="bg-primary">Tank Damage</th>
              <th className="bg-primary">Cruise Missile Damage</th>
            </tr>
          </thead>
          <tbody>
            {airBattleData?.airBattles?.map((airBattle: any, index: number) => (
                <tr key={airBattle.battleId}>
                <th>{airBattle.attackerId}</th>
                <th>{airBattle.defenderId}</th>
                <th>{airBattle.attackerFighterLosses}</th>
                <th>{airBattle.attackerBomberLosses}</th>
                <th>{airBattle.defenderFighterLosses}</th>
                <th>{airBattle.infrastructureDamage}</th>
                <th>{airBattle.tankDamage}</th>
                <th>{airBattle.cruiseMissileDamage}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AirBattleTable;