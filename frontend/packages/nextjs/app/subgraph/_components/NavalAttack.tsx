"use client";

import { useEffect, useState } from "react";
import { GetNavalAttacksDocument, execute } from "~~/.graphclient";

const NavalAttackTable = () => {
  const [navalBattleData, setAirBattleData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetNavalAttacksDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetNavalAttacksDocument, {});
        console.log(result.navalAttacks);
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
              <th className="bg-primary">Attacker Losses</th>
              <th className="bg-primary">Defender Losses</th>
            </tr>
          </thead>
          <tbody>
            {navalBattleData?.navalAttacks?.map((navalAttack: any, index: number) => (
                <tr key={navalAttack.battleId}>
                <th>{navalAttack.battleId}</th>
                <th>{navalAttack.attackerLosses}</th>
                <th>{navalAttack.defenderLosses}</th>
   
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NavalAttackTable;