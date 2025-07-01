import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import reducer from "./UserSlice";

interface UserToken{
    usertoken:string
}

const initialState:UserToken={
    usertoken:""
}

const userTokenSlice=createSlice({
    name:"usertoken",
    initialState,
    reducers:{
        addtoken(state, action:PayloadAction<{usertoken:string}>){
            state.usertoken=action.payload.usertoken
        },
        cleartoken(state){
            state.usertoken=""
        }
    }
})

export const{addtoken, cleartoken}=userTokenSlice.actions
export default userTokenSlice.reducer