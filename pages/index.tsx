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
  const [isLoading, setIsLoading] = useState(false)
  const length = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  useEffect(() => {
    const getToken = async () => {
      setIsLoading(true);
      if (address) {
        const tokenBalances = await alchemy.core.getTokensForOwner(address);
        setResponse(tokenBalances.tokens);
        setIsLoading(false);
      }
    };
    getToken();
  }, [address]);

  return (
    <>
      <div className="">
        <div className={space.className}>
          <div className="flex justify-end my-5 mr-10">
            <ConnectButton />
          </div>
          <div className="flex flex-col justify-center items-center gap-5">
            <h2 className="text-6xl title-text">ERC-20 Token Indexer</h2>
            <h2>
              Connect a Wallet or plug in an Address/ENS and this website will return all of its
              ERC-20 token balances!
            </h2>
          </div>
          <div className="flex justify-center mt-10">
            {(mounted && isConnected) && <div className=" lg:w-auto xl:w-[40%] border border-black p-3 cursor-default">
              {!isLoading ? (
                response.map((el: TokenData) => (
                  <Tokens tokenData={el}/>
                ))
              ) : (
                <Stack>
                  {length.map(el => <Skeleton height='20px' width="full" />)}
                </Stack>
              )}
            </div>}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
