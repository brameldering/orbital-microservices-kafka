import * as Yup from 'yup';
import YupPassword from 'yup-password';

YupPassword(Yup);
const textField = () => Yup.string();
const textFieldNoSpaces = () =>
  Yup.string().test(
    'no-spaces',
    'No spaces allowed',
    (value) => !value || !value.includes(' ')
  );
const textAreaField = () => Yup.string().max(1024);

const numField = () =>
  Yup.number().transform((_, val) => (val !== '' ? Number(val) : null));

const currencyField = () =>
  Yup.number()
    .moreThan(-0.01) // Ensures the number is positive
    .max(9999999.99)
    .transform((_, val) => (val !== '' ? Number(val) : null));

const passwordField = () =>
  Yup.string()
    .required('Required')
    .min(
      6,
      'Password must contain 6 or more characters with at least one of each: uppercase, lowercase, number and special character'
    )
    .max(40, 'The maximum length of a password is 40 characters');
// .minLowercase(1, 'password must contain at least 1 lower case letter')
// .minUppercase(1, 'password must contain at least 1 upper case letter')
// .minNumbers(1, 'password must contain at least 1 number')
// .minSymbols(1, 'password must contain at least 1 special character');

export {
  textField,
  textFieldNoSpaces,
  textAreaField,
  numField,
  currencyField,
  passwordField,
};
