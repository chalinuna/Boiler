import { combineReducers, configureStore } from '@reduxjs/toolkit';
import setToken from './setToken';
import setUser from './setUser';
import storage from 'redux-persist/lib/storage'
import storageSession from 'redux-persist/lib/storage/session'
import { persistReducer } from 'redux-persist'


const rootReducer = combineReducers({
    setToken:setToken,
    setUser:setUser
  });

const persistConfig = {
    key:'root',
    // 로컬 스토리지에 저장할 경우 storage, 세션에 저장할 경우 storageSession
    storage:storageSession,
    // whitelist : ['적용대상목록'] 
    // blacklist : ['미적용대상목록']
    whitelist: ['setUser'],
    blacklist: ['setToken']
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer:persistedReducer
})

export default store;
// export default configureStore({
//     reducer: {
//         setToken: setToken,
//         setUser:setUser
//     },
// });
