import {createTheme, type Theme, type ThemeOptions} from '@mui/material/styles';

const baseThemeOptions: ThemeOptions = {
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
};

/**
 * Builds a Nimbus Labs app's theme from the shared base (typography, shape)
 * plus that app's own overrides (e.g. its accent palette), so every app
 * looks distinct while still reading as one family.
 */
export function createNimbusTheme(overrides: ThemeOptions = {}): Theme {
  return createTheme(baseThemeOptions, overrides);
}
