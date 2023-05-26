import { FunctionComponent } from "react";
import { SearchVendingProps } from "./types/buttons.types";

const SearchVending: FunctionComponent<SearchVendingProps> = ({
  handleSearch,
  defaultValue,
}): JSX.Element => {
  return (
    <div
      className={`relative w-fit h-full flex flex-row font-earl text-white text-xs lowercase border border-white rounded-tr-lg rounded-bl-lg justify-end ml-auto ml-auto `}
    >
      <input
        className="relative w-full h-full p-1 bg-black  rounded-tr-lg rounded-bl-lg"
        placeholder={"search"}
        onChange={handleSearch}
        type="text"
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default SearchVending;
