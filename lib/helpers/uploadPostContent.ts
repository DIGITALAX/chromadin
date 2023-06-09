import { PostImage, UploadedMedia } from "@/components/Home/types/home.types";
import { setIPFS } from "@/redux/reducers/IPFSSlice";
import lodash from "lodash";
import { AnyAction, Dispatch } from "redux";
import { v4 as uuidv4 } from "uuid";

const uploadPostContent = async (
  postImages: UploadedMedia[] | undefined,
  postDescription: string,
  setContentURI: (e: string | undefined) => void,
  contentURI: string | undefined,
  dispatch: Dispatch<AnyAction>
): Promise<string | undefined> => {
  let newImages: PostImage[] = [];
  postImages?.forEach((image) => {
    newImages.push({
      item: image.type !== 2 ? "ipfs://" + image.cid : image.cid,
      type:
        image.type === 1
          ? "image/png"
          : image.type === 2
          ? "image/gif"
          : "video/mp4",
      altTag: image.cid,
    });
  });

  const coverImage = lodash.filter(newImages, (image: PostImage) => {
    if (image.type === "image/png" || image.type === "image/gif") return true;
  });
  const videos = lodash.filter(newImages, (image: PostImage) => {
    if (image.type === "video/mp4") return true;
  });

  const data = {
    version: "2.0.0",
    metadata_id: uuidv4(),
    description:
      postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    content:
      postDescription.length < 0 || postDescription.trim().length < 0
        ? null
        : postDescription,
    external_url: "https://www.chromadin.xyz/",
    image: coverImage.length > 0 ? (coverImage[0] as any).item : null,
    imageMimeType: "image/png",
    name: postDescription ? postDescription?.slice(0, 20) : "Chromadin",
    mainContentFocus:
      videos?.length > 0
        ? "VIDEO"
        : newImages.length > 0
        ? "IMAGE"
        : postDescription?.length > 270
        ? "ARTICLE"
        : "TEXT_ONLY",
    contentWarning: null,
    attributes: [],
    media: newImages,
    locale: "en",
    tags: null,
    appId: "chromadin",
  };

  try {
    const response = await fetch("/api/ipfs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (response.status !== 200) {
    } else {
      let responseJSON = await response.json();
      setContentURI(responseJSON.cid);
      return responseJSON.cid;
    }
  } catch (err: any) {
    dispatch(setIPFS(true));
    console.error(err.message);
  }
  return contentURI;
};

export default uploadPostContent;
