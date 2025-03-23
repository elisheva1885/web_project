import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"
import { persistReducer } from "redux-persist"
import tokenSlice from "./tokenSlice"
import persistStore from "redux-persist/es/persistStore"
import storage from "redux-persist/lib/storage/session"; 
import overHeadsSlice from "./air-conditioner/overHeadsSlice"
import basketSlice from "./basketSlice"
const persistConfig = {
    key: "root",
    storage
}
const persistedReducer = persistReducer(persistConfig, tokenSlice,overHeadsSlice, basketSlice)


const myStore = configureStore({
    reducer: {
        token: persistedReducer,
        overheads: persistedReducer,
        basket:  persistedReducer,
    }
})

export const persistor = persistStore(myStore)
export default myStore