const { body, validationResult } = require("express-validator");
const config = require("../config");

// ---- Used in Auth.routes.js ----
/**
 * Validates the .json body sent from the client
 * (usually via a form)
 */
const validateResult = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

const signupValidation = [
  body("displayname")
    .optional()
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Displayname must be between 3 and 32 characters"),

  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters")
    .matches(/^[a-z0-9_.]+$/)
    .withMessage(
      "Username can only contain lowercase letters, numbers, '_' and '.'"
    ),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .trim()
    .isEmail()
    .withMessage("Email is invalid"),

  body("password")
    .notEmpty()
    .withMessage("Password can't be empty")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

const loginValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .isLength({ min: 3, max: 32 })
    .withMessage("Username must be between 3 and 32 characters"),

  body("password").notEmpty().withMessage("Password can't be empty"),
];
// --------------------------------

/**
 * Always validate our API before
 * letting the user access its CRUD methods...
 * We don't want third-parties messing with our database
 */
const validateApiKey = (req, res, next) => {
  const apiKey = req.header("x-api-key");
  if (!apiKey || apiKey !== config.apiKey) {
    return next({ status: 401, message: "Unauthorized API key" });
  }
  next();
};

module.exports = {
  validateResult,
  validateApiKey,
  signupValidation,
  loginValidation,
};
