const descriptionRegex = (description: string, messages?: boolean) => {
  const lines = description?.split(/[\r\n]+/);
  const styledLines = lines?.map((line: string) => {
    const words = line.split(" ");
    const styledWords = words.map((word: string) => {
      if (word[0] === "#") {
        if (messages) {
          return `<em id="hashtags" style="color: #ff494a; cursor: pointer; font-style: normal;">${word}</em>`;
        } else {
          return `<em id="hashtags" style="color: #81A8F8; cursor: pointer; font-style: normal;">${word}</em>`;
        }
      } else if (word[0] === "@") {
        if (messages) {
          return `
            <a href="${`https://chromadin.xyz/#wavs?option=history&profile=${
              word?.replace("@", "")?.split(".lens")[0]
            }`}" rel="noreferrer" target="_blank" style="margin-right: 4px;">
              <span style="color: #ff494a;">${word}</span>
            </a>
          `;
        } else {
          return `
            <a href="${`https://chromadin.xyz/#wavs?option=history&profile=${
              word?.replace("@", "")?.split(".lens")[0]
            }`}" target="_blank" rel="noreferrer" style="margin-right: 4px;">
              <span style="color: #81A8F8;">${word?.split(".lens")[0]}</span>
            </a>
          `;
        }
      } else if (
        (word[0] === "h" &&
          word[1] === "t" &&
          word[2] === "t" &&
          word[3] === "p") ||
        (word[0] && word[1] && word[2] === "w" && word[3] === ".") ||
        (word[word.length] === "z" &&
          word[word.length - 1] === "y" &&
          word[word.length - 2] === "x" &&
          word[word.length - 3] === ".") ||
        (word[word.length] === "m" &&
          word[word.length - 1] === "o" &&
          word[word.length - 2] === "c" &&
          word[word.length - 3] === ".")
      ) {
        if (messages) {
          return `
            <a href=${
              word?.includes("//") ? word : `//${word}`
            } target="_blank" rel="noreferrer">
              <span style="color: #ff494a;">${word}</span>
            </a>
          `;
        } else {
          return `
            <a href=${
              word?.includes("//") ? word : `//${word}`
            } target="_blank" rel="noreferrer">
              <span style="color: #81A8F8;">${word}</span>
            </a>
          `;
        }
      } else {
        return word;
      }
    });
    const styledLine = `<span>${styledWords?.join(" ")}</span>`;
    return styledLine;
  });
  const formattedDescription = styledLines?.join("<br /><br />");
  return `<div>${formattedDescription}</div>`;
};

export default descriptionRegex;
