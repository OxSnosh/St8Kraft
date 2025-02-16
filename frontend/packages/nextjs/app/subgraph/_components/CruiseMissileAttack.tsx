"use client";

import { useEffect, useState } from "react";
import { GetCruiseMissileAttacksDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const CruiseMissileAttackTable = () => {
  const [cruiseMissileAttacks, setCruiseMissileAttackData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetCruiseMissileAttacksDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetCruiseMissileAttacksDocument, {});
        console.log(result.cruiseMissileAttacks);
        setCruiseMissileAttackData(result);
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
              <th className="bg-primary">Damage</th>
            </tr>
          </thead>
          <tbody>
            {cruiseMissileAttacks?.cruiseMissileAttacks?.map((cruiseMissileAttack: any, index: number) => (
                <tr key={cruiseMissileAttack.attackId}>
                <th>{cruiseMissileAttack.warId}</th>
                <th>{cruiseMissileAttack.attackerId}</th>
                <th>{cruiseMissileAttack.defenderId}</th>
                <th>{cruiseMissileAttack.landed}</th>
                <th>{cruiseMissileAttack.damageTypeNumber}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CruiseMissileAttackTable;