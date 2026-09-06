import {Component, type ErrorInfo, type ReactNode} from 'react';
import {Alert, AlertTitle, Button, Stack} from '@mui/material';

export interface NimbusErrorBoundaryProps {
  children: ReactNode;
}

interface NimbusErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render errors from its subtree and shows a fallback message
 * instead of leaving the app blank after a crash.
 */
export class NimbusErrorBoundary extends Component<
  NimbusErrorBoundaryProps,
  NimbusErrorBoundaryState
> {
  state: NimbusErrorBoundaryState = {error: null};

  static getDerivedStateFromError(error: Error): NimbusErrorBoundaryState {
    return {error};
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Nimbus app crashed:', error, info.componentStack);
  }

  render() {
    const {error} = this.state;

    if (error) {
      return (
        <Stack sx={{p: 4}} spacing={2} alignItems="flex-start">
          <Alert severity="error">
            <AlertTitle>Something went wrong</AlertTitle>
            {error.message}
          </Alert>
          <Button variant="outlined" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </Stack>
      );
    }

    return this.props.children;
  }
}
