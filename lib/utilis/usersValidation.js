"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferValidation = exports.validateUserLogin = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
/* **************** REGISTRATION VALIDATION **************** */
const validateUser = (data) => {
    const schema = joi_1.default.object({
        firstName: joi_1.default.string().trim().min(3).max(64),
        lastName: joi_1.default.string().trim().min(3).max(64),
        email: joi_1.default.string().trim().min(6).max(255).required().email(),
        DOB: joi_1.default.required(),
        phone_number: joi_1.default.string().length(11).required(),
        password: joi_1.default.string().min(6).required(),
        confirmPass: joi_1.default.ref("password"),
    }).unknown();
    const options = {
        errors: { wrap: { label: "" } },
    };
    return schema.validate(data, options);
};
exports.validateUser = validateUser;
/* **************** LOGIN VALIDATION **************** */
const validateUserLogin = (data) => {
    const schema = joi_1.default.object({
        email: joi_1.default.string().trim().lowercase().required().email(),
        password: joi_1.default.string().min(6).required(),
        confirmPass: joi_1.default.ref("password"),
    }).unknown();
    const options = { errors: { wrap: { label: "" } } };
    return schema.validate(data, options);
};
exports.validateUserLogin = validateUserLogin;
/* **************** Transfer Transaction VALIDATION **************** */
const transferValidation = (data) => {
    const schema = joi_1.default.object({
        receiverAccount: joi_1.default.number().required(),
        amount: joi_1.default.number().required(),
        senderAccount: joi_1.default.number().required(),
        transferDescription: joi_1.default.string(),
        reference: joi_1.default.string()
    }).unknown();
    const options = { errors: { wrap: { label: "" } } };
    return schema.validate(data, options);
};
exports.transferValidation = transferValidation;
