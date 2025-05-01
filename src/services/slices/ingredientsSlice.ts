import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
};

export const initialState: TIngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null
};

export const ingredientsThunk = createAsyncThunk(
  'ingredients/ingredientsThunk',
  getIngredientsApi
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    getIngredients: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(ingredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(ingredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.buns = action.payload.filter((item) => item.type === 'bun');
        state.mains = action.payload.filter(
          (item) => item.type !== 'bun' && item.type !== 'sauce'
        );
        state.sauces = action.payload.filter((item) => item.type === 'sauce');
      })
      .addCase(ingredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export const { getIngredients } = ingredientsSlice.selectors;
export const ingredientsReducer = ingredientsSlice.reducer;
