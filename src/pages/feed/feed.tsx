import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedThunk, getFeeds } from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  const feed = useSelector(getFeeds);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(feedThunk());
  }, [dispatch]);

  const handleUpdateFeeds = () => {
    dispatch(feedThunk());
  };

  if (!feed.feed?.orders) {
    return <Preloader />;
  }
  return (
    <FeedUI orders={feed.feed.orders} handleGetFeeds={handleUpdateFeeds} />
  );
};
