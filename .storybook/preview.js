import { themes } from '@storybook/theming'

export const parameters = {
  darkMode: {
    dark: { ...themes.dark, appBg: 'black', appPreviewBg: 'black'},
    light: { ...themes.normal, appBg: 'white', appPreviewBg: 'white'}
  }
}
