import { rootReducer, store } from '../store';

describe('Тест rootReducer', () => {
  test('Вызов с UNKNOWN_ACTION и undefined возвращает предыдущее состояние хранилища', () => {
    const before = store.getState();
    const after = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(after).toEqual(before);
  });
});
