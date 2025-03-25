import { configureStore } from "@reduxjs/toolkit"
import { persistReducer } from "redux-persist"
import tokenSlice from "./tokenSlice"
import persistStore from "redux-persist/es/persistStore"
import storage from "redux-persist/lib/storage/session"; 
import overHeadsSlice from "./air-conditioner/overHeadsSlice"
import basketSlice from "./basketSlice"
import companySlice from "./companySlice";
import userDetailsSlice from "./userDetailsSlice";
const persistConfig = {
    key: "root",
    storage
}
// const persistedReducer = persistReducer(persistConfig, tokenSlice,overHeadsSlice, basketSlice)

const persistedTokenReducer = persistReducer(persistConfig, tokenSlice)
const persistedOverHeadsReducer = persistReducer(persistConfig, overHeadsSlice)
const persistedBasketReducer = persistReducer(persistConfig, basketSlice)
const persistedCompaniesReducer = persistReducer(persistConfig, companySlice)
const persistedUserDetailsReducer = persistReducer(persistConfig, userDetailsSlice)


const myStore = configureStore({
    reducer: {
        token: persistedTokenReducer,
        overheads: persistedOverHeadsReducer,
        basket:  persistedBasketReducer,
        company : persistedCompaniesReducer,
        userDetails: persistedUserDetailsReducer,
    }
})

export const persistor = persistStore(myStore)
export default myStore