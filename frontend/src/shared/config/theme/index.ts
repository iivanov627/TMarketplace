import { createTheme, type CSSVariablesResolver, type MantineColorsTuple } from '@mantine/core';

const yellowBrand: MantineColorsTuple = [
  "#fffce1",
  "#fff8cb",
  "#ffef9a",
  "#ffe764",
  "#ffdf38",
  "#ffdb1c",
  "#ffd701",
  "#e3bf00",
  "#caaa00",
  "#ae9200"
]

export const theme = createTheme({

  primaryColor: 'yellowBrand',
  autoContrast: true,
  colors: { yellowBrand },
  fontFamily: 'Inter, sans-serif',
  headings: { fontFamily: 'Inter, sans-serif' },
  defaultRadius: 8, 

  other: {
    backgroundColor: '#F8F9FF',
    borderColor: '#DEE2E6',
  },

  components: {
    Button: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
      styles: {
        root: {
          fontWeight: 600,
          color: '#000000',
        },
        label: { color: '#000000' },
      },
    },
    TextInput: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
    },
    PasswordInput: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
    },
    Select: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
    },
    Textarea: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
    },
    NumberInput: {
      defaultProps: {
        radius: 'lg',
        size: 'lg',
      },
    },
    Checkbox: {
      defaultProps: {
        radius: 'md',
      },
    },
    Radio: {
      defaultProps: {
        radius: 4,
      },
    },
    Switch: {
      defaultProps: {
        radius: 32,
      },
    },
    Pagination: {
      defaultProps: {
        radius: 8,
      },
    },
    SegmentedControl: {
      defaultProps: {
        radius: 8,
      },
    },
    Badge: {
      defaultProps: {
        radius: 8,
      },
    },
    Modal: {
      defaultProps: {
        radius: 20,
        centered: true,
        overlayProps: { backgroundOpacity: 0.4, blur: 3 },
      },
    },
    Card: {
      defaultProps: {
        radius: 16,
        withBorder: true,
      },
      styles: {
        root: {
          backgroundColor: '#FFFFFF',
          borderColor: '#DEE2E6',
        },
      },
    },
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (currentTheme) => ({
  variables: {},
  light: {
    '--mantine-color-body': currentTheme.other.backgroundColor,
  },
  dark: {},
});