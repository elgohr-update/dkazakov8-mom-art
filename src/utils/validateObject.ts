import _ from 'lodash';

import { errorsNames } from 'const/errorsNames';

import { createError } from './createError';

interface ValidatorType {
  (...args: any[]): boolean;
  notRequired?(...args: any[]): boolean;
}

type ObjectWithStringsType = { [key: string]: string };
type RulesType = { [key: string]: Function };
type ValidateObjectType = { rules: RulesType; data: ObjectWithStringsType; prefix?: string };

export const validators = {
  isArray: function isArray(v) {
    return _.isArray(v);
  } as ValidatorType,
  isString: function isString(v) {
    return _.isString(v);
  } as ValidatorType,
  isNumber: function isNumber(v) {
    return _.isNumber(v);
  } as ValidatorType,
  isBoolean: function isBoolean(v) {
    return _.isBoolean(v);
  } as ValidatorType,
  isFormData: function isFormData(v) {
    // No FormData is Node.js
    return IS_CLIENT ? v instanceof FormData : true;
  } as ValidatorType,
  isPlainObject: function isPlainObject(v) {
    return _.isPlainObject(v);
  } as ValidatorType,

  isArrayNotRequired: function isArrayNotRequired(v) {
    return _.isArray(v) || _.isNil(v);
  } as ValidatorType,
  isStringNotRequired: function isStringNotRequired(v) {
    return _.isString(v) || _.isNil(v);
  } as ValidatorType,
  isNumberNotRequired: function isNumberNotRequired(v) {
    return _.isNumber(v) || _.isNil(v);
  } as ValidatorType,
  isBooleanNotRequired: function isBooleanNotRequired(v) {
    return _.isBoolean(v) || _.isNil(v);
  } as ValidatorType,
  isFormDataNotRequired: function isFormDataNotRequired(v) {
    return v instanceof FormData || _.isNil(v);
  } as ValidatorType,
  isPlainObjectNotRequired: function isPlainObjectNotRequired(v) {
    return _.isPlainObject(v) || _.isNil(v);
  } as ValidatorType,

  omitParam() {
    return true;
  },
  isArrayShape(rules: RulesType) {
    if (!_.isPlainObject(rules)) {
      throw createError(errorsNames.VALIDATION_CUSTOM, `isArrayShape: rules is not an object`);
    }

    return new ShapeArrayValidate(rules);
  },
};

validators.isArray.notRequired = validators.isArrayNotRequired;
validators.isString.notRequired = validators.isStringNotRequired;
validators.isNumber.notRequired = validators.isNumberNotRequired;
validators.isBoolean.notRequired = validators.isBooleanNotRequired;
validators.isFormData.notRequired = validators.isFormDataNotRequired;
validators.isPlainObject.notRequired = validators.isPlainObjectNotRequired;

class ShapeArrayValidate {
  rules: RulesType;

  constructor(rules: RulesType) {
    this.rules = rules;
  }

  validate({
    paramName,
    targetArray,
    otherArg,
    prefix,
  }: {
    paramName: string;
    targetArray: ObjectWithStringsType[];
    otherArg: any;

    prefix?: string;
  }) {
    if (!validators.isArray(targetArray)) {
      throw createError(errorsNames.VALIDATION, `${prefix || ''}${paramName}${` [isArray]`}`);
    }

    targetArray.forEach((responseItem, i) => {
      validateObject(
        {
          rules: this.rules,
          data: responseItem,
          prefix: `${prefix || ''}${paramName}[${i}].`,
        },
        otherArg
      );
    });
  }
}

export function validateObject({ rules, data, prefix }: ValidateObjectType, otherArg?: any) {
  return Promise.resolve()
    .then(() =>
      !_.isPlainObject(rules)
        ? Promise.reject(new Error(`validateObject: rules is not an object`))
        : Promise.resolve()
    )
    .then(() =>
      !_.isPlainObject(data)
        ? Promise.reject(new Error(`validateObject: data is not an object`))
        : Promise.resolve()
    )
    .then(() => {
      Object.entries(rules).forEach(([paramName, validator]) => {
        const paramValue = data[paramName];

        if (validator instanceof ShapeArrayValidate) {
          return validator.validate({
            paramName,
            targetArray: (paramValue as unknown) as ObjectWithStringsType[],
            otherArg,
            prefix,
          });
        }

        if (!validator(paramValue, otherArg)) {
          const validatorName = _.findKey(validators, v => v === validator);

          throw createError(
            errorsNames.VALIDATION,
            `${prefix || ''}${paramName}${_.isString(validatorName) ? ` [${validatorName}]` : ''}`
          );
        }
      });
    });
}
