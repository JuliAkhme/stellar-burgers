import {
  TIngredientsState,
  ingredientsThunk,
  ingredientsReducer
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тест редьюсера слайса ingredientsSlice', () => {
  const initialState: TIngredientsState = {
    buns: [],
    mains: [],
    sauces: [],
    loading: true,
    error: null
  };

  it('Тест статуса pending', async () => {
    const requestAction = { type: ingredientsThunk.pending.type };
    const state = ingredientsReducer(initialState, requestAction);
    expect(state).toEqual({
      ...initialState,
      loading: true,
      error: null
    });
  });

  it('Тест статуса fulfilled', async () => {
    const ingredients: TIngredient[] = [
      {
        _id: '643d69a5c3f7b9001cfa093c',
        name: 'Краторная булка N-200i',
        type: 'bun',
        proteins: 80,
        fat: 24,
        carbohydrates: 53,
        calories: 420,
        price: 1255,
        image: 'https://code.s3.yandex.net/react/code/bun-02.png',
        image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png',
        image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png'
      }
    ];
    const successAction = {
      type: ingredientsThunk.fulfilled.type,
      payload: ingredients
    };
    const state = ingredientsReducer(initialState, successAction);
    const expectedBuns = ingredients.filter((item) => item.type === 'bun');
    const expectedMains = ingredients.filter(
      (item) => item.type !== 'bun' && item.type !== 'sauce'
    );
    const expectedSauces = ingredients.filter((item) => item.type === 'sauce');
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      buns: expectedBuns,
      mains: expectedMains,
      sauces: expectedSauces
    });
  });

  it('Тест статуса rejected', async () => {
    const error = { message: 'Ошибка загрузки ингредиентов' };
    const failedAction = {
      type: ingredientsThunk.rejected.type,
      error: error
    };
    const state = ingredientsReducer(initialState, failedAction);
    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: error.message
    });
  });
});
