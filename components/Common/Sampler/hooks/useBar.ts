import {
  globalProtocolStats,
  volumeStats,
} from "@/graphql/lens/queries/globalProtocolStats";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useBar = () => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const [totalCollects, setTotalCollects] = useState<number>(0);
  const [totalMirrors, setTotalMirrors] = useState<number>(0);
  const [totalPosts, setTotalPosts] = useState<number>(0);
  const [previousCollectVolume, setPreviousCollectVolume] = useState<number>(0);
  const [currentCollectVolume, setCurrentCollectVolume] = useState<number>(0);
  const [volumeCollectChange, setVolumeCollectChange] = useState<number>(0);
  const [previousProfileVolume, setPreviousProfileVolume] = useState<number>(0);
  const [currentProfileVolume, setCurrentProfileVolume] = useState<number>(0);
  const [volumeProfileChange, setVolumeProfileChange] = useState<number>(0);

  const getTotals = async () => {
    try {
      const res = await globalProtocolStats();
      setTotalCollects(res.data.globalProtocolStats.totalCollects);
      setTotalMirrors(res.data.globalProtocolStats.totalMirrors);
      setTotalPosts(res.data.globalProtocolStats.totalPosts);
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const getVolumes = async (
    fromTimestamp: number,
    toTimestamp: number
  ): Promise<{ collects: number; profiles: number } | undefined> => {
    try {
      const res = await volumeStats({
        fromTimestamp: fromTimestamp,
        toTimestamp: toTimestamp,
      });

      return {
        collects: res.data.globalProtocolStats.totalCollects,
        profiles: res.data.globalProtocolStats.totalProfiles,
      };
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const calculateCollectVolumeChange = () => {
    setVolumeCollectChange(
      ((currentCollectVolume - previousCollectVolume) / previousCollectVolume) *
        100
    );
    setVolumeProfileChange(
      ((currentProfileVolume - previousProfileVolume) / previousProfileVolume) *
        100
    );
  };

  useEffect(() => {
    if (viewer === "sampler") {
      getTotals();
      const interval = setInterval(async () => {
        const now = Math.floor(Date.now() / 1000);
        const prevFrom = now - 2 * 24 * 60 * 60;
        const prevTo = now - 24 * 60 * 60;
        const currFrom = now - 24 * 60 * 60;
        const currTo = now;
        const prevCollects = await getVolumes(prevFrom, prevTo);
        const currentCollects = await getVolumes(currFrom, currTo);
        setPreviousCollectVolume(
          prevCollects?.collects ? prevCollects.collects : 0
        );
        setCurrentCollectVolume(
          currentCollects?.collects ? currentCollects.collects : 0
        );
        setPreviousProfileVolume(
          prevCollects?.profiles ? prevCollects.profiles : 0
        );
        setCurrentProfileVolume(
          currentCollects?.profiles ? currentCollects.profiles : 0
        );
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [viewer]);

  useEffect(() => {
    calculateCollectVolumeChange();
  }, [
    currentCollectVolume,
    previousCollectVolume,
    currentProfileVolume,
    previousProfileVolume,
  ]);

  return {
    totalCollects,
    totalMirrors,
    totalPosts,
    volumeCollectChange,
    volumeProfileChange,
  };
};

export default useBar;
