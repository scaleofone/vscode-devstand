import { Validator, ValidatorResult } from 'jsonschema'

function preValidateProperty(object, key, schema, options, ctx) {
    if (typeof schema.patternProperties == 'object' && schema.additionalProperties === false) {
        schema['specificPropsPatterns'] = Object.keys(schema.patternProperties)
    }
}

function validateSpecificPropsPatterns(instance, schema, options, ctx) {
    var validatorResult = new ValidatorResult(instance, schema, options, ctx)
    Object.keys(instance)
        .filter(propertyName => ! matchAny(propertyName, schema['specificPropsPatterns']))
        .forEach(propertyName => {
            validatorResult.addError({
                message: 'property names must match regex: '+schema.specificPropsPatterns.join(' | '),
                name: 'specificPropsPatterns',
                argument: propertyName,
            })
        })
    return validatorResult
}

const validator = new Validator()
validator.attributes.specificPropsPatterns = validateSpecificPropsPatterns

export function validate(input, schema) {
    const result = validator.validate(input, schema, {
        nestedErrors: true,
        preValidateProperty,
    })
    return result.errors
        .filter(omitAdditionalPropertiesErrors)
        .map(overwriteMessages)
        .map(removeAttrs(['schema', 'instance', 'stack']))
}

function omitAdditionalPropertiesErrors(error, i, arr) {
    if (
        error.name == 'additionalProperties'
        && arr.some(err => err.name == 'specificPropsPatterns' && err.argument == error.argument)
    ) {
        return false
    }
    return true
}

function overwriteMessages(error) {
    if (error.name == 'type') {
        error.message = error.message.replace('is not of a type(s)', 'is not a')
        error.stack = error.stack.replace('is not of a type(s)', 'is not a')
    }
    return error
}

function removeAttrs(attrs) {
    return function (error) {
        for (let attr of attrs) {
            delete error[attr]
        }
        return error
    }
}

function matchAny(input, patterns) {
    for (let pattern of patterns) {
        try {
            if (input.match(new RegExp(pattern))) {
                return true
            }
        }
        catch (error) { /* do nothing */ }
    }
    return false
}
