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

interface NftProps {
  key: any;
  nftData: any;
}

const Nfts: React.FC<NftProps> = ({ key, nftData }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  useEffect(() => {
    console.log(nftData);
  }, []);
  return (
    <>
      <div
        className="flex justify-start p-5 gap-3 mb-3 box border border-black hover:scale-[101%] hover:shadow-none hover:text-blue-500 transition-transform cursor-pointer"
        onClick={onOpen}
      >
        <Image
          src={nftData?.image?.cachedUrl}
          className="w-[100px] h-[100px]"
          loading="lazy"
        />
        <div className="flex flex-col gap-3 justify-evenly">
          <h2 className="text-lg">{nftData?.name}</h2>
          <h2 className="text-lg">
            {nftData?.contract?.openSeaMetadata?.floorPrice} ETH
          </h2>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{nftData?.name}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Link
              href={`https://opensea.io/assets/ethereum/${nftData?.contract?.address}/${nftData?.tokenId}`}
            >
              <h2 className="text-blue-500 underline">
                Open in Opensea
              </h2>
            </Link>
          </ModalBody>
          <ModalFooter>
            <button onClick={onClose}>Close</button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Nfts;
