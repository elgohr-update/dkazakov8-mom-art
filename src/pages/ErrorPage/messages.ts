import { wrapMessages } from 'utils/wrapMessages';

export const messages = wrapMessages(__dirname, {
  metaTitle: 'Ошибка',
  error404Title: 'Страница',
  error404Subtitle: 'не найдена',
  error500Title: 'Произошла',
  error500Subtitle: 'ошибка',
});
