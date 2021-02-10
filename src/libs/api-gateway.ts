import { success, error, fail } from 'jsend';
import log from '@libs/logger';

interface APIResponseType {
  statusCode: number;
  body?: string;
  headers?: object;
  multiValueHeaders?: object;
}

interface ErrorDataType {
  message: string;
  code: string;
  data?: any;
}

function getSuccessResponse(
  statusCode: number,
  responseData: object,
  headers: object
): APIResponseType {
  const successResponse = success(responseData);
  log.debug(successResponse);

  const lambdaResponse = {
    statusCode: statusCode,
    body: JSON.stringify(successResponse),
    headers: headers,
  };

  return lambdaResponse;
}

function getFailResponse(statusCode: number, failData: any, headers: object): APIResponseType {
  const failResponse = fail(failData);
  log.debug(failResponse);

  const lambdaResponse = {
    statusCode: statusCode,
    body: JSON.stringify(failResponse),
    headers: headers,
  };
  return lambdaResponse;
}

function getErrorResponse(statusCode: number, errorData: ErrorDataType, headers: object) {
  const errorResponse = error(errorData);
  log.debug(errorResponse);

  const lambdaResponse = {
    statusCode: statusCode,
    body: JSON.stringify(errorResponse),
    headers: headers,
  };

  return lambdaResponse;
}

export { getSuccessResponse, getErrorResponse, getFailResponse, APIResponseType };
