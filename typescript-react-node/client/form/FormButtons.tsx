import React from 'react';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { secondaryButtonStyles } from 'styles/theme';

interface ButtonProps {
  id: string;
  disabled?: boolean;
  label: string;
}

export const SubmitButton: React.FC<ButtonProps> = ({
  id,
  disabled = false,
  label,
}) => {
  return (
    <Button
      id={id}
      type='submit'
      variant='outlined'
      color='primary'
      disabled={disabled}>
      {label}
    </Button>
  );
};

interface CreateUpdateButtonProps {
  disabled?: boolean;
}

export const CreateSubmitButton: React.FC<CreateUpdateButtonProps> = ({
  disabled = false,
}) => {
  return <SubmitButton id='BUTTON_create' disabled={disabled} label='Create' />;
};

export const UpdateSubmitButton: React.FC<CreateUpdateButtonProps> = ({
  disabled = false,
}) => {
  return <SubmitButton id='BUTTON_update' disabled={disabled} label='Update' />;
};

interface CancelButtonProps {
  disabled?: boolean;
  onClick: any;
}

export const CancelButton: React.FC<CancelButtonProps> = ({
  disabled = false,
  onClick,
}) => {
  const theme = useTheme();
  return (
    <Button
      id='BUTTON_cancel'
      variant='outlined'
      color='primary'
      sx={{ ...secondaryButtonStyles(theme) }}
      disabled={disabled}
      onClick={onClick}>
      Cancel
    </Button>
  );
};
