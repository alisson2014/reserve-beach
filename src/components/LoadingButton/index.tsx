import Button, { ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { JSX } from 'react';

interface LoadingButtonProps extends ButtonProps {
  loading: boolean;
}

export default function LoadingButton({
  loading,
  children,
  ...props
}: LoadingButtonProps): JSX.Element {
  return (
    <Button 
      {...props} 
      disabled={loading || props.disabled}
      sx={{
        '&.Mui-disabled': {
          color: 'white',
        },
        ...props.sx,
      }}
    >
      {loading && (
        <CircularProgress
          size={24}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '75%',
            marginTop: '-12px',
            marginLeft: '-12px',
          }}
        />
      )}
      {children}
    </Button>
  );
};

