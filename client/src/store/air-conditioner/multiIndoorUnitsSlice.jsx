import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    multiIndoorUnits:null
}

const multiIndoorUnitsSlice = createSlice({
    name:"multiIndoorUnits",
    initialState:initVal,
    reducers:{
        setMultiIndoorUnits:(state,action)=>{
            state.multiIndoorUnits=action.payload
            // console.log(state.multiIndoorUnits);

        },
        clearMultiIndoorUnits(state) {
            state.multiIndoorUnits = null;
        }
    }
})

export const {setMultiIndoorUnits,clearMultiIndoorUnits} = multiIndoorUnitsSlice.actions
export default multiIndoorUnitsSlice.reducer