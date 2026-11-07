
const validateRequest = (schema, property = "body") => {
  return (req, res, next) => {
    // Validate the requested data using the Joi schema
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true,
      convert: true
    });

    // If validation fails, return all validation errors
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.details.map((detail) => detail.message)
      });
    }

    // Replace the body with the validated and cleaned data
    if (property === "body") {
      req.body = value;
    }

    // Store validated query parameters separately
    if (property === "query") {
      req.validatedQuery = value;
    }

    // Store validated URL parameters separately
    if (property === "params") {
      req.validatedParams = value;
    }

    next();
  };
};

export default validateRequest;
