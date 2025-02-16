"use client";

import { useEffect, useState } from "react";
import { GetSpyOperationsDocument, execute } from "~~/.graphclient";
import { SpyOperation } from '../../../../subgraph/generated/schema';

const SpyOperationsTable = () => {
  const [spyAttacks, setSpyAttackData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetSpyOperationsDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetSpyOperationsDocument, {});
        console.log(result.SpyOperations);
        setSpyAttackData(result);
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
              <th className="bg-primary">Attacker ID</th>
              <th className="bg-primary">Defender ID</th>
              <th className="bg-primary">Success</th>
              <th className="bg-primary">Attack Type</th>
            </tr>
          </thead>
          <tbody>
            {spyAttacks?.spyAttacks?.map((spyAttack: any, index: number) => (
                <tr key={spyAttack.attackId}>
                <th>{spyAttack.attackerId}</th>
                <th>{spyAttack.defenderId}</th>
                <th>{spyAttack.success}</th>
                <th>{spyAttack.attackType}</th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SpyOperationsTable;