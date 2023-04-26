import {
  TOTAL_REVENUE_24,
  TOTAL_REVENUE_48,
  TOTAL_POST_W_REVENUE_24,
  TOTAL_POST_W_REVENUE_48,
} from "@/lib/bigquery/queries";
import { setRatesRedux } from "@/redux/reducers/ratesSlice";
import { RootState } from "@/redux/store";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UseRatesResults } from "../types/sampler.types";

const useRates = (): UseRatesResults => {
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const rates = useSelector((state: RootState) => state.app.ratesReducer.value);
  const dispatch = useDispatch();
  const [totalChanges, setTotalChanges] = useState<number[]>([]);
  const [ratesLoading, setRatesLoading] = useState<boolean>(false);

  const getTotalRevenue = async () => {
    setRatesLoading(true);
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
        setTotalChanges([
          ((data24.rows[0].total_amount - data48.rows[0].total_amount) /
            data48.rows[0].total_amount) *
            100,
          ((dataPost24.rows.length - dataPost48.rows.length) /
            dataPost48.rows.length) *
            100,
        ]);
        dispatch(
          setRatesRedux([
            ((data24.rows[0].total_amount - data48.rows[0].total_amount) /
              data48.rows[0].total_amount) *
              100,
            ((dataPost24.rows.length - dataPost48.rows.length) /
              dataPost48.rows.length) *
              100,
          ])
        );
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setRatesLoading(false);
  };

  useEffect(() => {
    if (viewer === "sampler" && rates.length === 0) {
      // getTotalRevenue();
    }
  }, []);

  return {
    totalChanges,
    ratesLoading,
  };
};

export default useRates;
