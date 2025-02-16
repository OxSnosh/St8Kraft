"use client";

import { useEffect, useState } from "react";
import { GetBreakBlockadesDocument, execute } from "~~/.graphclient";

const BreakBlockadeTable = () => {
  const [breakBlockadeData, setBreakBlockadeData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetBreakBlockadesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetBreakBlockadesDocument, {});
        console.log(result.navalAttacks);
        setBreakBlockadeData(result);
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
            {breakBlockadeData?.breakBlockades?.map((breakBlockade: any, index: number) => (
                <tr key={breakBlockade.battleId}>
                <th>{breakBlockade.battleId}</th>
                <th>{breakBlockade.attackerLosses}</th>
                <th>{breakBlockade.defenderLosses}</th>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BreakBlockadeTable;