import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    overheads:"null"
}

const overHeadsSlice = createSlice({
    name:"overheads",
    initialState:initVal,
    reducers:{
        setOverheads:(state,action)=>{
            state.overheads=action.payload
            console.log(state.overheads);
        },
        clearOverheads(state) {
            state.overheads = null;
        }
    }
})

export const {setOverheads,clearOverheads} = overHeadsSlice.actions
export default overHeadsSlice.reducer