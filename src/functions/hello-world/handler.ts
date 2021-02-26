import 'source-map-support/register';
import { APIGatewayProxyEvent } from 'aws-lambda';

import { middyfy } from '@libs/lambda';
import log from '@libs/logger';
import { validateSchema, validateQueryParams } from '@libs/request';
import {
  getNoContentResponse,
  getSuccessResponse,
  getFailResponse,
  getErrorResponse,
} from '@libs/api-gateway';
import { getCorsHeaders } from '@libs/header';
import schema from './schema';

enum HttpMethod {
  OPTIONS = 'OPTIONS',
  GET = 'GET',
  POST = 'POST',
}

const CORS_ALLOWED_METHODS = ['OPTIONS', 'GET', 'POST'];

function optionsRequestHandler(event: APIGatewayProxyEvent) {
  // 1. Setting the response headers
  const responseHeaders = getCorsHeaders(event.headers, CORS_ALLOWED_METHODS, ['Content-Encoding']);
  log.debug('[handler.helloworld.optionsRequestHandler.responseHeaders]: ', responseHeaders);

  // 2. Success response
  return getNoContentResponse(200, responseHeaders);
}

function getRequestHandler(event: APIGatewayProxyEvent) {
  log.debug(
    '[handler.helloworld.getRequestHandler.queryStringParameters]: ',
    event.queryStringParameters
  );

  // 1. Setting the response headers
  const responseHeaders = getCorsHeaders(event.headers, CORS_ALLOWED_METHODS);
  log.debug('[handler.helloworld.getRequestHandler.responseHeaders]: ', responseHeaders);

  // 2. Validating the request body schema
  const validationErrors = validateQueryParams(event.queryStringParameters, ['name']);

  if (validationErrors) {
    return getFailResponse(400, validationErrors, responseHeaders);
  }

  // 3. Business logic
  const apiResponse = { message: `Hello World, ${event.queryStringParameters.name}!` };

  // 4. Success response
  return getSuccessResponse(200, apiResponse, responseHeaders);
}

function postRequestHandler(event: APIGatewayProxyEvent) {
  log.info('[handler.helloWorld.postRequestHandler.event.body]: ', event.body);

  // 1. Setting the response headers
  const responseHeaders = getCorsHeaders(event.headers, CORS_ALLOWED_METHODS);
  log.debug('[handler.helloWorld.postRequestHandler.responseHeaders]: ', responseHeaders);

  // 2. Validating the request body schema
  const validationErrors = validateSchema(schema, event.body);

  if (validationErrors) {
    return getFailResponse(400, validationErrors, responseHeaders);
  }

  // 3. Business logic
  const apiResponse = { message: `Hello World, ${event.body.name}!` };

  // 4. Success response
  return getSuccessResponse(200, apiResponse, responseHeaders);
}

const helloWorld = async (event: APIGatewayProxyEvent) => {
  log.info('[handler.helloWorld.event.header]: ', event.headers);
  log.info('[handler.helloWorld.event.httpMethod]: ', event.httpMethod);

  try {
    switch (event.httpMethod.toUpperCase()) {
      case HttpMethod.OPTIONS:
        return optionsRequestHandler(event);
      case HttpMethod.GET:
        return getRequestHandler(event);
      case HttpMethod.POST:
        return postRequestHandler(event);
    }
  } catch (error) {
    const responseHeaders = getCorsHeaders(event.headers, CORS_ALLOWED_METHODS);
    log.debug('[handler.helloWorld.error.responseHeaders]: ', responseHeaders);
    log.error('[handler.helloWorld.error]: ', error);

    return getErrorResponse(500, error, responseHeaders);
  }
};

export const main = middyfy(helloWorld);
