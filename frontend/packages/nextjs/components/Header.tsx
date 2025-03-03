"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bars3Icon, BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { FaucetButton, RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useOutsideClick } from "~~/hooks/scaffold-eth";
import { useAllContracts } from "~~/utils/scaffold-eth/contractsData";
import { useAccount, usePublicClient } from "wagmi";
import { CountryParametersContract } from '../../../../backend/typechain-types/contracts/CountryParameters.sol/CountryParametersContract';

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
    label: "Subgraph",
    href: "/subgraph",
    icon: <MagnifyingGlassIcon className="h-4 w-4" />,
  },
  {
    label: "Mint A Nation",
    href: "/mint",
  },
];

export const HeaderMenuLinks = () => {
  const pathname = usePathname();
  
  const playClickSound = () => {
    const audio = new Audio("/pageturn.wav");
    audio.play().catch(error => console.error("Audio playback failed:", error));
  };

  return (
    <>
      {menuLinks.map(({ label, href, icon }) => {
        const isActive = pathname === href;
        return (
          <li key={href}>
            <Link
              href={href}
              passHref
              onClick={playClickSound}
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
  const countryParametersContract = contractsData?.CountryParametersContract;

  const router = useRouter();

  useOutsideClick(
    burgerMenuRef,
    useCallback(() => setIsDrawerOpen(false), []),
  );

  const getNationName = async (tokenIdString: string) => {
    if (!publicClient) {
      throw new Error("publicClient is not defined");
    }
    let nationName = await publicClient.readContract({
      abi: countryParametersContract.abi,
      address: countryParametersContract.address,
      functionName: "getNationName",
      args: [tokenIdString],
    });
    return nationName;
  }

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

        const playClickSound = () => {
          const audio = new Audio("/pageturn.wav");
          audio.play().catch(error => console.error("Audio playback failed:", error));
        };

        const nations: { name: string; href: string; onClick: () => void }[] = await Promise.all(
          tokenIds.map(async (tokenId: string) => ({
            name: `${tokenId}: ${await getNationName(tokenId)}`,
            href: `/nations?id=${tokenId}`,
            onClick: () => {
              playClickSound();
              localStorage.setItem("selectedMenuItem", `Nation ${tokenId}`);
              router.push(`/nations?id=${tokenId}`);
            },
          }))
        );

        setMintedNations(nations);
      } catch (error) {
        console.error("Error fetching nations:", error);
        setMintedNations([]);
      }
    };

    fetchMintedNations();
  }, [walletAddress, countryMinterContract, publicClient, router]);

  const handleNationSelect = (nationId: string, nationName: string) => {
    console.log(`Nation selected: ${nationName} (ID: ${nationId})`);
  
    localStorage.setItem("selectedMenuItem", `Nation ${nationId}`);
  
    router.push(`/nations?id=${nationId}`);
  };

  return (
    <div className="font-special sticky lg:static top-0 navbar bg-base-100 min-h-0 flex-shrink-0 justify-between z-20 shadow-md shadow-secondary px-0 sm:px-2">
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
          <div className="flex relative w-[200px] h-[40px]">
            <Image 
              alt="St8Craft Logo" 
              className="cursor-pointer w-[200px] h-[40px] object-contain"
              src="/Logo_Full.png" 
              width={100} 
              height={100}
            />
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
                    <button
                      onClick={() => handleNationSelect(nation.href.split("=")[1], nation.name)}
                      className="cursor-pointer hover:bg-secondary p-2 rounded w-full text-left"
                    >
                      {nation.name}
                    </button>
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
