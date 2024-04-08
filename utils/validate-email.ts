import { validate } from 'deep-email-validator';

export const isEmailValid = async (email: string) => {
  return await validate(email);
};
