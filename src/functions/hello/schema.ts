import * as Joi from '@hapi/joi';

const schema = Joi.object().keys({
  name: Joi.string().required(),
});

export default schema;
