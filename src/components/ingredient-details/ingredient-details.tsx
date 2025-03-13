import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  getIngredients,
  ingredientsThunk
} from '../../services/slices/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredient = useSelector(getIngredients);
  const ingredientData = ingredient.buns.find((item) => item._id === id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!ingredient.buns.length) {
      dispatch(ingredientsThunk());
    }
  }, [dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
