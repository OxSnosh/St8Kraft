import { useState } from "react";
import { deleteNation, transferNation } from "~~/utils/deleteTransfer";
import { Loader2 } from "lucide-react";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useWriteContract } from "wagmi";

const TransferDeleteNation = () => {
    const contractsData = useAllContracts();
    const { writeContractAsync } = useWriteContract();
    const countryMinter = contractsData?.CountryMinter;

    const [nationId, setNationId] = useState<string>("");
    const [newOwner, setNewOwner] = useState<string>("");
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [loadingTransfer, setLoadingTransfer] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleDeleteNation = async () => {
        if (!nationId) {
            setMessage("⚠️ Please enter a Nation ID.");
            return;
        }

        setLoadingDelete(true);
        setMessage("⏳ Deleting nation...");
        
        const tx = await deleteNation(nationId, writeContractAsync, countryMinter);
        
        if (tx) {
            setMessage(`✅ Nation ${nationId} deleted! Tx: ${tx.hash}`);
        } else {
            setMessage("❌ Failed to delete nation.");
        }

        setLoadingDelete(false);
    };

    const handleTransferNation = async () => {
        if (!nationId || !newOwner) {
            setMessage("⚠️ Enter both Nation ID and recipient address.");
            return;
        }

        setLoadingTransfer(true);
        setMessage("⏳ Transferring nation...");
        
        const tx = await transferNation(nationId, newOwner, writeContractAsync, countryMinter);
        
        if (tx) {
            setMessage(`✅ Nation ${nationId} transferred to ${newOwner}! Tx: ${tx.hash}`);
        } else {
            setMessage("❌ Transfer failed.");
        }

        setLoadingTransfer(false);
    };

    return (
        <div className="font-special bg-aged-paper text-base-content p-6 rounded-lg shadow-center w-full max-w-md mx-auto border border-neutral">
            <h2 className="text-2xl font-bold text-primary-content text-center mb-4">Manage Your Nation</h2>

            {/* DELETE NATION SECTION */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md mb-6">
                <h3 className="text-lg font-semibold text-error mb-2 text-center">Delete Nation</h3>
                <label className="block mb-2">
                    <span className="text-primary-content">Nation ID:</span>
                    <input 
                        type="text"
                        value={nationId}
                        onChange={(e) => setNationId(e.target.value)}
                        className="input input-bordered w-full mt-1 bg-base-100 text-base-content"
                        placeholder="Enter Nation ID"
                    />
                </label>

                <button 
                    onClick={handleDeleteNation}
                    disabled={loadingDelete}
                    className="btn btn-error w-full flex justify-center items-center mt-2 disabled:opacity-50"
                >
                    {loadingDelete ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Delete Nation"}
                </button>
            </div>

            {/* TRANSFER NATION SECTION */}
            <div className="p-4 bg-base-200 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-primary mb-2 text-center">Transfer Nation</h3>
                <label className="block mb-2">
                    <span className="text-primary-content">Nation ID:</span>
                    <input 
                        type="text"
                        value={nationId}
                        onChange={(e) => setNationId(e.target.value)}
                        className="input input-bordered w-full mt-1 bg-base-100 text-base-content"
                        placeholder="Enter Nation ID"
                    />
                </label>

                <label className="block mb-4">
                    <span className="text-primary-content">New Owner Address:</span>
                    <input 
                        type="text"
                        value={newOwner}
                        onChange={(e) => setNewOwner(e.target.value)}
                        className="input input-bordered w-full mt-1 bg-base-100 text-base-content"
                        placeholder="Enter recipient address"
                    />
                </label>

                <button 
                    onClick={handleTransferNation}
                    disabled={loadingTransfer}
                    className="btn btn-primary w-full flex justify-center items-center mt-2 disabled:opacity-50"
                >
                    {loadingTransfer ? <Loader2 className="animate-spin w-5 h-5 mr-2" /> : "Transfer Nation"}
                </button>
            </div>

            {/* STATUS MESSAGE */}
            {message && (
                <p className="mt-4 text-center text-sm text-secondary-content bg-secondary p-2 rounded-lg">
                    {message}
                </p>
            )}
        </div>
    );
};

export default TransferDeleteNation;
