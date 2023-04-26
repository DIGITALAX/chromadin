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
import { RootState } from "@/redux/store";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { useSelector } from "react-redux";

const Sampler: FunctionComponent = (): JSX.Element => {
  const {
    totalCollects,
    totalMirrors,
    totalPosts,
    volumeCollectChange,
    volumeProfileChange,
    topBarLoading
  } = useBar();
  const { totalChanges, ratesLoading } = useRates();
  const { topAccountsFollowed, piesLoading } = usePies();
  const { statTitles, statsLoading } = useStats();
  const rates = useSelector((state: RootState) => state.app.ratesReducer.value);
  const stats = useSelector((state: RootState) => state.app.statsReducer.value);
  const pies = useSelector((state: RootState) => state.app.piesReducer.value);
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
          topBarLoading={topBarLoading}
        />
        <div className="relative flex flex-row w-full h-full gap-3">
          <Graphs />
          <div className="relative w-200 h-full flex flex-col gap-3">
            <Pies
              topAccountsFollowed={topAccountsFollowed}
              piesRedux={pies}
              piesLoading={piesLoading}
            />
            <Rates
              totalChanges={totalChanges}
              ratesRedux={rates}
              ratesLoading={ratesLoading}
            />
          </div>
        </div>
        <Stats
          statTitles={statTitles}
          statsRedux={stats}
          statsLoading={statsLoading}
        />
      </div>
    </div>
  );
};
export default Sampler;
