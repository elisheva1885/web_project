import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    userDetails:{
        userName:"",
        password: ""
    }
}

const userDetailsSlice = createSlice({
    name:"userDetails",
    initialState:initVal,
    reducers:{
        setUserDetails:(state,action)=>{
            state.userDetails=action.payload
            console.log(state.userDetails);
        },
        clearUserDetails(state) {
            state.userDetails = null;
        }
    }
})

export const {setUserDetails,clearUserDetails} = userDetailsSlice.actions
export default userDetailsSlice.reducer