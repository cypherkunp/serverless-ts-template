import { Schema } from '@hapi/joi';
import log from '@libs/logger';

/**
 * Validates the request body for errors
 *
 * @param {Object} requestBody body
 *
 * @returns {boolean} true if the request body gets parsed
 */
function validateRequestBody(requestBody: string): boolean {
  try {
    JSON.parse(requestBody);
    return true;
  } catch (error) {
    return false;
  }
}

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

export { validateRequestBody, validateSchema };
