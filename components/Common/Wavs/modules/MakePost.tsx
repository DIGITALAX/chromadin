import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";
import { MakePostProps } from "../types/wavs.types";
import { setMakePost } from "@/redux/reducers/makePostSlice";

const MakePost: FunctionComponent<MakePostProps> = ({
  dispatch,
  handleLensSignIn,
  handleConnect,
  profileId,
  address,
}): JSX.Element => {
  return (
    <div className="relative w-full h-fit flex justify-end ml-auto">
      <div
        className="relative w-4 h-4 flex cursor-pointer active:scale-95"
        onClick={() =>
          !profileId && !address
            ? () => handleConnect()
            : address && !profileId
            ? () => handleLensSignIn()
            : dispatch(setMakePost(true))
        }
      >
        <Image
          src={`${INFURA_GATEWAY}/ipfs/QmSRHvHoTZHuEpzaV8apWqubM92QG94a7q6spVgrNkQZbA`}
          className="w-full h-full flex"
          layout="fill"
        />
      </div>
    </div>
  );
};

export default MakePost;
