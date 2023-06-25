import { LENS_HUB_PROXY_ADDRESS_MATIC } from "@/lib/constants";
import {
  ClipboardEvent,
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useContractWrite,
  usePrepareContractWrite,
  useSignTypedData,
} from "wagmi";
import LensHubProxy from "../../../../abis/LensHubProxy.json";
import handleIndexCheck from "@/lib/helpers/handleIndexCheck";
import {
  createCommentTypedData,
  createDispatcherCommentData,
} from "@/graphql/lens/mutations/comment";
import { RootState } from "@/redux/store";
import { splitSignature } from "ethers/lib/utils.js";
import broadcast from "@/graphql/lens/mutations/broadcast";
import { omit } from "lodash";
import uploadPostContent from "@/lib/helpers/uploadPostContent";
import {
  getCommentData,
  removeCommentData,
  setCommentData,
} from "@/lib/lens/utils";
import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import { setIndexModal } from "@/redux/reducers/indexModalSlice";
import getCommentHTML from "@/lib/helpers/commentHTML";
import { Profile } from "@/components/Home/types/lens.types";
import getCaretPos from "@/lib/helpers/getCaretPos";
import { searchProfile } from "@/graphql/lens/queries/search";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import { waitForTransaction } from "@wagmi/core";
import { setCollectOpen } from "@/redux/reducers/collectOpenSlice";
import useImageUpload from "./useImageUpload";
import { setImageLoadingRedux } from "@/redux/reducers/imageLoadingSlice";

