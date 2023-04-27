import { FunctionComponent } from "react";
import useViewer from "./hooks/useViewer";
import Vending from "./modules/Vending";
import { useDispatch } from "react-redux";
import Sampler from "./modules/Sampler";

const SwitchView: FunctionComponent = (): JSX.Element => {
  const { viewer } = useViewer();
  const dispatch = useDispatch();

  switch (viewer) {
    case "collect":
      return <Vending dispatch={dispatch} />;

    case "sampler":
      return <Sampler />;

    default:
      return <></>;
  }
};

export default SwitchView;
