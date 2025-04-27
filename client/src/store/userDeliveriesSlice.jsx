import { createSlice } from "@reduxjs/toolkit"

const initVal = {
    userDeliveries:{
        user_id:null,
        address:null,
        purchase:null,
        status:null,
    }
}

const userDeliveriesSlice = createSlice({
    name:"userDeliveries",
    initialState:initVal,
    reducers:{
        setUserDeliveries:(state,action)=>{
            state.userDeliveries.user_id=action.payload.user_id
            state.userDeliveries.address=action.payload.address
            state.userDeliveries.purchase=action.payload.purchase
            state.userDeliveries.status=action.payload.status
            console.log("in state:",state);

        },
        clearUserDeliveries(state) {
            state.userDeliveries.user_id=null
            state.userDeliveries.address=null
            state.userDeliveries.purchase=null
            state.userDeliveries.status=null
            console.log("cleared userDeliveries");
        }
    }
})

export const {setUserDeliveries,clearUserDeliveries} = userDeliveriesSlice.actions
export default userDeliveriesSlice.reducer