const { ErrorHandler } = require("./error");

/**
 * Throws a error if validation is false.
 */
function validateThat(predicate, message) {
  return function(value) {
    if (predicate(value)) return value;
    throw new ErrorHandler(message);
  };
}
/**
 * Generates a schema object that matches a string data type.
 */
exports.checkString = validateThat(function(value) {
  return typeof value == "string";
}, "not string");

/**
 * Generates a schema object that matches a number data type.
 */
exports.checkNumber = validateThat(function(value) {
  return typeof value == "number";
}, "not number");

/**
 * Generates a schema object that matches a date type.
 */
exports.checkDate = validateThat(function(value) {
  try {
    return value.match(/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/);
  } catch (error) {
    throw new ErrorHandler("must be string and yyyy-mm-dd");
  }
}, "must be yyyy-mm-dd");

/**
 * Create an schema.
 *
 * @return {Function}
 */
exports.schema = function(propertyValidators) {


  /**
   * Validates a object using the schema.
   *
   */
  return function(object) {
    var result = {};

    if (!object || typeof object !== "object") {
      throw new ErrorHandler("not an Object");
    }

    // Validate all properties.
    for (key in propertyValidators) {
      var validator = propertyValidators[key];
      try {
        var valid = validator(object[key]);
      } catch (error) {
        if (key in object) {
          throw new ErrorHandler('"' + key + '" ' + error.message);
        } else {
          throw new ErrorHandler('missing property "' + key + '"');
        }
      }
      if (valid !== undefined) {
        result[key] = valid;
      }
    }

    // Check for unexpected properties.
    for (var key in object) {
      if (!propertyValidators[key]) {
        throw new ErrorHandler('unexpected property "' + key + '"');
      }
    }

    return result;
  };
};
