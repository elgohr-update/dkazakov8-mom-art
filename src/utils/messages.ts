import { wrapMessages } from 'utils/wrapMessages';

export const messages = wrapMessages(__dirname, {
  pageTitleSuffix: 'Елена Казакова',

  // Errors
  VALIDATION: 'Ошибка в ответе сервера: переданы некорректные параметры',
  INTERNAL_SERVER_ERROR: 'Ошибка в ответе сервера',
  AUTH_ERROR: 'При авторизации возникла ошибка',
  NOT_ALLOWED: 'Доступ запрещен',
  LIMIT_PART_COUNT: 'Too many parts',
  LIMIT_FILE_SIZE: 'File too large',
  LIMIT_FILE_COUNT: 'Too many files',
  LIMIT_FIELD_KEY: 'Field name too long',
  LIMIT_FIELD_VALUE: 'Field value too long',
  LIMIT_FIELD_COUNT: 'Too many fields',
  LIMIT_UNEXPECTED_FILE: 'Unexpected field',

  // Validation
  validator_empty: 'Не оставляйте это поле пустым',
});
