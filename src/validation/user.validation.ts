import { body, query } from "express-validator";


const forgetPasswordSanitizer = [
    body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please Enter a Valid Email"),
];

const resetPasswordSanitizer = [
    body("newPassword")
        .notEmpty()
        .withMessage("New password is required")
        .isString()
        .withMessage("New password must be a string"),
    query("resetToken")
        .notEmpty()
        .withMessage("Reset token is required")
        .isString()
        .withMessage("Reset token must be a string"),
];

export {forgetPasswordSanitizer, resetPasswordSanitizer };