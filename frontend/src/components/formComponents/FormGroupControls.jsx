import { Form } from 'react-bootstrap';

const FormGroupComponent = ({ controlId, label, type, value, onChange }) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Label className='my-1'>{label}</Form.Label>
      <Form.Control
        type={type}
        placeholder={`Enter ${label}`}
        value={value}
        onChange={onChange}
      ></Form.Control>
    </Form.Group>
  );
};

const FormGroupTextEdit = ({ controlId, label, value, onChange }) => {
  return (
    <FormGroupComponent
      controlId={controlId}
      label={label}
      type='text'
      placeholder={`Enter ${controlId}`}
      value={value}
      onChange={onChange}
    />
  );
};

const FormGroupEmailEdit = ({ controlId, label, value, onChange }) => {
  return (
    <FormGroupComponent
      controlId={controlId}
      label={label}
      type='email'
      placeholder={`Enter ${controlId}`}
      value={value}
      onChange={onChange}
    />
  );
};

const FormGroupPasswordEdit = ({ controlId, label, value, onChange }) => {
  return (
    <FormGroupComponent
      controlId={controlId}
      label={label}
      type='password'
      placeholder={`Enter ${controlId}`}
      value={value}
      onChange={onChange}
    />
  );
};

const FormGroupNumberEdit = ({ controlId, label, value, onChange }) => {
  return (
    <FormGroupComponent
      controlId={controlId}
      label={label}
      type='number'
      placeholder={`Enter ${controlId}`}
      value={value}
      onChange={onChange}
    />
  );
};

const FormGroupCheckBox = ({ controlId, label, checked, onChange }) => {
  return (
    <Form.Group className='my-2' controlId={controlId}>
      <Form.Check
        type='checkbox'
        label={label}
        checked={checked}
        onChange={onChange}
      ></Form.Check>
    </Form.Group>
  );
};

export {
  FormGroupTextEdit,
  FormGroupEmailEdit,
  FormGroupPasswordEdit,
  FormGroupCheckBox,
  FormGroupNumberEdit,
};
