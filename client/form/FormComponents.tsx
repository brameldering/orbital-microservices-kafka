/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

// ================== CheckBoxField ==================
interface CheckBoxFieldProps {
  controlId: string;
  label: string;
  checked: boolean;
  register: any;
  error: any;
  setError: any;
}

const CheckBoxField: React.FunctionComponent<CheckBoxFieldProps> = ({
  controlId,
  label,
  checked,
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <FormGroup>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            {...register(controlId)}
            onChange={(e) => {
              setError(controlId, { message: '' });
              register(controlId).onChange(e);
            }}
          />
        }
        label={label}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </FormGroup>
  );
};

// =================== TextNumField ====================
// = form field used for text and whole number               =
interface TextNumFieldProps {
  controlId: string;
  label: string;
  type?: string;
  register: any;
  error: any;
  setError: any;
}
{
  /* <Form.Group>
     <FloatingLabel controlId={controlId} label={label} className='mt-3'>
 </FloatingLabel>
       {error && (
         <Form.Text id={errorTextId} className='text-danger'>
           {error.message}
         </Form.Text>
       )}
</Form.Group>  */
}

const TextNumField: React.FunctionComponent<TextNumFieldProps> = ({
  controlId,
  label,
  type = 'text',
  register,
  error,
  setError,
}) => {
  // const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      type={type}
      label={label}
      variant='outlined'
      margin='normal'
      fullWidth
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
      onChange={(e) => {
        setError(controlId, { message: '' });
        register(controlId).onChange(e);
      }}
    />
  );
};

// ================= CurrencyNumField ==================
// = form field used for currency number               =
interface CurrencyNumFieldProps {
  controlId: string;
  label: string;
  register: any;
  error: any;
  setError: any;
}

const CurrencyNumField: React.FunctionComponent<CurrencyNumFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <FormControl fullWidth variant='outlined' margin='normal'>
      <InputLabel htmlFor={controlId}>{label}</InputLabel>
      <TextField
        id={controlId}
        type='number'
        label={label}
        error={!!error}
        inputProps={{
          step: '0.01',
          ...register(controlId),
          onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = parseFloat(e.target.value);
            if (value % 1 !== 0) {
              const decimalPart = parseFloat((value % 1).toFixed(2));
              if (decimalPart < 0 || decimalPart > 0.99) {
                setError(controlId, {
                  message: 'Decimal part should be between .00 and .99',
                });
              } else {
                setError(controlId, { message: '' });
              }
            } else {
              setError(controlId, { message: '' });
            }
            register(controlId).onChange(e);
          },
        }}
      />
      {error && (
        <FormHelperText error id={`error_text_${controlId}`}>
          {error.message}
        </FormHelperText>
      )}
    </FormControl>
  );
};

// ================== PasswordField ==================
interface PasswordFieldProps {
  controlId: string;
  label: string;
  register: any;
  error: any;
  setError: any;
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  const [contentVisible, setContentVisible] = useState(false);
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      type={contentVisible ? 'text' : 'password'}
      label={label}
      variant='outlined'
      margin='normal'
      fullWidth
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={() => setContentVisible(!contentVisible)}
              onMouseDown={handleMouseDownPassword}>
              {contentVisible ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

// ================== SelectField ==================
interface SelectFieldProps {
  controlId: string;
  options: any[];
  control: any;
  error: any;
  setError: any;
}

const SelectField: React.FunctionComponent<SelectFieldProps> = ({
  controlId,
  options,
  control,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <>
      <Controller
        name={controlId}
        control={control}
        defaultValue=''
        render={({ field }) => (
          <Select
            aria-label='Select Role'
            id={controlId}
            // className='mt-3'
            // style={{ borderColor: '#606060' }}
            {...field}
            onChange={(e) => {
              setError(controlId, { message: '' });
              field.onChange(e);
            }}>
            {options.map((option: any) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </>
  );
};

// ================== TextAreaField ==================
interface TextAreaFieldProps {
  controlId: string;
  label: string;
  register: any;
  error: any;
  setError: any;
}

const TextAreaField: React.FunctionComponent<TextAreaFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      label={label}
      variant='outlined'
      margin='normal'
      fullWidth
      multiline
      rows={4}
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
    />
  );
};

export {
  CheckBoxField,
  TextNumField,
  CurrencyNumField,
  PasswordField,
  SelectField,
  TextAreaField,
};
