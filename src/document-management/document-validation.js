import Joi from 'joi';

const idSchema = Joi.string().pattern(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/);
const colorSchema = Joi.string().pattern(/#[0-9a-f]{6}/);

const partSchema = Joi.object({
  id: idSchema,
  name: Joi.string().allow(''),
  color: colorSchema,
  length: Joi.number().min(1)
});

const annotationSchema = Joi.object({
  id: idSchema,
  values: Joi.array().items(Joi.string().allow(''))
});

const soundSchema = Joi.object({
  type: Joi.string().allow('embedded'),
  fileName: Joi.string()
});

const v3Schema = Joi.object({
  id: idSchema,
  name: Joi.string().optional(),
  handle: Joi.any().optional(),
  work: {
    version: Joi.any().allow('3'),
    parts: Joi.array().min(1).items(partSchema),
    annotations: Joi.array().items(annotationSchema),
    sounds: Joi.array().items(soundSchema)
  },
  files: Joi.object().custom(value => {
    if (!value || typeof value !== 'object') {
      throw new Error('Value has to be an object');
    }

    for (const [key, val] of Object.entries(value)) {
      if (key.replace(/\s/g, '') === '') {
        throw new Error('Keys have to be non-empty strings');
      }
      if (!(val instanceof Blob)) {
        throw new Error('Values have to be blobs');
      }
    }

    return value;
  })
});

export function validateV3Document(v3Doc) {
  Joi.assert(v3Doc, v3Schema, {
    allowUnknown: false,
    convert: false,
    presence: 'required'
  });
}
