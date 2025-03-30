import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    userDetails:{
        username:null,
        role:null
    }
}

const userDetailsSlice = createSlice({
    name:"userDetails",
    initialState:initVal,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userDetails.username=action.payload.username
            state.userDetails.role=action.payload.role
            console.log("in state:",state);

        },
        clearUserDetails(state) {
            state.userDetails.username=null
            state.userDetails.role=null
            console.log("cleared userDetails");
        }
    }
})

export const {setUserDetails,clearUserDetails} = userDetailsSlice.actions
export default userDetailsSlice.reducer