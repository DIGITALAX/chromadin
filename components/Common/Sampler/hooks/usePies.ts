import { TOP_FOLLOWED_ACCOUNTS_48 } from "@/lib/bigquery/queries";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const usePies = () => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const [topAccountsFollowed, setTopAccountsFollowed] = useState<string[]>([]);

  const getTopFollowedAcc = async () => {
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
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (viewer === "sampler") {
      getTopFollowedAcc();
    }
  }, []);

  return { topAccountsFollowed };
};

export default usePies;
