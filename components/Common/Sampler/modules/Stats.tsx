import { FunctionComponent } from "react";
import StatModule from "./StatModule";

const Stats: FunctionComponent = (): JSX.Element => {
  return (
    <div className="relative w-full h-3/5 flex flex-row overflow-y-scroll gap-3">
      {Array.from({ length: 10 }).map((value: any, index: number) => {
        return <StatModule key={index} />;
      })}
    </div>
  );
};

export default Stats;
