import Graphs from "@/components/Common/Sampler/modules/Graphs";
import Pies from "@/components/Common/Sampler/modules/Pies";
import Rates from "@/components/Common/Sampler/modules/Rates";
import Stats from "@/components/Common/Sampler/modules/Stats";
import TopBar from "@/components/Common/Sampler/modules/TopBar";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Sampler: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full h-[15rem] galaxy:h-[20rem] preG:h-[25rem] sm:h-[35rem] mid:h-[54.8rem] gap-3 flex flex-col">
      <div className="absolute w-full h-full bg-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmWFcPeE9w9Rxz5A52SuEKGNRHNouxuXm8Q6TmJVhD6x8K`}
          layout="fill"
          alt="retrowavebg"
          objectFit="cover"
        />
      </div>
      <div className="absolute w-full h-full flex">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmfEUs3YALtRybYk7YSsy5RnjjH7QXGS2p37JZsHD64qPL`}
          layout="fill"
        />
      </div>
      <div className="relative w-full h-full flex flex-col p-4 gap-6">
        <TopBar />
        <div className="relative flex flex-row w-full h-full gap-3">
          <Graphs />
          <div className="relative w-full h-full flex flex-col gap-3">
            <Pies />
            <Rates />
          </div>
        </div>
        <Stats />
      </div>
    </div>
  );
};
export default Sampler;
