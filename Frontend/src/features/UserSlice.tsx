import { createSlice,type PayloadAction } from "@reduxjs/toolkit";

interface UserState{
    user:Record<string, any>
}

const initialState:UserState={
    user:{}
}

const userSlice=createSlice({
    name:"user",
    initialState,
    reducers:{
        loginuser(state, action:PayloadAction<Record<string, any>>){
            state.user=action.payload
       
        },
        logoutuser(state){
            state.user={}

        }
    }
})
export const{loginuser, logoutuser}=userSlice.actions
export default userSlice.reducer