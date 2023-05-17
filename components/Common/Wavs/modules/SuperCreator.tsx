import { FunctionComponent } from "react";
import { SuperCreatorProps } from "../types/wavs.types";
import { setSuperFollow } from "@/redux/reducers/superFollowSlice";

const SuperCreator: FunctionComponent<SuperCreatorProps> = ({
  handleConnect,
  handleLensSignIn,
  address,
  profileId,
  dispatch,
}): JSX.Element => {
  return (
    <div className="relative w-fit h-fit flex flex-col items-start justify-start ml-auto animate-pulse">
      <div
        className="relative flex flex-col h-fit w-full rounded-md text-white whitespace-nowrap px-3 py-1 cursor-pointer active:scale-95 font-dosis hover:text-moda"
        onClick={
          !address
            ? () => handleConnect()
            : address && !profileId
            ? () => handleLensSignIn()
            : () => dispatch(setSuperFollow(true))
        }
      >
        <div className={`relative text-sm w-fit h-fit justify-center flex`}>
          super creator
        </div>
        <div className="relative h-fit w-full justify-end flex text-ama font-earl text-xxs text-right">
          {!address || !profileId ? "sign in 2 follow" : " follow"}
        </div>
      </div>
    </div>
  );
};

export default SuperCreator;
