// import Image from 'next/image';
import { Image, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import Link from "next/link";

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
  key: any;
  tokenData: TokenData;
}

const Tokens: React.FC<TokensProps> = ({ key, tokenData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <div
        className="flex justify-start p-5 gap-3 mb-3 box border border-black hover:scale-[101%] hover:shadow-none hover:text-blue-500 transition-transform cursor-pointer"
        onClick={onOpen}
      >
        <Image src={tokenData?.logo} className="w-[100px] h-[100px]" alt="" />
        <div className="flex flex-col gap-3 justify-evenly">
          <h2 className="text-lg">{tokenData?.symbol}</h2>
          <h2 className="text-lg">{tokenData?.balance} {tokenData?.symbol}</h2>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{tokenData.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
              <h2>Contract Address : <Link href={`https://etherscan.io/token/${tokenData.contractAddress}`}>
                <span className="text-blue-500 hover:underline">{tokenData.contractAddress}</span>
            </Link></h2>
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose}>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Tokens;
