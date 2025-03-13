import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingerdientsReducer } from './slices/ingredientsSlice';
import { userReducer } from './slices/userSlice';
import { constructorBurgerReducer } from './slices/constructorSlice';
import { ordersReducer } from './slices/ordersSlice';
import { feedReducer } from './slices/feedSlice';

export const rootReducer = combineReducers({
  ingredients: ingerdientsReducer,
  user: userReducer,
  constructorBurger: constructorBurgerReducer,
  orders: ordersReducer,
  feed: feedReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
