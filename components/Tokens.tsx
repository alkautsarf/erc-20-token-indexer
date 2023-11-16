// import Image from 'next/image';
import { Image } from "@chakra-ui/react";
import React, { useEffect } from "react";

interface TokenData {
  contractAddress: string;
  rawBalance: string;
  decimals: number;
  logo?: string | undefined;
  name: string;
  symbol: string;
  balance: string;
}

interface TokensProps {
  tokenData: TokenData;
}

const Tokens: React.FC<TokensProps> = ({ tokenData }) => {
  useEffect(() => {
    console.log(tokenData);
  }, []);
  return (
    <div className="flex justify-start p-5 gap-3 mb-3 box border border-black hover:scale-[101%] transition-transform delay-100">
      <Image src={tokenData?.logo} className="w-[100px] h-[100px]" alt=""/>
      <div className="flex flex-col gap-3 justify-evenly">
        <h2>{tokenData?.symbol}</h2>
        <h2>${tokenData?.balance}</h2>
      </div>
    </div>
  );
};

export default Tokens;
