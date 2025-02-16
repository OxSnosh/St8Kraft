"use client";

import { useEffect, useState } from "react";
import { GetNukeAttacksDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const NukeAttackTable = () => {
  const [nukeAttacks, setNukeAttackData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetNukeAttacksDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetNukeAttacksDocument, {});
        console.log(result.cruiseMissileAttacks);
        setNukeAttackData(result);
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
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Landed</th>
            </tr>
          </thead>
          <tbody>
            {nukeAttacks?.nukeAttacks?.map((nukeAttack: any, index: number) => (
                <tr key={nukeAttack.attackId}>
                <th>{nukeAttack.warId}</th>
                <th>{nukeAttack.attackerId}</th>
                <th>{nukeAttack.defenderId}</th>
                <th>{nukeAttack.landed}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NukeAttackTable;