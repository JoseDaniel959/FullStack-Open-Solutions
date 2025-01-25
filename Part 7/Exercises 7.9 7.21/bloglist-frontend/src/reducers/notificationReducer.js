import { createSlice } from "@reduxjs/toolkit";

export const notificationSlice = createSlice({
    name:'notification',
    initialState:false,
    reducers:{
        turnOnNotification(state,action){
            return action.payload
        }
    }
})


export const {turnOnNotification} = notificationSlice.actions

