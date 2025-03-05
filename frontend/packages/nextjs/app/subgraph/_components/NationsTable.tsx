"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import Next.js router
import { GetNationsDocument, execute } from "~~/.graphclient";
import { Address } from "~~/components/scaffold-eth";

const NationsTable = () => {
  const [nationsMinted, setNationsData] = useState<any>(null);
  const [error, setError] = useState<any>(null);
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    const fetchData = async () => {
      if (!execute || !GetNationsDocument) {
        return;
      }
      try {
        const { data: result } = await execute(GetNationsDocument, {});
        setNationsData(result);
      } catch (err) {
        setError(err);
      }
    };

    fetchData();
  }, []);

  if (error) {
    return <div className="text-red-500 text-center mt-5">Failed to load nations.</div>;
  }

  return (
    <div className="font-special flex justify-center items-center">
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
            {nationsMinted?.nations?.slice(0, 5).map((nation: any, index: number) => (
                <tr
                key={nation.nationId}
                onClick={() => {
                  localStorage.setItem("selectedMenuItem", `Nation ${nation.nationId}`);
                  router.push(`/nations?id=${nation.nationId}`);
                }}
                className="cursor-pointer group transition duration-200"
              >
                <th className="group-hover:bg-gray-400">{nation.nationId}</th>
                <td className="group-hover:bg-gray-400">
                  <Address address={nation.owner} />
                </td>
                <td className="group-hover:bg-gray-400">{nation.name}</td>
                <td className="group-hover:bg-gray-400">{nation.ruler}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NationsTable;
