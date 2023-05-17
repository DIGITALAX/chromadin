import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";
import authStatusReducer from "./reducers/authStatusSlice";
import lensProfileReducer from "./reducers/lensProfileSlice";
import mainVideoReducer from "./reducers/mainVideoSlice";
import viewReducer from "./reducers/viewSlice";
import mainNFTReducer from "./reducers/mainNFTSlice";
import indexModalReducer from "./reducers/indexModalSlice";
import dispatcherReducer from "./reducers/dispatcherSlice";
import postImageReducer from "./reducers/postImageSlice";
import collectValueTypeReducer from "./reducers/collectValueTypeSlice";
import optionsReducer from "./reducers/optionsSlice";
import productTypeReducer from "./reducers/productTypeSlice";
import collectionsReducer from "./reducers/collectionsSlice";
import modalReducer from "./reducers/modalSlice";
import purchaseReducer from "./reducers/purchaseSlice";
import approvalArgsReducer from "./reducers/approvalArgsSlice";
import postCollectReducer from "./reducers/postCollectSlice";
import followerOnlyReducer from "./reducers/followerOnlySlice";
import noHandleReducer from "./reducers/noHandleSlice";
import imageViewerReducer from "./reducers/imageViewerSlice";
import channelsReducer from "./reducers/channelsSlice";
import collectOpenReducer from "./reducers/collectOpenSlice";
import reactIdReducer from "./reducers/reactIdSlice";
import secondaryCommentReducer from "./reducers/secondaryCommentSlice";
import canCommentReducer from "./reducers/canCommentSlice";
import errorReducer from "./reducers/errorSlice";
import successReducer from "./reducers/successSlice";
import historyReducer from "./reducers/historySlice";
import ratesReducer from "./reducers/ratesSlice";
import statsReducer from "./reducers/statsSlice";
import piesReducer from "./reducers/piesSlice";
import graphReducer from "./reducers/graphSlice";
import isCreatorReducer from "./reducers/isCreatorSlice";
import priceFilterReducer from "./reducers/priceFilterSlice";
import dateFilterReducer from "./reducers/dateFilterSlice";
import searchReducer from "./reducers/searchSlice";
import dropsReducer from "./reducers/dropsSlice";
import commentFeedCountReducer from "./reducers/commentFeedCountSlice";
import reactionFeedCountReducer from "./reducers/reactionFeedCountSlice";
import reactionStateReducer from "./reducers/reactionStateSlice";
import openCommentReducer from "./reducers/openCommentSlice";
import feedTypeReducer from "./reducers/feedTypeSlice";
import imageFeedViewerReducer from "./reducers/imageFeedViewerSlice";
import feedReactIdReducer from "./reducers/feedReactIdSlice";
import feedReducer from "./reducers/feedSlice";
import commentReducer from "./reducers/commentSlice";
import paginatedReducer from "./reducers/paginatedSlice";
import scrollPosReducer from "./reducers/scrollPosSlice";
import individualFeedCountReducer from "./reducers/individualFeedCountReducer";
import fullScreenVideoReducer from "./reducers/fullScreenVideoSlice";
import videoSyncReducer from "./reducers/videoSyncSlice";
import seekSecondReducer from "./reducers/seekSecondSlice";
import videoCountReducer from "./reducers/videoCountSlice";
import profileReducer from "./reducers/profileSlice";
import profileFeedCountReducer from "./reducers/profileFeedCountSlice";
import profileFeedReducer from "./reducers/profileFeedSlice";
import profilePaginatedReducer from "./reducers/profilePaginatedSlice";
import profileScrollPosReducer from "./reducers/profileScrollPosSlice";
import quickProfilesReducer from "./reducers/quickProfilesSlice";
import historyURLReducer from "./reducers/historyURLSlice";
import superFollowReducer from "./reducers/superFollowSlice";
import rainReducer from "./reducers/rainSlice";

const reducer = combineReducers({
  authStatusReducer,
  lensProfileReducer,
  mainVideoReducer,
  viewReducer,
  mainNFTReducer,
  indexModalReducer,
  dispatcherReducer,
  postImageReducer,
  collectValueTypeReducer,
  optionsReducer,
  productTypeReducer,
  collectionsReducer,
  modalReducer,
  purchaseReducer,
  approvalArgsReducer,
  postCollectReducer,
  followerOnlyReducer,
  noHandleReducer,
  imageViewerReducer,
  channelsReducer,
  collectOpenReducer,
  reactIdReducer,
  secondaryCommentReducer,
  canCommentReducer,
  errorReducer,
  successReducer,
  historyReducer,
  ratesReducer,
  piesReducer,
  statsReducer,
  graphReducer,
  isCreatorReducer,
  priceFilterReducer,
  dateFilterReducer,
  searchReducer,
  dropsReducer,
  feedTypeReducer,
  openCommentReducer,
  reactionStateReducer,
  commentFeedCountReducer,
  reactionFeedCountReducer,
  imageFeedViewerReducer,
  feedReactIdReducer,
  feedReducer,
  commentReducer,
  paginatedReducer,
  scrollPosReducer,
  individualFeedCountReducer,
  fullScreenVideoReducer,
  videoSyncReducer,
  seekSecondReducer,
  videoCountReducer,
  profileReducer,
  profileFeedCountReducer,
  profileFeedReducer,
  profilePaginatedReducer,
  profileScrollPosReducer,
  quickProfilesReducer,
  historyURLReducer,
  superFollowReducer,
  rainReducer,
});

export const store = configureStore({
  reducer: {
    app: reducer,
  },
  middleware: (getDefaultMiddleware: any) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
