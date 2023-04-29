import { INFURA_GATEWAY } from "@/lib/constants";
import Image from "next/legacy/image";
import { FunctionComponent } from "react";

const Graphs: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-full sm:h-100 xl:h-full flex bg-black/60 rounded-lg flex-col p-4 font-arcade gap-5">
      <div className="relative w-fit h-fit flex items-center justify-center">
        <div className="absolute w-full h-fit -top-1" id={"graphBack"}>
          Leading Interests
        </div>
        <div className="relative w-full h-fit text-white">
          Leading Interests
        </div>
      </div>
      <div className="relative w-full h-full flex flex-col sm:flex-row gap-3 items-center justify-center">
        <div className="relative text-white flex flex-row sm:flex-col text-xs w-full h-fit sm:w-fit sm:h-full items-center justify-center gap-2 preG:flex-nowrap flex-wrap">
          {Array.from([
            ["Qmaox51kA8vJ4db8vCALMCNg4EzawhLD7con39aqAkDTGj", "interests"],
            ["QmVvG9A3GCFeBdhkAopWbf8ao9vgHofzjsHBtXyecP3u9J", "music"],
            ["QmduZ44Ece4CX2qNjkiAjcBNv4Uc95dTLyiSCQo61ajyu5", "art"],
            ["QmW2fNHHvhCXVAL3Wo5CBt1QyiKpczF5dX5Mj9Ja6N7Y4x", "video"],
            ["QmYYCBrqgMJgG1TDHfYqp3qsyVxD3EhFgTtu97CbboiwxQ", "hashtags"],
          ]).map((value: string[], index: number) => {
            return (
              <div
                className="relative w-fit h-fit preG:h-full flex flex-col items-center justify-center"
                key={index}
              >
                <div className="relative w-10 h-10 flex items-center justify-center">
                  <Image
                    src={`${INFURA_GATEWAY}/ipfs/${value[0]}`}
                    layout="fill"
                  />
                </div>
                <div className="relative w-fit h-fit items-center justify-center text-center flex">
                  {value[1]}
                </div>
              </div>
            );
          })}
        </div>
        <div className="relative w-full h-full flex flex-row gap-4">
          <div className="relative w-10 h-full flex items-center justify-center">
            <Image
              src={`${INFURA_GATEWAY}/ipfs/QmbfTiWJyy4r9xi4EsxY5LN1pyW6D2TbFHJrBgmSY3vm8V`}
              layout="fill"
            />
          </div>
          <div className="relative w-full h-full flex flex-row items-end justify-center gap-2">
            {Array.from({ length: 16 }).map((_, index) => {
              return (
                <div
                  key={index}
                  className={`w-full ${
                    index === 0
                      ? "h-full"
                      : index === 1
                      ? "h-[93.75%]"
                      : index === 2
                      ? "h-[87.5%]"
                      : index === 3
                      ? "h-[81.25%]"
                      : index === 4
                      ? "h-[75%]"
                      : index === 5
                      ? "h-[68.75%]"
                      : index === 6
                      ? "h-[62.5%]"
                      : index === 7
                      ? "h-[56.25%]"
                      : index === 8
                      ? "h-[50%]"
                      : index === 9
                      ? "h-[43.75%]"
                      : index === 10
                      ? "h-[37.5%]"
                      : index === 11
                      ? "h-[31.25%]"
                      : index === 12
                      ? "h-[25%]"
                      : index === 13
                      ? "h-[18.75%]"
                      : index === 14
                      ? "h-[12.5%]"
                      : "h-[6.25%]"
                  } relative flex`}
                  id="borderGraph"
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Graphs;
