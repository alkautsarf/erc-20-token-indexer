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
import Nfts from "../components/Nfts";
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

// interface NftData {
//   contractAddress: string;
//   name: string;
//   totalSupply: string;
//   logo?: string | undefined; // You might want to change the type based on the actual data type
//   symbol: string;
//   balance: string;
// }

const Home: NextPage = () => {
  const mounted = useIsMounted();
  const { address, isConnected } = useAccount();
  const [response, setResponse] = useState<any>([]);
  const [nft, setNft] = useState<any>([]);
  const [addressInput, setAddressInput] = useState<string>("");
  const [addressFixed, setAddressFixed] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [failed, setFailed] = useState<boolean>(false);
  const [showNft, setShowNft] = useState<boolean>(false);
  const length = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  const getToken = async () => {
    try {
      setIsLoading(true);
      let options: object = {
        excludeFilters: "SPAM",
      };
      const tokenBalances = await alchemy.core.getTokensForOwner(addressInput);
      const nftBalances = await alchemy.nft.getNftsForOwner(addressInput, options);
      console.log(nftBalances.ownedNfts, "<<<<< ini dr query")
      setNft(nftBalances.ownedNfts);
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
        let options: object = {
          excludeFilters: "SPAM",
        };
        //Call the method to get the nfts owned by this address
        const tokenBalances = await alchemy.core.getTokensForOwner(address);
        const nftBalances = await alchemy.nft.getNftsForOwner(address, options);
        setResponse(tokenBalances.tokens);
        setNft(nftBalances.ownedNfts);
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
              <h2 className="text-6xl title-text">Ethereum Token Indexer</h2>
            </Link>
            <h2 className="text-center sm:mx-10">
              Connect a Wallet or plug in an Address/ENS and this website will
              return all of its token balances!
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
          {mounted && (isConnected || addressFixed) ? (
            <h2 className="flex justify-center mt-10 text-xl ">
              Address : {addressFixed || address}
            </h2>
          ) : (
            ""
          )}
          {mounted && (isConnected || addressFixed) ? (
            <div className="flex w-full justify-center">
              <div className="grid grid-cols-2  justify-evenly mt-5 border border-black p-3 w-[40%]">
                <button
                  onClick={() => setShowNft(false)}
                  className={`border-black border-r-2 ${
                    !showNft ? "text-blue-500" : ""
                  }`}
                >
                  ERC-20
                </button>
                <button
                  onClick={() => setShowNft(true)}
                  className={`${showNft ? "text-blue-500" : ""}`}
                >
                  NFT
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
          <div className="flex justify-center mt-6">
            {mounted && (isConnected || addressFixed) && (
              <div className="sm:w-auto md:w-auto lg:w-auto xl:w-[40%] border border-black p-3 cursor-default">
                {!isLoading && !showNft ? (
                  response.map((el: TokenData) => (
                    <Tokens key={el?.contractAddress} tokenData={el} />
                  ))
                ) : !isLoading && showNft ? (
                  nft.map((el: any, idx: any) => (
                    <Nfts key={idx} nftData={el}/>
                  ))
                ) :(
                  <Stack>
                    {length.map((el, idx) => (
                      <Skeleton key={idx} height="20px" width="full" />
                    ))}
                  </Stack>
                )}
              </div>
            )}
            {mounted && !isConnected && !addressFixed && (
              <h2 className="mt-[10%] text-3xl">
                Connect a wallet or Type in an Address 🚀
              </h2>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
