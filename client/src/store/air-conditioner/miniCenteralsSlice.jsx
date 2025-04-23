import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    miniCenterals:null
}

const miniCenteralsSlice = createSlice({
    name:"miniCenterals",
    initialState:initVal,
    reducers:{
        setMiniCenterals:(state,action)=>{
            state.miniCenterals=action.payload
            console.log(state.miniCenterals);

        },
        clearMiniCenterals(state) {
            state.miniCenterals = null;
        }
    }
})

export const {setMiniCenterals,clearMiniCenterals} = miniCenteralsSlice.actions
export default miniCenteralsSlice.reducer