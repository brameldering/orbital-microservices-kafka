/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
// import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
// import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
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

const CheckBoxField: React.FC<CheckBoxFieldProps> = ({
  controlId,
  label,
  checked,
  register,
  error,
  setError,
}) => {
  // const errorTextId = 'error_text_' + controlId;
  return (
    <FormControl component='fieldset' margin='normal' fullWidth>
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              id={controlId}
              checked={checked}
              {...register(controlId)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setError(controlId, { message: '' });
                register(controlId).onChange(e);
              }}
            />
          }
          label={label}
        />
        {error && <FormHelperText error>{error.message}</FormHelperText>}
      </FormGroup>
    </FormControl>
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

const TextNumField: React.FC<TextNumFieldProps> = ({
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
      id={controlId}
      type={type}
      label={label}
      variant='standard'
      margin='normal'
      fullWidth
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
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

const CurrencyNumField: React.FC<CurrencyNumFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  // const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      id={controlId}
      type='number'
      label={label}
      variant='standard'
      margin='normal'
      fullWidth
      error={!!error}
      helperText={error?.message}
      inputProps={{
        step: '0.01',
        ...register(controlId),
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
          setError(controlId, { message: '' });
          register(controlId).onChange(e);
        },
      }}
      // inputProps={{
      //   step: '0.01',
      //   ...register(controlId),
      //   onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      //     const value = parseFloat(e.target.value);
      //     if (value % 1 !== 0) {
      //       const decimalPart = parseFloat((value % 1).toFixed(2));
      //       if (decimalPart < 0 || decimalPart > 0.99) {
      //         setError(controlId, {
      //           message: 'Decimal part should be between .00 and .99',
      //         });
      //       } else {
      //         setError(controlId, { message: '' });
      //       }
      //     } else {
      //       setError(controlId, { message: '' });
      //     }
      //     register(controlId).onChange(e);
      //   },
      // }}
    />
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

const PasswordField: React.FC<PasswordFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  const [contentVisible, setContentVisible] = useState(false);
  // const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      id={controlId}
      type={contentVisible ? 'text' : 'password'}
      label={label}
      variant='standard'
      margin='normal'
      fullWidth
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setError(controlId, { message: '' });
        register(controlId).onChange(e);
      }}
      InputProps={{
        endAdornment: (
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onMouseDown={() => setContentVisible(!contentVisible)}
              onMouseUp={() => setContentVisible(!contentVisible)}>
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

const SelectField: React.FC<SelectFieldProps> = ({
  controlId,
  options,
  control,
  error,
  setError,
}) => {
  // const errorTextId = 'error_text_' + controlId;
  const defaultValue = options.length > 0 ? options[0].label : '';
  return (
    <>
      <FormControl fullWidth margin='normal' variant='outlined'>
        <InputLabel id={`${controlId}-label`}>{options[0].label}</InputLabel>
        <Controller
          name={controlId}
          control={control}
          defaultValue={defaultValue}
          render={({ field }) => (
            <Select
              id={controlId}
              labelId={`${controlId}-label`}
              label={options[0].label}
              aria-label='Select'
              {...field}
              onChange={(e) => {
                setError(controlId, { message: '' });
                field.onChange(e);
              }}>
              {options.map((option: any) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {error && <FormHelperText error>{error.message}</FormHelperText>}
      </FormControl>
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

const TextAreaField: React.FC<TextAreaFieldProps> = ({
  controlId,
  label,
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <TextField
      id={controlId}
      label={label}
      variant='standard'
      margin='normal'
      fullWidth
      multiline
      rows={4}
      {...register(controlId)}
      error={!!error}
      helperText={error?.message}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setError(controlId, { message: '' });
        register(controlId).onChange(e);
      }}
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
