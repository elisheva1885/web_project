import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    userDetails:{
        username:"null",
        role: "null"
    }
}

const userDetailsSlice = createSlice({
    name:"userDetails",
    initialState:initVal,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userDetails=action.payload
            console.log(state.userDetails);
            alert("setUserDetails")
        },
        clearUserDetails(state) {
            state.userDetails = null;
        }
    }
})

export const {setUserDetails,clearUserDetails} = userDetailsSlice.actions
export default userDetailsSlice.reducer