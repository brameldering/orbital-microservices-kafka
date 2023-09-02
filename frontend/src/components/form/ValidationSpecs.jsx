import * as Yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(Yup);
const textField = () => Yup.string().max(255);

const numField = () =>
  Yup.number()
    .moreThan(-1, 'Cannot be negative')
    .transform((_, val) => (val !== '' ? Number(val) : null));

const passwordField = () =>
  Yup.string()
    .min(
      6,
      'password must contain 6 or more characters with at least one of each: uppercase, lowercase, number and special'
    )
    .max(80);
// .minLowercase(1, 'password must contain at least 1 lower case letter')
// .minUppercase(1, 'password must contain at least 1 upper case letter')
// .minNumbers(1, 'password must contain at least 1 number')
// .minSymbols(1, 'password must contain at least 1 special character');

export { textField, numField, passwordField };
