/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Form, FloatingLabel, InputGroup, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// =================== FormField ====================
// = default form field used for text, number, etc. =
// ==================================================

interface FormFieldProps {
  controlId: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const FormField: React.FunctionComponent<FormFieldProps> = ({
  controlId,
  label,
  type = 'text',
  value = '',
  onChange = () => {},
  onBlur = () => {},
}) => {
  return (
    <FloatingLabel controlId={controlId} label={label} className='my-3'>
      <Form.Control
        style={{ borderColor: '#606060' }}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FloatingLabel>
  );
};

// ================== CheckBoxField ==================

interface CheckBoxFieldProps {
  controlId: string;
  label: string;
  checked: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckBoxField: React.FunctionComponent<CheckBoxFieldProps> = ({
  controlId,
  label,
  checked,
  onChange = () => {},
}) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Check
        name={controlId}
        label={label}
        checked={checked}
        onChange={onChange}></Form.Check>
    </Form.Group>
  );
};

// ================== PasswordField ==================

interface PasswordFieldProps {
  controlId: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const PasswordField: React.FunctionComponent<PasswordFieldProps> = ({
  controlId,
  label,
  value = '',
  onChange = () => {},
  onBlur = () => {},
}) => {
  const [contentVisible, setContentVisible] = useState(false);
  const showPassword = () => {
    setContentVisible(true);
  };
  const hidePassword = () => {
    setContentVisible(false);
  };
  return (
    <>
      <InputGroup>
        <FloatingLabel controlId={controlId} label={label} className='mb-3'>
          <Form.Control
            type={contentVisible ? 'text' : 'password'}
            style={{ borderColor: '#606060' }}
            placeholder={label}
            value={value}
            onChange={onChange}
            onBlur={onBlur}
          />
        </FloatingLabel>
        <Button
          type='button'
          className='btn-outline'
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
    </>
  );
};

// ================== TextAreaField ==================

interface TextAreaFieldProps {
  controlId: string;
  label: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

const TextAreaField: React.FunctionComponent<TextAreaFieldProps> = ({
  controlId,
  label,
  value = '',
  onChange = () => {},
  onBlur = () => {},
}) => {
  return (
    <FloatingLabel controlId={controlId} label={label} className='mb-3'>
      <Form.Control
        as='textarea'
        rows={3}
        style={{ height: '100px', lineHeight: '1.5', borderColor: '#606060' }}
        placeholder={label}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
    </FloatingLabel>
  );
};

export { FormField, CheckBoxField, PasswordField, TextAreaField };
