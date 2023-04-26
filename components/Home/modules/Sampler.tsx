import useBar from "@/components/Common/Sampler/hooks/useBar";
import usePies from "@/components/Common/Sampler/hooks/usePies";
import useRates from "@/components/Common/Sampler/hooks/useRates";
import useStats from "@/components/Common/Sampler/hooks/useStats";
import Graphs from "@/components/Common/Sampler/modules/Graphs";
import Pies from "@/components/Common/Sampler/modules/Pies";
import Rates from "@/components/Common/Sampler/modules/Rates";
import Stats from "@/components/Common/Sampler/modules/Stats";
import TopBar from "@/components/Common/Sampler/modules/TopBar";
import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Sampler: FunctionComponent = (): JSX.Element => {
  const {
    totalCollects,
    totalMirrors,
    totalPosts,
    volumeCollectChange,
    volumeProfileChange,
  } = useBar();
  const {
    totalRevChange,
    totalPostChange,
  } = useRates();
  const { topAccountsFollowed } = usePies();
  const { statTitles } = useStats();
  return (
    <div className="relative w-full h-full mid:h-[54.8rem] gap-3 flex">
      <div className="absolute w-full h-full bg-cover">
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmUpj8mFnHji5fiqShj5GiCEdE8Ab8jTZBWHrGBXVTRg9c`}
          layout="fill"
          alt="retrowavebg"
          objectFit="cover"
        />
      </div>
      <div className="relative w-full h-full flex flex-col p-4 gap-3">
        <TopBar
          totalCollects={totalCollects}
          totalMirrors={totalMirrors}
          totalPosts={totalPosts}
          volumeCollectChange={volumeCollectChange}
          volumeProfileChange={volumeProfileChange}
        />
        <div className="relative flex flex-row w-full h-full gap-3">
          <Graphs />
          <div className="relative w-200 h-full flex flex-col gap-3">
            <Pies topAccountsFollowed={topAccountsFollowed} />
            <Rates
              totalRevChange={totalRevChange}
              totalPostChange={totalPostChange}
            />
          </div>
        </div>
        <Stats statTitles={statTitles} />
      </div>
    </div>
  );
};
export default Sampler;
