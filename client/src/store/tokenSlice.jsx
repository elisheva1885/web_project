import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    token:"tokenisnull"
}

const tokenSlice = createSlice({
    name:"token",
    initialState:initVal,
    reducers:{
        setToken:(state,action)=>{
            state.token=action.payload
            console.log(state.token);
        },
        clearToken(state) {
            state.token = null;
        }
    }
})

export const {setToken,clearToken} = tokenSlice.actions
export default tokenSlice.reducer