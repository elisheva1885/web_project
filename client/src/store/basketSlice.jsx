import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    basket:null
}

const basketSlice = createSlice({
    name:"basket",
    initialState:initVal,
    reducers:{
        setBasket:(state,action)=>{
            state.basket=action.payload
        },
        clearBasket(state) {
            state.basket = null;
        }
    }
})

export const {setBasket,clearBasket} = basketSlice.actions
export default basketSlice.reducer