import { ConnectButton } from "@rainbow-me/rainbowkit";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Space_Mono } from "next/font/google";
import { useAccount } from "wagmi";

const space = Space_Mono({ subsets: ["latin"], weight: "400" });

const Home: NextPage = () => {
  const {address} = useAccount();
  return (
    <>
      <div className={space.className}>
        <div className="flex justify-end mt-8 mr-10">
          <ConnectButton />
        </div>
        <div className="flex flex-col justify-center items-center gap-5">
          <h2 className="text-6xl title-text">ERC-20 Token Indexer</h2>
          <h2>Plug in an Address/ENS and this website will return all of its ERC-20 token balances!</h2>
        </div>
        <div className="flex justify-center mt-10">
          <div className="box w-[80%] border border-black p-3 hover:shadow-none hover:scale-[101%] transition-transform delay-100 cursor-default">
            <span className="text-3xl font-bold">
              {address}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
