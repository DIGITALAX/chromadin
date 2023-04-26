import {
  AMOUNT_TO_NO_COLLECTORS_72,
  AMOUNT_TO_NO_COLLECTORS_ALL_TIME,
  HIGHEST_COLLECTOR_SPEND_72,
  TOP_50_COLLECTORS_ALL_TIME,
  TOP_50_MIRRORS_ALL_TIME,
  TOP_50_POSTERS_ALL_TIME,
  UNIQUE_COLLECTS_24,
} from "@/lib/bigquery/queries";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useStats = () => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const [statTitles, setStatTitles] = useState<any[][]>([
    ["Top 50 Mirrorers All Time"],
    ["Top 50 Collectors All Time"],
    ["Top 50 Posters All Time"],
    ["Unique Collectors 24HRS"],
    ["Amount to Collect Ratio All Time"],
    ["Amount to Collect Ratio 72HRS"],
    ["Highest Spend 72HRS"],
  ]);

  const getStats = async () => {
    try {
      const collectTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_COLLECTORS_ALL_TIME,
      });
      const mirrorTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_MIRRORS_ALL_TIME,
      });
      const postTop = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_50_POSTERS_ALL_TIME,
      });
      const amountToCollectAll = await fetch("/api/bigquery", {
        method: "POST",
        body: AMOUNT_TO_NO_COLLECTORS_ALL_TIME,
      });
      const amountToCollect72 = await fetch("/api/bigquery", {
        method: "POST",
        body: AMOUNT_TO_NO_COLLECTORS_72,
      });
      const highestSpend = await fetch("/api/bigquery", {
        method: "POST",
        body: HIGHEST_COLLECTOR_SPEND_72,
      });
      const unique = await fetch("/api/bigquery", {
        method: "POST",
        body: UNIQUE_COLLECTS_24,
      });
      if (
        collectTop.ok &&
        mirrorTop.ok &&
        postTop.ok &&
        amountToCollectAll.ok &&
        amountToCollect72.ok &&
        highestSpend.ok &&
        unique.ok
      ) {
        const dataCollect = await collectTop.json();
        const dataMirror = await mirrorTop.json();
        const dataPost = await postTop.json();
        const dataAmountAll = await amountToCollectAll.json();
        const dataAmount72 = await amountToCollect72.json();
        const highest = await highestSpend.json();
        const dataUnique = await unique.json();

        setStatTitles([
          ["Top 50 Mirrorers All Time", dataMirror.rows],
          ["Top 50 Collectors All Time", dataCollect.rows],
          ["Top 50 Posters All Time", dataPost.rows],
          ["Unique Collectors 24HRS", dataUnique.rows],
          ["Amount to Collect Ratio All Time", dataAmountAll.rows],
          ["Amount to Collect Ratio 72HRS", dataAmount72.rows],
          ["Highest Spend 72HRS", highest.rows],
        ]);
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (viewer === "sampler") {
      getStats();
    }
  }, [viewer]);

  return {
    statTitles,
  };
};

export default useStats;
