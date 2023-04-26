import {
  TOTAL_REVENUE_24,
  TOTAL_REVENUE_48,
  TOTAL_POST_W_REVENUE_24,
  TOTAL_POST_W_REVENUE_48,
} from "@/lib/bigquery/queries";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useRates = () => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const [totalRev24, setTotalRev24] = useState<number>(0);
  const [totalRev48, setTotalRev48] = useState<number>(0);
  const [totalRevChange, setTotalRevChange] = useState<number>(0);
  const [totalPostChange, setTotalPostChange] = useState<number>(0);
  const [totalPost24, setTotalPost24] = useState<number>(0);
  const [totalPost48, setTotalPost48] = useState<number>(0);

  const getTotalRevenue = async () => {
    try {
      const res24 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_REVENUE_24,
      });
      const res48 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_REVENUE_48,
      });
      const post24 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_POST_W_REVENUE_24,
      });
      const post48 = await fetch("/api/bigquery", {
        method: "POST",
        body: TOTAL_POST_W_REVENUE_48,
      });
      if (res24.ok && res48.ok && post24.ok) {
        const data24 = await res24.json();
        const data48 = await res48.json();
        const dataPost24 = await post24.json();
        const dataPost48 = await post48.json();

        setTotalRev24(data24.rows[0].total_amount);
        setTotalRev48(data48.rows[0].total_amount);
        setTotalRevChange(
          ((data48.rows[0].total_amount - data24.rows[0].total_amount) /
            data48.rows[0].total_amount) *
            100
        );
        setTotalPost24(dataPost24.rows[0].count);
        setTotalPost48(dataPost48.rows[0].count);
        setTotalPostChange(
          ((dataPost48.rows[0].count - dataPost24.rows[0].count) /
            dataPost48.rows[0].count) *
            100
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    if (viewer === "sampler") {
      getTotalRevenue();
    }
  }, []);

  return {
    totalRev24,
    totalRevChange,
    totalPost24,
    totalPost48,
    totalRev48,
    totalPostChange,
  };
};

export default useRates;
