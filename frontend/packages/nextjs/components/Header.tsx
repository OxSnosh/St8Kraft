"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, BugAntIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useAccount, usePublicClient } from "wagmi";

type HeaderMenuLink = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

export const menuLinks: HeaderMenuLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Debug Contracts",
    href: "/debug",
    icon: <BugAntIcon className="h-4 w-4" />,
  },
  {
    label: "Mint A Nation",
    href: "/mint",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              className={`${
                isActive ? "bg-secondary shadow-md" : ""
              } hover:bg-secondary hover:shadow-md focus:!bg-secondary active:!text-neutral py-1.5 px-3 text-sm rounded-full gap-2 grid grid-flow-col`}
            >
              {icon}
              <span>{label}</span>
            </Link>
          </li>
        );
      })}
    </>
  );
};

/**
 * Site header
 */
export const Header = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const burgerMenuRef = useRef<HTMLDivElement>(null);
  const [mintedNations, setMintedNations] = useState<{ name: string; href: string }[]>([]);

  // Hooks that need to be inside the component
  const { address: walletAddress } = useAccount();
  const contractsData = useAllContracts();
  const publicClient = usePublicClient();
  const countryMinterContract = contractsData?.CountryMinter;

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  // Fetch minted nations when the wallet connects
  useEffect(() => {
    const fetchMintedNations = async () => {
      if (!walletAddress) {
        console.log("Waiting for walletAddress to be defined.");
        return;
      }
      if (!countryMinterContract || !publicClient) {
        console.error("Missing required data: countryMinterContract or publicClient.");
        return;
      }

      try {
        // Fetch token IDs owned by the wallet
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
        console.error("Error fetching nations:", error);
        setMintedNations([]);
      }
    };

    fetchMintedNations();
  }, [walletAddress, countryMinterContract, publicClient]);

  return (
    <div className="sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
      <div className="navbar-start w-auto lg:w-1/2">
        <div className="lg:hidden dropdown" ref={burgerMenuRef}>
          <label
            tabIndex={0}
            className={`ml-1 btn btn-ghost ${isDrawerOpen ? "hover:bg-secondary" : "hover:bg-transparent"}`}
            onClick={() => {
              setIsDrawerOpen((prevIsOpenState) => !prevIsOpenState);
            }}
          >
            <Bars3Icon className="h-1/2" />
          </label>
          {isDrawerOpen && (
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
              onClick={() => {
                setIsDrawerOpen(false);
              }}
            >
              <HeaderMenuLinks />
            </ul>
          )}
        </div>
        <Link href="/" passHref className="hidden lg:flex items-center gap-2 ml-4 mr-6 shrink-0">
          <div className="flex relative w-10 h-10">
            <Image alt="SE2 logo" className="cursor-pointer" fill src="/logo.svg" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold leading-tight">Scaffold-ETH</span>
            <span className="text-xs">Ethereum dev stack</span>
          </div>
        </Link>
        <ul className="hidden lg:flex lg:flex-nowrap menu menu-horizontal px-1 gap-2">
          <HeaderMenuLinks />
        </ul>
      </div>
      <div className="navbar-end flex-grow mr-4">
        {/* Render "My Nations" button only when a wallet is connected and there are minted nations */}
        {walletAddress && mintedNations.length > 0 && (
          <div className="relative dropdown">
            <button className="btn btn-primary btn-sm">My Nations</button>
            <ul className="dropdown-content menu mt-3 p-2 shadow bg-base-100 rounded-box w-52">
              {mintedNations.map((nation) => (
                <li key={nation.href}>
                  <Link href={nation.href}>
                    <span>{nation.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <RainbowKitCustomConnectButton />
        <FaucetButton />
      </div>
    </div>
  );
};
