"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import CollectTaxes from "./CollectTaxes";
import GovernmentDetails from "./GovernmentDetails";
import NationDetailsPage from "./NationDetailsPage";
import MilitarySettings from "./MilitarySettings";
import PayBills from "./PayBills";
import DepositWithdraw from "./DepositWithdraw";
import BuyInfrastructure from "./BuyInfrastructure";
import BuyLand from "./BuyLand";
import { useAccount, usePublicClient } from "wagmi";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import BuyTechnology from "./BuyTechnology";

const menuItems = [
  { category: "NATION SETTINGS", options: ["Government Settings", "Military Settings"] },
  { category: "TREASURY", options: ["Collect Taxes", "Pay Bills", "Deposit and Withdraw"] },
  { category: "MUNICIPAL PURCHASES", options: ["Infrastructure", "Technology", "Land"] },
  { category: "NATION UPGRADES", options: ["Improvements", "Wonders"] },
  {
    category: "TRAIN MILITARY",
    options: ["Soldiers", "Tanks", "Fighters", "Bombers", "Navy", "Cruise Missiles", "Nukes", "Spies"],
  },
];

const Nation = () => {
  const searchParams = useSearchParams();
  const publicClient = usePublicClient();
  const contractsData = useAllContracts();
  const { address: walletAddress } = useAccount();
  const countryMinterContract = contractsData?.CountryMinter;

  const [selectedComponent, setSelectedComponent] = useState<JSX.Element | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<string | null>(null);
  const [mintedNations, setMintedNations] = useState<{ name: string; href: string }[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown state

  const nationId = searchParams.get("id");

  // Fetch user's nations from contract
  useEffect(() => {
    const fetchMyNations = async () => {
      if (!publicClient || !countryMinterContract) return;
      try {
        if (!walletAddress) return;

        const tokenIds = await publicClient.readContract({
          abi: countryMinterContract.abi,
          address: countryMinterContract.address,
          functionName: "tokensOfOwner",
          args: [walletAddress],
        });

        if (!Array.isArray(tokenIds) || tokenIds.length === 0) {
          console.warn("No tokens found for this wallet.");
          setMintedNations([]);
          return;
        }

        // Map token IDs to nation data with query parameter links
        const nations = tokenIds.map((tokenId: string) => ({
          name: `Nation ${tokenId}`, // Replace with actual nation name if available
          href: `/nations?id=${tokenId}`, // Dynamic link to the nation's page using query parameters
        }));

        setMintedNations(nations);
      } catch (error) {
        console.error("Error fetching minted nations:", error);
        setMintedNations([]);
      }
    };

    fetchMyNations();
  }, [walletAddress, countryMinterContract, publicClient]);

  // Load last selected menu item from localStorage when the page loads
  useEffect(() => {
    const savedMenuItem = localStorage.getItem("selectedMenuItem");
    if (savedMenuItem) {
      setSelectedMenuItem(savedMenuItem);

      // Set the corresponding component based on the saved menu item
      if (savedMenuItem === "Collect Taxes") {
        setSelectedComponent(<CollectTaxes />);
      } else if (savedMenuItem.startsWith("Nation")) {
        const nationIdFromStorage = savedMenuItem.split(" ")[1]; // Extract ID
        setSelectedComponent(<NationDetailsPage nationId={nationIdFromStorage} />);
      } else if (savedMenuItem === "Government Settings") {
        setSelectedComponent(<GovernmentDetails />);
      } else if (savedMenuItem === "Military Settings") {
        setSelectedComponent(<MilitarySettings />);
      } else if (savedMenuItem === "Pay Bills") {
        setSelectedComponent(<PayBills />);
      } else if (savedMenuItem === "Deposit and Withdraw") {
        setSelectedComponent(<DepositWithdraw />);
      } else if (savedMenuItem === "Infrastructure") {
        setSelectedComponent(<BuyInfrastructure />);
      } else if (savedMenuItem === "Technology") {
        setSelectedComponent(<BuyTechnology />);
      } else if (savedMenuItem === "Land") {
        setSelectedComponent(<BuyLand />);
      } else {
        setSelectedComponent(<div className="p-6">Coming Soon...</div>);
      }
    } else if (nationId) {
      // If there is a nation ID, default to loading that nation's details
      setSelectedMenuItem(`Nation ${nationId}`);
      setSelectedComponent(<NationDetailsPage nationId={nationId} />);
    }
  }, [nationId]);

  // Handle menu clicks and save the selection in localStorage
  const handleMenuClick = (option: string) => {
    setSelectedMenuItem(option);
    localStorage.setItem("selectedMenuItem", option); // Save selected menu item
  
    if (option === "Collect Taxes") {
      setSelectedComponent(<CollectTaxes />);
    } else if (option === "Government Settings") {
      setSelectedComponent(<GovernmentDetails />);
    } else if (option === "Military Settings") {
      setSelectedComponent(<MilitarySettings />);
    } else if (option === "Pay Bills") {
      setSelectedComponent(<PayBills />);
    } else if (option === "Deposit and Withdraw") {
      setSelectedComponent(<DepositWithdraw />);
    } else if (option === "Infrastructure") {
      setSelectedComponent(<BuyInfrastructure />);
    } else if (option === "Technology") {
      setSelectedComponent(<BuyTechnology />);
    } else if (option === "Land") {
      setSelectedComponent(<BuyLand />);
    } else {
      setSelectedComponent(<div className="p-6">Coming Soon...</div>);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar - Left 15% */}
      <div className="w-1/6 bg-gray-800 text-white p-4">
        <h2 className="text-lg font-bold mb-4">Menu</h2>

        {/* My Nations Dropdown */}
        {walletAddress && mintedNations.length > 0 && (
          <div className="relative">
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown
            >
              My Nations
            </button>

            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 p-2 shadow bg-base-100 rounded-box w-52">
                {mintedNations.map(nation => (
                  <li
                    key={nation.href}
                    onClick={() => {
                      setSelectedMenuItem(nation.name);
                      localStorage.setItem("selectedMenuItem", nation.name); // Save nation selection
                      setSelectedComponent(<NationDetailsPage nationId={nation.href.split("=")[1]} />);
                      setIsDropdownOpen(false); // Close dropdown on selection
                    }}
                  >
                    <Link href={nation.href}>
                      <span>{nation.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Other Menu Items */}
        {menuItems.map(section => (
          <div key={section.category} className="mt-4">
            <h3 className="font-semibold">{section.category}</h3>
            <ul className="pl-2 mt-2">
              {section.options.map(option => (
                <li
                  key={option}
                  className={`cursor-pointer py-1 hover:text-yellow-400 ${
                    selectedMenuItem === option ? "text-yellow-400" : ""
                  }`}
                  onClick={() => handleMenuClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Main Content - Right 85% */}
      <div className="w-5/6 p-1">{selectedComponent}</div>
    </div>
  );
};

export default Nation;
