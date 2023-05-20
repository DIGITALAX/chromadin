import { MediaType, UploadedMedia } from "@/components/Home/types/home.types";
import {
  getCommentData,
  getPostData,
  setCommentData,
  setPostData,
} from "@/lib/lens/utils";
import { RootState } from "@/redux/store";
import { FormEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import lodash from "lodash";
import { setPostImages } from "@/redux/reducers/postImageSlice";
import compressImageFiles from "@/lib/helpers/compressImageFiles";
import fileLimitAlert from "@/lib/helpers/fileLimitAlert";
import videoLimitAlert from "@/lib/helpers/videoLimitAlert";
import { setPublicationImages } from "@/redux/reducers/publicationImageSlice";

const useImageUpload = () => {
  const page = useSelector((state: RootState) => state.app.viewReducer.value);
  const postOpen = useSelector(
    (state: RootState) => state.app.makePostReducer.value
  );
  const [imageLoading, setImageLoading] = useState<boolean>(false);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [mappedFeaturedFiles, setMappedFeaturedFiles] = useState<
    UploadedMedia[]
  >(
    page !== "chat"
      ? postOpen
        ? JSON.parse(getCommentData() || "{}").images || []
        : JSON.parse(getPostData() || "{}").images || []
      : []
  );
  const dispatch = useDispatch();
  const imagesUploaded = useSelector(
    (state: RootState) => state.app.postImageReducer.value
  );
  const imagesUploadedPub = useSelector(
    (state: RootState) => state.app.publicationImageReducer.value
  );

  const uploadImage = async (
    e: FormEvent | File,
    canvas?: boolean,
    feed?: boolean
  ): Promise<void> => {
    if (!canvas) {
      if ((e as any)?.target?.files?.length < 1) {
        return;
      }
    }
    let finalImages: UploadedMedia[] = [];
    setImageLoading(true);
    if (canvas) {
      try {
        // const compressedImage = await compressImageFiles(e as File);
        const response = await fetch("/api/ipfs", {
          method: "POST",
          body: e as File,
        });
        let cid = await response.json();
        finalImages.push({
          cid: String(cid?.cid),
          type: MediaType.Image,
        });
        setMappedFeaturedFiles([...finalImages]);
      } catch (err: any) {
        console.error(err.message);
      }
      setImageLoading(false);
    } else {
      if (fileLimitAlert((e as any).target.files[0])) {
        setImageLoading(false);
        return;
      }
      Array.from(((e as FormEvent).target as HTMLFormElement)?.files).map(
        async (_, index: number) => {
          try {
            // const compressedImage = await compressImageFiles(
            //   (e as any).target.files[index] as File
            // );
            const response = await fetch("/api/ipfs", {
              method: "POST",
              body: (e as any).target.files[index],
            });
            if (response.status !== 200) {
              setImageLoading(false);
            } else {
              let cid = await response.json();
              finalImages.push({
                cid: String(cid?.cid),
                type: MediaType.Image,
              });
              if (
                finalImages?.length ===
                ((e as FormEvent).target as HTMLFormElement).files?.length
              ) {
                let newArr = [
                  ...(postOpen ? imagesUploadedPub : (imagesUploaded as any)),
                  ...finalImages,
                ];
                setMappedFeaturedFiles(newArr);
                if (feed) {
                  if (postOpen) {
                    const postStorage = JSON.parse(getPostData() || "{}");
                    setPostData(
                      JSON.stringify({
                        ...postStorage,
                        images: newArr,
                      })
                    );
                  } else {
                    const postStorage = JSON.parse(getCommentData() || "{}");
                    setCommentData(
                      JSON.stringify({
                        ...postStorage,
                        images: newArr,
                      })
                    );
                  }
                }

                setImageLoading(false);
              }
            }
          } catch (err: any) {
            console.error(err.message);
          }
        }
      );
    }
  };

  const uploadVideo = async (e: FormEvent, feed?: boolean) => {
    try {
      if ((e as any).target.files.length < 1) {
        return;
      }
      if (videoLimitAlert((e as any).target.files[0])) {
        return;
      }
      setVideoLoading(true);
      const response = await fetch("/api/ipfs", {
        method: "POST",
        body: (e.target as HTMLFormElement).files[0],
      });
      let cid = await response.json();
      let newArr = [
        ...(postOpen ? imagesUploadedPub : (imagesUploaded as any)),
        { cid: String(cid?.cid), type: MediaType.Video },
      ];
      setMappedFeaturedFiles(newArr);

      if (feed) {
        if (postOpen) {
          const postStorage = JSON.parse(getPostData() || "{}");
          setPostData(
            JSON.stringify({
              ...postStorage,
              images: newArr,
            })
          );
        } else {
          const postStorage = JSON.parse(getCommentData() || "{}");
          setCommentData(
            JSON.stringify({
              ...postStorage,
              images: newArr,
            })
          );
        }
      }
    } catch (err: any) {
      console.error(err.message);
    }
    setVideoLoading(false);
  };

  const handleRemoveImage = (image: UploadedMedia, feed?: boolean): void => {
    const cleanedArray = lodash.filter(
      postOpen ? imagesUploadedPub : (imagesUploaded as any),
      (uploaded) => uploaded.cid !== image.cid
    );
    setMappedFeaturedFiles(cleanedArray);

    if (feed) {
      if (postOpen) {
        const postStorage = JSON.parse(getPostData() || "{}");
        setPostData(
          JSON.stringify({
            ...postStorage,
            images: cleanedArray,
          })
        );
      } else {
        const postStorage = JSON.parse(getCommentData() || "{}");
        setCommentData(
          JSON.stringify({
            ...postStorage,
            images: cleanedArray,
          })
        );
      }
    }
  };

  useEffect(() => {
    if (postOpen) {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPublicationImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPublicationImages(mappedFeaturedFiles));
      }
    } else {
      if (mappedFeaturedFiles.length > 3) {
        setMappedFeaturedFiles(mappedFeaturedFiles.slice(0, 4));
        dispatch(setPostImages(mappedFeaturedFiles.slice(0, 4)));
      } else {
        dispatch(setPostImages(mappedFeaturedFiles));
      }
    }
  }, [mappedFeaturedFiles]);

  return {
    uploadImage,
    imageLoading,
    mappedFeaturedFiles,
    handleRemoveImage,
    videoLoading,
    uploadVideo,
  };
};

export default useImageUpload;
