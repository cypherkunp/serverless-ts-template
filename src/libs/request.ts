import { APIGatewayProxyEventQueryStringParameters } from 'aws-lambda';

import { Schema } from '@hapi/joi';
import log from '@libs/logger';

function validateSchema(requestBodySchema: Schema, requestBody): object | null {
  const { error } = requestBodySchema.validate(requestBody, {
    abortEarly: false,
    convert: false,
  });

  if (error) {
    const validationDetails = error.details
      .map(({ message, context }) => ({
        [context.label]: message.replace(/['"]/g, ''),
      }))
      .reduce((r, c) => Object.assign(r, c), {});

    log.debug({ validationDetails });
    return validationDetails;
  } else return null;
}

function validateQueryParams(
  requestQueryParams: APIGatewayProxyEventQueryStringParameters,
  requiredQueryParams: Array<string>
) {
  const validationErrors = {};
  requestQueryParams = requestQueryParams || {};
  requiredQueryParams.forEach(queryParam => {
    if (!requestQueryParams[queryParam]) {
      validationErrors[queryParam] = `${queryParam} is required`;
    }
  });

  if (Object.keys(validationErrors).length === 0) {
    return null;
  } else {
    log.debug('[request-validator.validateQueryParams.validationErrors] ', validationErrors);
    return validationErrors;
  }
}

export { validateQueryParams, validateSchema };
