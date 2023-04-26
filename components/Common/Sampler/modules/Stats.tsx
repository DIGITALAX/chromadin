import { FunctionComponent } from "react";

const Stats: FunctionComponent = ({ statTitles }): JSX.Element => {
  return (
    <div className="relative w-full h-96 max-w-full">
      <div className="grid grid-flow-col auto-cols-auto gap-3 overflow-x-auto max-w-full h-full relative">
        {/* {statTitles.map((value: string, index: number) => {
            return (
              <div
                key={index}
                className="relative w-60 h-full flex flex-col bg-black/60 rounded-lg p-3"
              >
                <div className="relative w-full h-fit justify-end items-center flex">
                  <div className="relative h-2 w-2 rounded-full bg-verde/50"></div>
                </div>
                <div className="relative w-full h-fit text-white font-arcade text-xs flex items-center justify-start">
                  {value}
                </div>
                <div className="relative w-full h-40 gap-2 grid grid-flow-row auto-rows-auto overflow-y-scroll p-4">
                  {Array.from({ length: 10 }).map((_, index: number) => {
                    return (
                      <div
                        key={index}
                        className="relative bg-black rounded-lg flex flex-row w-full h-10"
                      ></div>
                    );
                  })}
                </div>
              </div>
            );
          })} */}
      </div>
    </div>
  );
};

export default Stats;
