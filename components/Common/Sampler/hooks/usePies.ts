import { TOP_FOLLOWED_ACCOUNTS_48 } from "@/lib/bigquery/queries";
import { setPiesRedux } from "@/redux/reducers/piesSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UsePiesResults } from "../types/sampler.types";

const usePies = (): UsePiesResults => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const pies = useSelector((state: RootState) => state.app.piesReducer.value);
  const dispatch = useDispatch();
  const [piesLoading, setPiesLoading] = useState<boolean>(false);
  const [topAccountsFollowed, setTopAccountsFollowed] = useState<
    {
      handle: string;
      percentage: string;
    }[]
  >([]);

  const getTopFollowedAcc = async () => {
    setPiesLoading(true);
    try {
      const res = await fetch("/api/bigquery", {
        method: "POST",
        body: TOP_FOLLOWED_ACCOUNTS_48,
      });
      if (res.ok) {
        const data = await res.json();
        const total = data.rows.reduce(
          (acc: any, row: any) => acc + row.count,
          0
        );
        const topAccounts = data.rows.slice(0, 12).map((row: any) => {
          const percentage = ((row.count / total) * 100).toFixed(2);
          return {
            handle: row.handle,
            percentage: percentage,
          };
        });
        setTopAccountsFollowed(topAccounts);
        dispatch(setPiesRedux(topAccounts));
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setPiesLoading(false);
  };

  useEffect(() => {
    if (viewer === "sampler" && pies.length === 0) {
      // getTopFollowedAcc();
    }
  }, []);

  return { topAccountsFollowed, piesLoading };
};

export default usePies;
