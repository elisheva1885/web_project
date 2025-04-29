import { createSlice } from "@reduxjs/toolkit";

const initVal = {
    userDeliveries: [] // Array of delivery objects
};

const userDeliveriesSlice = createSlice({
    name: "userDeliveries",
    initialState: initVal,
    reducers: {
        setUserDeliveries: (state, action) => {
            // Add a new delivery object to the array
            state.userDeliveries = action.payload;
            console.log("userDeliveriesSlice", state.userDeliveries);
        },
        clearUserDeliveries: (state) => {
            // Clear all deliveries by resetting the array
            state.userDeliveries = [];
            console.log("cleared userDeliveries");
        }
    }
});

export const { setUserDeliveries, clearUserDeliveries } = userDeliveriesSlice.actions;
export default userDeliveriesSlice.reducer;