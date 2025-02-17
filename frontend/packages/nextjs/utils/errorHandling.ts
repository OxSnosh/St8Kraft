import { AbiCoder } from "ethers/lib/utils";

export function parseRevertReason(error: any): string {
    if (error?.data) {
        try {
            if (error.data.startsWith("0x08c379a0")) {
                const decoded = new AbiCoder().decode(
                    ["string"],
                    "0x" + error.data.slice(10)
                );
                return decoded[0]; // Extract revert message
            }
        } catch (decodeError) {
            return "Unknown revert reason";
        }
    }
    return error?.message || "Transaction failed";
}