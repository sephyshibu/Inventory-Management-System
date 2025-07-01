import { configureStore,combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import storage from "redux-persist/lib/storage";

import userReducer from '../features/UserSlice'
import userToken from '../features/UserToken'


interface UserState{
    user:Record<string,any>
}
interface UserToken{
    usertoken:string

}


const persistConfig={
    key:"root",
    storage,
    blacklist:['usertoken']
}

const rootreducer=combineReducers({
    user:userReducer,
    usertoken:userToken
})

const persistreducer=persistReducer(persistConfig,rootreducer)

export const store = configureStore({
    reducer: persistreducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // This should be an array of action types to ignore
                ignoredActions: [
                    FLUSH, 
                    REHYDRATE, 
                    PAUSE, 
                    PERSIST, 
                    PURGE, 
                    REGISTER
                ],
            },
        }), 
});
export type RootState = {
    user: UserState ;
    usertoken: UserToken ;

};

// Dispatch type
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);