const useComment = () => {
  const [commentLoading, setCommentLoading] = useState<boolean>(false);
  const [commentArgs, setCommentArgs] = useState<any>();
  const [commentDescription, setCommentDescription] = useState<string>("");
  const [caretCoord, setCaretCoord] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [gifOpen, setGifOpen] = useState<boolean>(false);
  const [profilesOpen, setProfilesOpen] = useState<boolean>(false);
  const textElement = useRef<HTMLTextAreaElement>(null);
  const preElement = useRef<HTMLPreElement>(null);
  const [mentionProfiles, setMentionProfiles] = useState<Profile[]>([]);
  const [results, setResults] = useState<any>([]);
  const [gifs, setGifs] = useState<UploadedMedia[]>(
    JSON.parse(getCommentData() || "{}").images || []
  );
  const [searchGif, setSearchGif] = useState<boolean>(false);
  const [commentHTML, setCommentHTML] = useState<string>("");
  const [contentURI, setContentURI] = useState<string>();
  const { signTypedDataAsync } = useSignTypedData();
  const { uploadImage } = useImageUpload();
  const dispatch = useDispatch();
  const profileId = useSelector(
    (state: RootState) => state.app.lensProfileReducer.profile?.id
  );
  const mainVideo = useSelector(
    (state: RootState) => state.app.mainVideoReducer
  );
  const collectOpen = useSelector(
    (state: RootState) => state.app.collectOpenReducer.value
  );
  const commentId = useSelector(
    (state: RootState) => state.app.secondaryCommentReducer.value
  );
  const dispatcher = useSelector(
    (state: RootState) => state.app.dispatcherReducer.value
  );
  const postImages = useSelector(
    (state: RootState) => state?.app?.postImageReducer?.value
  );
  const collectModuleType = useSelector(
    (state: RootState) => state?.app?.collectValueTypeReducer?.type
  );

  const { config: commentConfig, isSuccess: commentSuccess } =
    usePrepareContractWrite({
      address: LENS_HUB_PROXY_ADDRESS_MATIC,
      abi: LensHubProxy,
      functionName: "commentWithSig",
      enabled: Boolean(commentArgs),
      args: [commentArgs],
    });

  const { writeAsync: commentWriteAsync } = useContractWrite(commentConfig);

  const handleGif = (e: FormEvent): void => {
    setSearchGif((e.target as HTMLFormElement).value);
  };

  const handleGifSubmit = async (): Promise<void> => {
    const getGifs = await fetch("/api/giphy", {
      method: "POST",
      body: JSON.stringify(searchGif),
    });
    const allGifs = await getGifs.json();
    setResults(allGifs?.json?.results);
  };

  const handleSetGif = (result: any): void => {
    if ((postImages as any)?.length < 4) {
      setGifs([
        ...(postImages as any),
        {
          cid: result,
          type: MediaType.Gif,
        },
      ]);
      const postStorage = JSON.parse(getCommentData() || "{}");
      setCommentData(
        JSON.stringify({
          ...postStorage,
          images: [
            ...(postImages as any),
            {
              cid: result,
              type: MediaType.Gif,
            },
          ],
        })
      );
    }
  };

  const handleKeyDownDelete = (e: KeyboardEvent<Element>) => {
    const highlightedContent = document.querySelector("#highlighted-content")!;
    const selection = window.getSelection();
    const postStorage = JSON.parse(getCommentData() || "{}");
    if (e.key === "Backspace" && selection?.toString() !== "") {
      const start = textElement.current!.selectionStart;
      const end = textElement.current!.selectionEnd;

      if (start === 0 && end === textElement.current!.value?.length) {
        setCommentDescription("");
        setCommentHTML("");
        // highlightedContent.innerHTML = "";
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: "",
          })
        );
      } else {
        const selectedText = selection!.toString();
        const selectedHtml = highlightedContent.innerHTML.substring(start, end);
        const strippedHtml = selectedHtml?.replace(
          /( style="[^"]*")|( style='[^']*')/g,
          ""
        );
        const strippedText = selectedText?.replace(/<[^>]*>/g, "");

        const newHTML =
          commentHTML.slice(0, start) + strippedHtml + commentHTML.slice(end);
        const newDescription =
          commentDescription.slice(0, start) +
          strippedText +
          commentDescription.slice(end);

        setCommentHTML(newHTML);
        setCommentDescription(newDescription);
        (e.currentTarget! as any).value = newDescription;
        // highlightedContent.innerHTML = newHTML;
        setCommentData(
          JSON.stringify({
            ...postStorage,
            post: newDescription,
          })
        );
      }
    } else if (
      e.key === "Backspace" &&
      commentDescription?.length === 0 &&
      commentHTML?.length === 0
    ) {
      (e.currentTarget! as any).value = "";
      // highlightedContent.innerHTML = "";
      setCommentData(
        JSON.stringify({
          ...postStorage,
          post: "",
        })
      );
      e.preventDefault();
    }
  };

  const handleCommentDescription = async (e: any): Promise<void> => {
    let resultElement = document.querySelector("#highlighted-content");
    const newValue = e.target.value.endsWith("\n")
      ? e.target.value + " "
      : e.target.value;
    setCommentHTML(getCommentHTML(e, resultElement as Element));
    setCommentDescription(newValue);
    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: e.target.value,
      })
    );
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
        "@" &&
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1]
        ?.length === 1
    ) {
      setCaretCoord(getCaretPos(e, textElement));
      setProfilesOpen(true);
    }
    if (
      e.target.value.split(" ")[e.target.value.split(" ")?.length - 1][0] ===
      "@"
    ) {
      const allProfiles = await searchProfile({
        query: e.target.value.split(" ")[e.target.value.split(" ")?.length - 1],
        type: "PROFILE",
        limit: 10,
      });
      setMentionProfiles(allProfiles?.data?.search?.items);
    } else {
      setProfilesOpen(false);
      setMentionProfiles([]);
    }
  };

  const clearComment = () => {
    setCommentLoading(false);
    setCommentDescription("");
    setCommentHTML("");
    setGifs([]);
    dispatch(setPostImages([]));
    dispatch(setCollectOpen(false));
    setGifOpen(false);
    // (document as any).querySelector("#highlighted-content").innerHTML = "";
    removeCommentData();
    dispatch(
      setIndexModal({
        actionValue: true,
        actionMessage: "Indexing Interaction",
      })
    );
  };

  const commentVideo = async (): Promise<void> => {
    if (
      (!commentDescription ||
        commentDescription === "" ||
        commentDescription.trim()?.length < 0) &&
      (!postImages?.length || postImages?.length < 1)
    ) {
      return;
    }
    setCommentLoading(true);
    let result: any;
    try {
      const contentURIValue = await uploadPostContent(
        postImages,
        commentDescription,
        setContentURI,
        contentURI,
        dispatch
      );
      if (dispatcher) {
        result = await createDispatcherCommentData({
          profileId: profileId,
          publicationId: commentId !== "" ? commentId : mainVideo.id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });
        clearComment();
        setTimeout(async () => {
          await handleIndexCheck(
            result?.data?.createCommentViaDispatcher?.txHash,
            dispatch,
            true
          );
        }, 7000);
      } else {
        result = await createCommentTypedData({
          profileId: profileId,
          publicationId: commentId !== "" ? commentId : mainVideo.id,
          contentURI: "ipfs://" + contentURIValue,
          collectModule: collectModuleType,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        });

        const typedData: any = result.data.createCommentTypedData.typedData;

        const signature: any = await signTypedDataAsync({
          domain: omit(typedData?.domain, ["__typename"]),
          types: omit(typedData?.types, ["__typename"]) as any,
          value: omit(typedData?.value, ["__typename"]) as any,
        });

        const broadcastResult: any = await broadcast({
          id: result?.data?.createCommentTypedData?.id,
          signature,
        });

        if (broadcastResult?.data?.broadcast?.__typename !== "RelayerResult") {
          const { v, r, s } = splitSignature(signature);

          const commentArgs = {
            profileId: typedData.value.profileId,
            contentURI: typedData.value.contentURI,
            profileIdPointed: typedData.value.profileIdPointed,
            pubIdPointed: typedData.value.pubIdPointed,
            referenceModuleData: typedData.value.referenceModuleData,
            referenceModule: typedData.value.referenceModule,
            referenceModuleInitData: typedData.value.referenceModuleInitData,
            collectModule: typedData.value.collectModule,
            collectModuleInitData: typedData.value.collectModuleInitData,
            sig: {
              v,
              r,
              s,
              deadline: typedData.value.deadline,
            },
          };
          setCommentArgs(commentArgs);
        } else {
          clearComment();
          setTimeout(async () => {
            await handleIndexCheck(
              broadcastResult?.data?.broadcast?.txHash,
              dispatch,
              true
            );
          }, 7000);
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setCommentLoading(false);
  };

  const handleCommentWrite = async (): Promise<void> => {
    setCommentLoading(true);
    try {
      const tx = await commentWriteAsync?.();
      clearComment();
      const res = await waitForTransaction({
        hash: tx?.hash!,
      });
      await handleIndexCheck(res?.transactionHash, dispatch, true);
    } catch (err) {
      console.error(err);
      setCommentLoading(false);
    }
  };

  const handleImagePaste = async (
    e: ClipboardEvent<HTMLTextAreaElement>
  ) => {
    dispatch(setImageLoadingRedux(true));
    const items = e.clipboardData?.items;
    if (!items) return;
    let files: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        e.preventDefault();
        e.stopPropagation();
        const file = items[i].getAsFile();
        files.push(file as File); // Add the File to the array.
      }
    }
    if (files.length > 0) {
      await uploadImage(files, true);
      dispatch(setImageLoadingRedux(false));
    } else {
      dispatch(setImageLoadingRedux(false));
    }
  };

  const handleMentionClick = (user: any) => {
    setProfilesOpen(false);
    let resultElement = document.querySelector("#highlighted-content");
    const newHTMLPost =
      commentHTML?.substring(0, commentHTML.lastIndexOf("@")) +
      `@${user?.handle}</span>`;
    const newElementPost =
      commentDescription?.substring(0, commentDescription.lastIndexOf("@")) +
      `@${user?.handle}`;
    setCommentDescription(newElementPost);

    const postStorage = JSON.parse(getCommentData() || "{}");
    setCommentData(
      JSON.stringify({
        ...postStorage,
        post: newElementPost,
      })
    );

    // if (newHTMLPost) (resultElement as any).innerHTML = newHTMLPost;
    setCommentHTML(newHTMLPost);
  };

  useEffect(() => {
    if (commentSuccess) {
      handleCommentWrite();
    }
  }, [commentSuccess]);

  useEffect(() => {
    const savedData = getCommentData();
    if (savedData && JSON.parse(savedData).post) {
      setCommentDescription(JSON.parse(savedData).post);

      let resultElement = document.querySelector("#highlighted-content");
      if (
        JSON.parse(savedData).post[JSON.parse(savedData).post?.length - 1] ==
        "\n"
      ) {
        JSON.parse(savedData).post += " ";
      }
      setCommentHTML(
        getCommentHTML(
          JSON.parse(savedData).post,
          resultElement as Element,
          true
        )
      );
    }
  }, []);

  useEffect(() => {
    dispatch(setPostImages(gifs));
  }, [gifs]);

  useEffect(() => {
    if (document.querySelector("#highlighted-content")) {
      document.querySelector("#highlighted-content")!.innerHTML =
        commentHTML.length === 0 ? "Have something to say?" : commentHTML;
    }
  }, [commentHTML, gifOpen, collectOpen]);

  return {
    commentVideo,
    commentDescription,
    textElement,
    handleCommentDescription,
    commentLoading,
    caretCoord,
    mentionProfiles,
    profilesOpen,
    handleMentionClick,
    handleGifSubmit,
    handleGif,
    results,
    gifs,
    handleSetGif,
    gifOpen,
    setGifOpen,
    handleKeyDownDelete,
    preElement,
    handleImagePaste,
  };
};

export default useComment;
