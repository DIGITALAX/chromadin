import { FunctionComponent } from "react";
import { IndexingModalProps } from "../types/modals.types";

const IndexingModal: FunctionComponent<IndexingModalProps> = ({
  message,
  distanceFromBottom,
}): JSX.Element => {
  return (
    <div
      className={`sticky right-10 grid grid-flow-col auto-cols-auto z-55`}
      style={{
        bottom: `${distanceFromBottom}px`,
        transition: "bottom 0.3s ease-out",
      }}
    >
      <div className="w-full h-fit grid grid-flow-col auto-cols-auto col-start-1 bottom-10 pr-6 absolute col-start-1">
        <div className="relative w-fit h-16 grid grid-flow-col auto-cols-auto bg-gradient-to-r from-white to-offBlack rounded-lg p-2 sticky font-arcade text-offBlack border-2 border-offBlack justify-self-end self-center">
          <div className="relative w-fit h-fit col-start-1 place-self-center px-4 py-2">
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexingModal;
