import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    multiOutdoorUnits:null
}

const multiOutdoorUnitsSlice = createSlice({
    name:"multiOutdoorUnits",
    initialState:initVal,
    reducers:{
        setMultiOutdoorUnits:(state,action)=>{
            state.multiOutdoorUnits=action.payload
            console.log(state.multiOutdoorUnits);

        },
        clearMultiOutdoorUnits(state) {
            state.multiOutdoorUnits = null;
        }
    }
})

export const {setMultiOutdoorUnits,clearMultiOutdoorUnits} = multiOutdoorUnitsSlice.actions
export default multiOutdoorUnitsSlice.reducer