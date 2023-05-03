import { setOptions } from "@/redux/reducers/optionsSlice";
import { setSearch } from "@/redux/reducers/searchSlice";
import { setView } from "@/redux/reducers/viewSlice";
import { RootState } from "@/redux/store";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const useViewer = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const viewer = useSelector((state: RootState) => state.app.viewReducer.value);
  const [dropDownPriceSort, setDropDownPriceSort] = useState<boolean>(false);
  const [dropDownDateSort, setDropDownDateSort] = useState<boolean>(false);

  const handleSearch = (e: FormEvent) => {
    router.push(
      router.asPath.split("?search=")[0] +
        "?search=" +
        (e.target as HTMLFormElement).value
    );
  };

  useEffect(() => {
    if (router.asPath.includes("#")) {
      if (!router.asPath.includes("?search=")) {
        dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
        dispatch(setOptions(router.asPath.split("#")[1].split("?option=")[1]));
      } else {
        dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
        dispatch(
          setOptions(
            router.asPath
              .split("#")[1]
              .split("?option=")[1]
              .split("?search=")[0]
          )
        );
        dispatch(
          setSearch(router.asPath.split("?search=")[1].replaceAll("%20", " "))
        );
      }
    }
  }, [router.asPath]);

  return {
    viewer,
    dropDownPriceSort,
    setDropDownPriceSort,
    dropDownDateSort,
    setDropDownDateSort,
    handleSearch,
  };
};

export default useViewer;
