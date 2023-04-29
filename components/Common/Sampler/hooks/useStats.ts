import { setStatsRedux } from "@/redux/reducers/statsSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UseStatsResults } from "../types/sampler.types";
import getDailyMappings from "@/graphql/subgraph/queries/getDailyMappings";
import fetchIPFSJSON from "@/lib/helpers/fetchIPFSJSON";
import { setPiesRedux } from "@/redux/reducers/piesSlice";
import { setRatesRedux } from "@/redux/reducers/ratesSlice";
import { setGraphRedux } from "@/redux/reducers/graphSlice";

const useStats = (): UseStatsResults => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const stats = useSelector((state: RootState) => state.app.statsReducer.value);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [statTitles, setStatTitles] = useState<any[][]>([
    ["Top 50 Mirrorers (All Time)"],
    ["Top 50 Collectors (All Time)"],
    ["Top 50 Authors (All Time)"],
    ["Unique Collects (24HRS)"],
    ["Pub Collect β (All Time)"],
    ["Pub Collect β (72HRS)"],
    ["Amount Paid Leaderboard (72HRS)"],
  ]);
  const [canvas, setCanvas] = useState<string>("interests");
  const [totalChanges, setTotalChanges] = useState<number[]>([]);
  const [topAccountsFollowed, setTopAccountsFollowed] = useState<
    {
      handle: string;
      percentage: string;
    }[]
  >([]);
  const [graphData, setGraphData] = useState<any[]>([]);

  const getDashboardData = async () => {
    setStatsLoading(true);
    try {
      const res = await getDailyMappings();
      const stats = [
        [
          "Top 50 Mirrorers (All Time)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._topMirrorers as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Top 50 Collectors (All Time)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._topCollectors as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Top 50 Authors (All Time)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._topPosters as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Unique Collects (24HRS)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._unique as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Pub Collect β (All Time)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._amountToCollect as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Pub Collect β (72HRS)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._amountToCollect72 as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
        [
          "Amount Paid Leaderboard (72HRS)",
          JSON.parse(
            await fetchIPFSJSON(
              (res.data?.dailyMappingsAddeds[0]?._highestSpend as any)
                ?.split("ipfs://")[1]
                ?.replace(/"/g, "")
                ?.trim()
            )
          ),
        ],
      ];
      const jsonFollow = JSON.parse(
        await fetchIPFSJSON(
          (res.data?.dailyMappingsAddeds[0]?._topFollowed as any)
            ?.split("ipfs://")[1]
            ?.replace(/"/g, "")
            ?.trim()
        )
      );
      const total = jsonFollow.reduce(
        (accumulator: number, currentValue: any) =>
          accumulator + Number(currentValue.count),
        0
      );
      const follow = jsonFollow?.slice(0, 12).map((row: any) => {
        const percentage = ((Number(row.count) / Number(total)) * 100).toFixed(
          2
        );
        return {
          handle: row.handle,
          percentage: percentage,
        };
      });

      const jsonRevenue = JSON.parse(
        await fetchIPFSJSON(
          (res.data?.dailyMappingsAddeds[0]?._revenueChange as any)
            ?.split("ipfs://")[1]
            ?.replace(/"/g, "")
            ?.trim()
        )
      );
      const changes = [
        ((Number(jsonRevenue[1].total_amount_24) -
          Number(jsonRevenue[0].total_amount_48)) /
          Number(jsonRevenue[0].total_amount_48)) *
          100,
        ((Number(jsonRevenue[2].total_post_24) -
          Number(jsonRevenue[3].total_post_48)) /
          Number(jsonRevenue[3].total_post_48)) *
          100,
      ];
      const jsonGraph = JSON.parse(
        await fetchIPFSJSON(
          (res.data?.dailyMappingsAddeds[0]?._graph as any)
            ?.split("ipfs://")[1]
            ?.replace(/"/g, "")
            ?.trim()
        )
      );
      const graphData = jsonGraph.map((jsonGraph: any[], index: number) => {
        let totalCount: number;
        if (index < 2) {
          totalCount = jsonGraph.reduce(
            (acc, obj) => acc + Number(obj.count),
            0
          );
        } else {
          totalCount = jsonGraph.reduce(
            (acc, obj) => acc + Number(obj.total_amount_of_collects),
            0
          );
        }
        return jsonGraph.map((obj) => ({
          ...obj,
          label:
            index === 0
              ? obj.hashtag
              : index === 1
              ? obj.interest
              : {
                  handle: obj.handle,
                  pfp: obj.profile_picture_s3_url,
                },
          percentage:
            index < 2
              ? (Number(obj.count) / totalCount) * 100
              : (Number(obj.total_amount_of_collects) / totalCount) * 100,
        }));
      });

      const graphs = [
        { name: "interests", data: graphData[1] },
        { name: "music", data: graphData[2] },
        { name: "images", data: graphData[3] },
        { name: "video", data: graphData[4] },
        { name: "hashtags", data: graphData[0] },
      ];

      setStatTitles(stats);
      setTopAccountsFollowed(follow);
      setTotalChanges(changes);
      setGraphData(graphs);
      dispatch(setStatsRedux(stats));
      dispatch(setPiesRedux(follow));
      dispatch(setRatesRedux(changes));
      dispatch(setGraphRedux(graphs));
    } catch (err: any) {
      console.error(err.message);
    }

    setStatsLoading(false);
  };

  // const getStats = async () => {
  //   setStatsLoading(true);
  //   try {
  //     const collectTop = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: TOP_50_COLLECTORS_ALL_TIME,
  //     });
  //     const mirrorTop = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: TOP_50_MIRRORS_ALL_TIME,
  //     });
  //     const postTop = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: TOP_50_POSTERS_ALL_TIME,
  //     });
  //     const amountToCollectAll = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: AMOUNT_TO_NO_COLLECTORS_ALL_TIME,
  //     });
  //     const amountToCollect72 = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: AMOUNT_TO_NO_COLLECTORS_72,
  //     });
  //     const highestSpend = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: HIGHEST_COLLECTOR_SPEND_72,
  //     });
  //     const unique = await fetch("/api/bigquery", {
  //       method: "POST",
  //       body: UNIQUE_COLLECTS_24,
  //     });
  //     if (
  //       collectTop.ok &&
  //       mirrorTop.ok &&
  //       postTop.ok &&
  //       amountToCollectAll.ok &&
  //       amountToCollect72.ok &&
  //       highestSpend.ok &&
  //       unique.ok
  //     ) {
  //       const dataCollect = await collectTop.json();
  //       const dataMirror = await mirrorTop.json();
  //       const dataPost = await postTop.json();
  //       const dataAmountAll = await amountToCollectAll.json();
  //       const dataAmount72 = await amountToCollect72.json();
  //       const highest = await highestSpend.json();
  //       const dataUnique = await unique.json();

  //       setStatTitles([
  //         ["Top 50 Mirrorers All Time", dataMirror.rows],
  //         ["Top 50 Collectors All Time", dataCollect.rows],
  //         ["Top 50 Posters All Time", dataPost.rows],
  //         ["Unique Collectors 24HRS", dataUnique.rows],
  //         ["Amount to Collect Ratio All Time", dataAmountAll.rows],
  //         ["Amount to Collect Ratio 72HRS", dataAmount72.rows],
  //         ["Highest Spend 72HRS", highest.rows],
  //       ]);
  //       dispatch(
  //         setStatsRedux([
  //           ["Top 50 Mirrorers All Time", dataMirror.rows],
  //           ["Top 50 Collectors All Time", dataCollect.rows],
  //           ["Top 50 Posters All Time", dataPost.rows],
  //           ["Unique Collectors 24HRS", dataUnique.rows],
  //           ["Amount to Collect Ratio All Time", dataAmountAll.rows],
  //           ["Amount to Collect Ratio 72HRS", dataAmount72.rows],
  //           ["Highest Spend 72HRS", highest.rows],
  //         ])
  //       );
  //     }
  //   } catch (err: any) {
  //     console.error(err.message);
  //   }
  //   setStatsLoading(false);
  // };

  useEffect(() => {
    if (viewer === "sampler" && stats.length === 0) {
      // getStats();
      getDashboardData();
    }
  }, [viewer]);

  return {
    statTitles,
    statsLoading,
    topAccountsFollowed,
    totalChanges,
    graphData,
    setCanvas,
    canvas,
  };
};

export default useStats;
