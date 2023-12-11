/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

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
    <Form.Group className='mt-3' controlId={controlId}>
      <Form.Check
        name={controlId}
        label={label}
        checked={checked}
        {...register(controlId)}
        onChange={(e) => {
          setError(controlId, { message: '' });
          register(controlId).onChange(e);
        }}
      />
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </Form.Group>
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

const TextNumField: React.FunctionComponent<TextNumFieldProps> = ({
  controlId,
  label,
  type = 'text',
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <Form.Group>
      <FloatingLabel controlId={controlId} label={label} className='mt-3'>
        <Form.Control
          style={{ borderColor: '#606060' }}
          type={type}
          placeholder={label}
          {...register(controlId)}
          onChange={(e) => {
            setError(controlId, { message: '' });
            register(controlId).onChange(e);
          }}
        />
      </FloatingLabel>
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </Form.Group>
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
    <Form.Group>
      <FloatingLabel controlId={controlId} label={label} className='mt-3'>
        <Form.Control
          style={{ borderColor: '#606060' }}
          type='number'
          step='0.01'
          placeholder={label}
          {...register(controlId)}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (value % 1 !== 0) {
              // Check if the number has a decimal part
              const decimalPart = parseFloat((value % 1).toFixed(2)); // Limit decimal to two places
              if (decimalPart < 0 || decimalPart > 0.99) {
                setError(controlId, {
                  message: 'Decimal part should be between .00 and .99',
                });
              } else {
                setError(controlId, { message: '' }); // Clear error if it's within the allowed range
              }
            } else {
              setError(controlId, { message: '' }); // Clear error for whole numbers
            }
            register(controlId).onChange(e);
          }}
        />
      </FloatingLabel>
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </Form.Group>
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
  const showPassword = () => {
    setContentVisible(true);
  };
  const hidePassword = () => {
    setContentVisible(false);
  };
  const errorTextId = 'error_text_' + controlId;
  return (
    <>
      <InputGroup>
        <FloatingLabel controlId={controlId} label={label} className='mt-3'>
          <Form.Control
            type={contentVisible ? 'text' : 'password'}
            style={{ borderColor: '#606060' }}
            placeholder={label}
            {...register(controlId)}
            onChange={(e) => {
              setError(controlId, { message: '' });
              register(controlId).onChange(e);
            }}
          />
        </FloatingLabel>
        <Button
          type='button'
          className='btn-outline mt-3'
          style={{
            position: 'relative',
            height: '58px',
            borderColor: '#606060',
          }}
          onMouseDown={showPassword}
          onMouseUp={hidePassword}
          onBlur={hidePassword}>
          {contentVisible ? <FaEye /> : <FaEyeSlash />}
        </Button>
      </InputGroup>
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </>
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
          <Form.Select
            aria-label='Select Role'
            id={controlId}
            className='mt-3'
            style={{ borderColor: '#606060' }}
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
          </Form.Select>
        )}
      />
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </>
  );
};

// ================== TextAreaField ==================
interface TextAreaFieldProps {
  controlId: string;
  label: string;
  value?: string;
  register: any;
  error: any;
  setError: any;
}

const TextAreaField: React.FunctionComponent<TextAreaFieldProps> = ({
  controlId,
  label,
  value = '',
  register,
  error,
  setError,
}) => {
  const errorTextId = 'error_text_' + controlId;
  return (
    <Form.Group>
      <FloatingLabel controlId={controlId} label={label} className='mt-3'>
        <Form.Control
          as='textarea'
          rows={3}
          style={{
            height: '100px',
            lineHeight: '1.5',
            borderColor: '#606060',
          }}
          placeholder={label}
          value={value}
          {...register(controlId)}
          onChange={(e) => {
            setError(controlId, { message: '' });
            register(controlId).onChange(e);
          }}
        />
      </FloatingLabel>
      {error && (
        <Form.Text id={errorTextId} className='text-danger'>
          {error.message}
        </Form.Text>
      )}
    </Form.Group>
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
