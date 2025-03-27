import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    companies:[]
}

const companySlice = createSlice({
    name:"companies",
    initialState:initVal,
    reducers:{
        setCompanies:(state,action)=>{
            state.companies=action.payload
            console.log("companies:",state.companies);
        },
        clearCompanies(state) {
            state.companies = null;
        }
    }
})

// export const {setCompanies,clearCompanies} = companySlice.actions
// export default companySlice.reducer
export const {setCompanies,clearCompanies} = companySlice.actions
export default companySlice.reducer