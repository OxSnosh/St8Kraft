"use client";

import { useEffect, useState } from "react";
import { GetGroundBattlesDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const GroundBattleTable = () => {
  const [groundBattles, setGroundBattlesData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetGroundBattlesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetGroundBattlesDocument, {});
        console.log(result.groundBattles);
        setGroundBattlesData(result);
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
              <th className="bg-primary">War ID</th>
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Attacker Soldier Losses</th>
              <th className="bg-primary">Attacker Tank Losses</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Defender Soldier Losses</th>
              <th className="bg-primary">Defender Tank Losses</th>
            </tr>
          </thead>
          <tbody>
            {groundBattles?.groundBattles?.map((groundBattle: any, index: number) => (
              <tr key={groundBattle.groundBattleId}>
                <th>{groundBattle.warId}</th>
                <th>{groundBattle.attackerId}</th>
                <th>{groundBattle.attackerSoldierLosses}</th>
                <th>{groundBattle.attackerTankLosses}</th>
                <th>{groundBattle.defender}</th>
                <th>{groundBattle.defenderSoldierLosses}</th>
                <th>{groundBattle.defenderTankLosses}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GroundBattleTable;