import React, { useState } from 'react';
import { Form, InputGroup, Button } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

// interface FormikComponentProps {
//   controlId: string;
//   label: string;
//   type: string;
//   formik: any;
// }

// interface FormikFieldProps {
//   controlId: string;
//   label: string;
//   formik: any;
// }

// interface FormikHiddenFieldProps {
//   controlId: string;
//   formik: any;
// }

const FormComponent = ({ controlId, label, type, formik }) => {
  const errorDivId = 'error_text_' + controlId;
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Label className='mt-1 mb-0'>{label}</Form.Label>
      <Form.Control
        name={controlId}
        type={type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[controlId]}
      />
      <Form.Text className='text-danger'>
        {formik.touched[controlId] && formik.errors[controlId] ? (
          <div id={errorDivId} className='text-danger'>
            {formik.errors[controlId]}
          </div>
        ) : null}
      </Form.Text>
    </Form.Group>
  );
};

const TextField = ({ controlId, label, formik }) => {
  return (
    <FormComponent
      controlId={controlId}
      label={label}
      type='text'
      formik={formik}
    />
  );
};

const EmailField = ({ controlId, label, formik }) => {
  return (
    <FormComponent
      controlId={controlId}
      label={label}
      type='email'
      formik={formik}
    />
  );
};

const NumberField = ({ controlId, label, formik }) => {
  return (
    <FormComponent
      controlId={controlId}
      label={label}
      type='number'
      formik={formik}
    />
  );
};

const CheckBoxField = ({ controlId, label, formik }) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Check
        name={controlId}
        label={label}
        checked={formik.values[controlId]}
        onChange={formik.handleChange}></Form.Check>
    </Form.Group>
  );
};

const HiddenTextField = ({ controlId, formik }) => {
  return (
    <Form.Control
      name={controlId}
      type='hidden'
      value={formik.values[controlId]}
    />
  );
};

const PasswordField = ({ controlId, label, formik }) => {
  const [contentVisible, setContentVisible] = useState(false);
  const showPassword = () => {
    setContentVisible(true);
  };
  const hidePassword = () => {
    setContentVisible(false);
  };

  const errorDivId = 'error_text_' + controlId;

  return (
    <>
      <Form.Group className='my-2' controlId={controlId}>
        <Form.Label className='mt-1 mb-0'>{label}</Form.Label>
        <InputGroup>
          <Form.Control
            name={controlId}
            type={contentVisible ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values[controlId]}
          />
          <Button
            className='btn-outline'
            style={{ position: 'relative' }}
            onMouseDown={showPassword}
            onMouseUp={hidePassword}
            onBlur={hidePassword}
            type='button'>
            {contentVisible ? <FaEye /> : <FaEyeSlash />}
          </Button>
        </InputGroup>
        <Form.Text className='text-danger'>
          {formik.touched[controlId] && formik.errors[controlId] ? (
            <div id={errorDivId} className='text-danger'>
              {formik.errors[controlId]}
            </div>
          ) : null}
        </Form.Text>
      </Form.Group>
    </>
  );
};

const TextAreaField = ({ controlId, label, formik }) => {
  const errorDivId = 'error_text_' + controlId;

  return (
    <>
      <Form.Group className='my-2' controlId={controlId}>
        <Form.Label className='mt-1 mb-0'>{label}</Form.Label>
        <Form.Control
          as='textarea'
          rows={3}
          style={{ lineHeight: '1.5' }}
          name={controlId}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values[controlId]}
        />
        <Form.Text className='text-danger'>
          {formik.touched[controlId] && formik.errors[controlId] ? (
            <div id={errorDivId} className='text-danger'>
              {formik.errors[controlId]}
            </div>
          ) : null}
        </Form.Text>
      </Form.Group>
    </>
  );
};

export {
  TextField,
  EmailField,
  NumberField,
  CheckBoxField,
  HiddenTextField,
  PasswordField,
  TextAreaField,
};
