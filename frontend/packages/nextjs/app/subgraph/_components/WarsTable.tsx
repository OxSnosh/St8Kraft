"use client";

import { useEffect, useState } from "react";
import { GetWarsDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const WarsTable = () => {
  const [wars, setWarData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetWarsDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetWarsDocument, {});
        console.log(result.wars);
        setWarData(result);
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
              <th className="bg-primary">Offense</th>
              <th className="bg-primary">Defense</th>
            </tr>
          </thead>
          <tbody>
            {wars?.wars?.map((war: any, index: number) => (
              <tr key={war.warId}>
                <th>{war.warId}</th>
                <td>{war.offenseId}</td>
                <td>{war.defenseId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarsTable;
