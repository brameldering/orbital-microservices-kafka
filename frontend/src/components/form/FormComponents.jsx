import { Form } from 'react-bootstrap';

const FormComponent = ({ controlId, label, type, formik }) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Label className='my-1'>{label}</Form.Label>
      <Form.Control
        name={controlId}
        type={type}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values[controlId]}
      />
      <Form.Text className='text-danger'>
        {formik.touched[controlId] && formik.errors[controlId] ? (
          <div className='text-danger'>{formik.errors[controlId]}</div>
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

const PasswordField = ({ controlId, label, formik }) => {
  return (
    <FormComponent
      controlId={controlId}
      label={label}
      type='password'
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
        onChange={formik.handleChange}
      ></Form.Check>
    </Form.Group>
  );
};

const HiddenTextField = ({ controlId, formik }) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Control
        name={controlId}
        type='hidden'
        value={formik.values[controlId]}
      />
    </Form.Group>
  );
};

export {
  TextField,
  EmailField,
  PasswordField,
  NumberField,
  CheckBoxField,
  HiddenTextField,
};
