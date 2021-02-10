import 'source-map-support/register';

import { middyfy } from '@libs/lambda';
import log from '@libs/logger';
import { validateSchema } from '@libs/request';
import { getSuccessResponse, getFailResponse } from '@libs/api-gateway';
import { getCorsHeaders } from '@libs/header';
import schema from './schema';

// import schema from './schema';

const hello = async event => {
  log.info('[handler.hello.event.header]: ', event.headers);
  log.info('[handler.hello.event.body]: ', event.body);

  // 1. Setting the response headers

  const responseHeaders = getCorsHeaders(event.headers, ['POST', 'OPTIONS']);

  // 2. Validating the request body schema

  const validationErrors = validateSchema(schema, event.body);

  if (validationErrors) {
    return getFailResponse(400, validationErrors, responseHeaders);
  }

  // 3. Business logic

  const apiResponse = { message: `Hello, World ${event.body.name}` };

  // 4. Success response
  return getSuccessResponse(200, apiResponse, responseHeaders);
};

export const main = middyfy(hello);
