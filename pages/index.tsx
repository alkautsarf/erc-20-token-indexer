import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Space_Mono } from "next/font/google";
import { useAccount } from "wagmi";
import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import { Skeleton, Stack } from "@chakra-ui/react";
import Tokens from "../components/Tokens";
import { useIsMounted } from "../hooks/useIsMounted";
import { IconButton } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import Link from "next/link";
const config = {
  apiKey: process.env.NEXT_PUBLIC_API, // Replace with your API key
  network: Network.ETH_MAINNET, // Replace with your network
};
const alchemy = new Alchemy(config);
const space = Space_Mono({ subsets: ["latin"], weight: "400" });

interface TokenData {
  contractAddress: string;
  rawBalance: string;
  decimals: number;
  logo?: string | undefined; // You might want to change the type based on the actual data type
  name: string;
  symbol: string;
  balance: string;
}

const Home: NextPage = () => {
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const [response, setResponse] = useState<any>([]);
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressFixed, setAddressFixed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState<boolean>(false);
  const length = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getToken = async () => {
    try {
      setIsLoading(true);
      const tokenBalances = await alchemy.core.getTokensForOwner(addressInput);
      setResponse(tokenBalances.tokens);
      setIsLoading(false);
      setAddressFixed(addressInput);
    } catch (e) {
      setFailed(true);
      alert("Address not Found 🥲");
    }
  };

  useEffect(() => {
    const getToken = async () => {
      setIsLoading(true);
      if (address) {
        const tokenBalances = await alchemy.core.getTokensForOwner(address);
        setResponse(tokenBalances.tokens);
        setIsLoading(false);
        setFailed(false);
      }
    };
    getToken();
  }, [address, failed]);

  return (
    <>
      <div className="">
        <div className={space.className}>
          <div className="flex justify-end my-5 mr-10">
            <ConnectButton />
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <Link href={"/"}>
              <h2 className="text-6xl title-text">ERC-20 Token Indexer</h2>
            </Link>
            <h2 className="text-center sm:mx-10">
              Connect a Wallet or plug in an Address/ENS and this website will
              return all of its ERC-20 token balances!
            </h2>
            <div className="flex items-center border border-gray-300 p-2 w-[30%]">
              <input
                className="flex-1 ml-2 p-1 focus:outline-none"
                type="text"
                placeholder="Address or ENS"
                onChange={(e) => {
                  e.preventDefault();
                  setAddressInput(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    getToken();
                  }
                }}
              />
              <button
                className="flex justify-center items-center h-6 w-6 text-gray-500"
                onClick={(e) => {
                  e.preventDefault();
                  getToken();
                }}
              >
                <SearchIcon width="24px" height="24px" />
              </button>
            </div>
          </div>
          {mounted && (isConnected || addressFixed) ? <h2 className="flex justify-center mt-10 text-2xl ">Address : {addressFixed || address}</h2> : ""}
          <div className="flex justify-center mt-6">
            {mounted && (isConnected || addressFixed) && (
              <div className="sm:w-auto md:w-auto lg:w-auto xl:w-[40%] border border-black p-3 cursor-default">
                {!isLoading ? (
                  response.map((el: TokenData) => <Tokens key={el?.contractAddress} tokenData={el} />)
                ) : (
                  <Stack>
                    {length.map((el) => (
                      <Skeleton height="20px" width="full" />
                    ))}
                  </Stack>
                )}
              </div>
            )}
            {mounted && (!isConnected && !addressFixed) && <h2 className="mt-[10%] text-3xl">Connect a wallet or Type in an Address 🚀</h2>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
