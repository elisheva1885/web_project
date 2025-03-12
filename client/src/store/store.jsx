import { configureStore } from "@reduxjs/toolkit"
import rootReducer from "./rootReducer"

const myStore = configureStore({
    reducer:rootReducer
})
export default myStore