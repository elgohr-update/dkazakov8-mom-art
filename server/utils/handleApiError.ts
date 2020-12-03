import { errorsNames } from 'const';

export function handleApiError(error, res) {
  console.error(error);

  let status = 500;
  let errorName = errorsNames.INTERNAL_SERVER_ERROR;
  switch (error.name) {
    case errorsNames.VALIDATION:
      status = 422;
      errorName = error.name;
      break;
    case errorsNames.NOT_ALLOWED:
      status = 403;
      errorName = error.name;
      break;
    default:
      break;
  }

  // Multer errors
  if (error.code) {
    status = 422;
    errorName = error.code;
  }

  return res.status(status).send({
    errorName,
    errorMessage: error.message,
  });
}
