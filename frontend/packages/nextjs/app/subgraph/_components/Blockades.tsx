"use client";

import { useEffect, useState } from "react";
import { GetBlockadesDocument, execute } from "~~/.graphclient";

const BlockadeTable = () => {
  const [blockadeData, setBlockadeData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetBlockadesDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetBlockadesDocument, {});
        console.log(result.navalAttacks);
        setBlockadeData(result);
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
            {blockadeData?.blockades?.map((blockade: any, index: number) => (
                <tr key={blockade.battleId}>
                <th>{blockade.battleId}</th>
                <th>{blockade.attackerLosses}</th>
                <th>{blockade.defenderLosses}</th>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BlockadeTable;