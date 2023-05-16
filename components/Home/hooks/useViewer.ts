import { setOptions } from "@/redux/reducers/optionsSlice";
import { setProfile } from "@/redux/reducers/profileSlice";
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
    if (router.asPath.includes("&search=")) {
      router.asPath.includes("&profile=")
        ? router.asPath.includes("?option=")
          ? router.push(
              router.asPath.split("&search=")[0] +
                "&search=" +
                (e.target as HTMLFormElement).value +
                "&profile=" +
                router.asPath.split("&profile=")[1]
            )
          : router.push(
              router.asPath.split("&search=")[0] +
                "?option=history" +
                "&search=" +
                (e.target as HTMLFormElement).value +
                "&profile=" +
                router.asPath.split("&profile=")[1]
            )
        : router.asPath.includes("&post=")
        ? router.asPath.includes("?option=")
          ? router.push(
              router.asPath.split("&search=")[0] +
                "&search=" +
                (e.target as HTMLFormElement).value +
                "&post=" +
                router.asPath.split("&post=")[1]
            )
          : router.push(
              router.asPath.split("&search=")[0] +
                "?option=history&search=" +
                (e.target as HTMLFormElement).value +
                "&post=" +
                router.asPath.split("&post=")[1]
            )
        : router.asPath.includes("?option=")
        ? router.push(
            router.asPath.split("&search=")[0] +
              "&search=" +
              (e.target as HTMLFormElement).value
          )
        : router.push(
            router.asPath.split("&search=")[0] +
              "?option=history&search=" +
              (e.target as HTMLFormElement).value
          );
    } else {
      router.asPath.includes("&profile=")
        ? router.asPath.includes("?option=")
          ? router.push(
              router.asPath.split("&profile=")[0] +
                "&search=" +
                (e.target as HTMLFormElement).value +
                "&profile=" +
                router.asPath.split("&profile=")[1]
            )
          : router.push(
              router.asPath.split("&profile=")[0] +
                "?option=history&search=" +
                (e.target as HTMLFormElement).value +
                "&profile=" +
                router.asPath.split("&profile=")[1]
            )
        : router.asPath.includes("&post=")
        ? router.asPath.includes("?option=")
          ? router.push(
              router.asPath.split("&post=")[0] +
                "&search=" +
                (e.target as HTMLFormElement).value +
                "&post=" +
                router.asPath.split("&post=")[1]
            )
          : router.push(
              router.asPath.split("&post=")[0] +
                "?option=history&search=" +
                (e.target as HTMLFormElement).value +
                "&post=" +
                router.asPath.split("&post=")[1]
            )
        : router.asPath.includes("?option=")
        ? router.push(
            router.asPath + "&search=" + (e.target as HTMLFormElement).value
          )
        : router.push(
            router.asPath +
              "?option=history&search=" +
              (e.target as HTMLFormElement).value
          );
    }
  };

  useEffect(() => {
    if (router.asPath.includes("#")) {
      if (!router.asPath.includes("&search=")) {
        if (router.asPath.includes("&profile=")) {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(
              router.asPath
                .split("#")[1]
                .split("?option=")[1]
                .split("&profile=")[0]
            )
          );
        } else if (router.asPath.includes("&post=")) {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(
              router.asPath
                .split("#")[1]
                .split("?option=")[1]
                .split("&post=")[0]
            )
          );
        } else {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(router.asPath.split("#")[1].split("?option=")[1])
          );
        }
      } else {
        if (router.asPath.includes("&profile=")) {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(
              router.asPath
                .split("#")[1]
                .split("?option=")[1]
                .split("&search=")[0]
            )
          );
          dispatch(
            setSearch(
              router.asPath
                .split("&search=")[1]
                .split("&profile=")[0]
                .replaceAll("%20", " ")
            )
          );
        } else if (router.asPath.includes("&post=")) {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(
              router.asPath
                .split("#")[1]
                .split("?option=")[1]
                .split("&search=")[0]
            )
          );
          dispatch(
            setSearch(
              router.asPath
                .split("&search=")[1]
                .split("&post=")[0]
                .replaceAll("%20", " ")
            )
          );
        } else {
          dispatch(setView(router.asPath.split("#")[1].split("?option=")[0]));
          dispatch(
            setOptions(
              router.asPath
                .split("#")[1]
                .split("?option=")[1]
                .split("&search=")[0]
            )
          );
          dispatch(
            setSearch(router.asPath.split("&search=")[1].replaceAll("%20", " "))
          );
        }
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
