import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

type TIngredientsState = {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null;
};

const initialState: TIngredientsState = {
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
        state.buns = action.payload;
        state.mains = action.payload;
        state.sauces = action.payload;
      })
      .addCase(ingredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  }
});

export const { getIngredients } = ingredientsSlice.selectors;
export const ingerdientsReducer = ingredientsSlice.reducer;
