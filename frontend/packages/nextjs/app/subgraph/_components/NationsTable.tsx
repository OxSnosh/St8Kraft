"use client";

import { useEffect, useState } from "react";
import { GetNationsDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const NationsTable = () => {
  const [nationsMinted, setNationsData] = useState<any>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetNationsDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetNationsDocument, {});
        console.log(result.nations);
        setNationsData(result);
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
              <th className="bg-primary">Nation ID</th>
              <th className="bg-primary">Owner</th>
              <th className="bg-primary">Nation Name</th>
              <th className="bg-primary">Ruler</th>
            </tr>
          </thead>
          <tbody>
            {nationsMinted?.nations?.map((nation: any, index: number) => (
              <tr key={nation.nationId}>
                <th>{index + 1}</th>
                <td>
                  <Address address={nation.owner} />
                </td>
                <td>{nation.name}</td>
                <td>{nation.ruler}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NationsTable;
