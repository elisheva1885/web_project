
import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage/session"; // או 'redux-persist/lib/storage' אם תרצי להשתמש ב-localStorage
import { combineReducers } from "@reduxjs/toolkit";

// יבוא הסלאייסים
import tokenSlice from "./tokenSlice";
import overHeadsSlice from "./air-conditioner/overHeadsSlice";
import basketSlice from "./basketSlice";
import companiesSlice from "./companySlice";
import userDetailsSlice from "./userDetailsSlice";
import miniCenteralSlice from "./air-conditioner/miniCenteralsSlice";
import multiIndoorUnitsSlice from "./air-conditioner/multiIndoorUnitsSlice";
import userDeliveriesSlice from "./userDeliveriesSlice";

// חיבור הסלאייסים עם rootReducer
const rootReducer = combineReducers({
  token: tokenSlice,
  overheads: overHeadsSlice,
  basket: basketSlice,
  companies: companiesSlice,
  userDetails: userDetailsSlice,
  miniCenterals: miniCenteralSlice,
  multiIndoorUnits: multiIndoorUnitsSlice,
  userDeliveries: userDeliveriesSlice
});

// הגדרת persist
const persistConfig = {
  key: "root",
  storage, // נשמור את המידע ב-sessionStorage. אפשר להחליף ל-localStorage אם רוצים
  whitelist: ["token", "basket", "userDetails", "company", "overheads", "miniCenterals", "multiIndoorUnits", "userDeliveries"], // רק את אלה שברצונך לשמור
};

// שימוש ב-persistReducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// יצירת ה-store
const myStore = configureStore({
  reducer: persistedReducer, // פה מחברים את ה-rootReducer ל-persistReducer
});

export const persistor = persistStore(myStore); // יצירת ה-persistor

export default myStore;