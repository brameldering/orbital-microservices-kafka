import * as Yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(Yup);
const textField = () => Yup.string().max(255);
const textAreaField = () => Yup.string().max(1024);

const numField = () =>
  Yup.number()
    .moreThan(-1, 'Cannot be negative')
    .transform((_, val) => (val !== '' ? Number(val) : null));

const passwordField = () =>
  Yup.string()
    .required()
    .min(
      6,
      'The password must contain 6 or more characters with at least one of each: uppercase, lowercase, number and special'
    )
    .max(40, 'The maximum length of a password is 40 characters');
// .minLowercase(1, 'password must contain at least 1 lower case letter')
// .minUppercase(1, 'password must contain at least 1 upper case letter')
// .minNumbers(1, 'password must contain at least 1 number')
// .minSymbols(1, 'password must contain at least 1 special character');

export { textField, textAreaField, numField, passwordField };
