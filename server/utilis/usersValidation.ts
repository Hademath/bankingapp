import { validateUsers, transferBodyInput } from "./userInterface";
import  Joi from "joi";

  /* **************** REGISTRATION VALIDATION **************** */
export const validateUser = (data: validateUsers) => {
   const schema = Joi.object({
     firstName: Joi.string().trim().min(3).max(64),
     lastName: Joi.string().trim().min(3).max(64),
     email: Joi.string().trim().min(6).max(255).required().email(),
     DOB: Joi.required(),
     phone_number:Joi.string().length(11).required(),
     password: Joi.string().min(6).required(),
     confirmPass: Joi.ref("password"),
   }).unknown();
   const options = {
     errors: { wrap: { label: "" }  },
   };
   return schema.validate(data, options);
};


 /* **************** LOGIN VALIDATION **************** */
export const validateUserLogin = (data: validateUsers) => {
  const schema = Joi.object({
    email: Joi.string().trim().lowercase().required().email(),
    password: Joi.string().min(6).required(),
    confirmPass: Joi.ref("password"),
  }).unknown();
  const options = {errors: {wrap: {label: "" } } };
  return schema.validate(data, options); 
};




/* **************** Transfer Transaction VALIDATION **************** */

export const transferValidation = (data: transferBodyInput )=>{
  const schema = Joi.object({
    receiverAccount:Joi.number().required(),
    amount: Joi.number().required(),
    senderAccount:Joi.number().required(),
    transferDescription:Joi.string(),
    reference:Joi.string()
  }).unknown();
  const options = {errors: {wrap: {label: "" } } };
  return schema.validate(data, options); 
}