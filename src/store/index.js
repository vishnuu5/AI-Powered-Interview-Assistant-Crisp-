import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import sessionReducer from "./slices/sessionSlice";
import candidatesReducer from "./slices/candidatesSlice";

const rootReducer = combineReducers({
  session: sessionReducer,
  candidates: candidatesReducer,
});

const persistConfig = {
  key: "crisp-ai",
  storage,
};

const persisted = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
