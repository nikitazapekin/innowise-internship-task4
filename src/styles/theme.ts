import type { Theme } from "@emotion/react";

export const emotionTheme: Theme = {
  colors: {
    primary: "#272626",
    secondary: "#404441",
    danger: "#ff0000",
    success: "#4caf50",
    main: "#1976d2",
    light: "#42a5f5",
    dark: "#1565c0",
    white: "#fff",
    black: "#000",
  },
  fontFamilies: {
    primary: '"Inter", sans-serif',
    secondary: '"Georgia", serif',
    monospace: '"Fira Code", monospace',
  },
  fontSizes: {
    xxs: 14,
    xs: 18,
    sd: 20,
    sm: 24,
    md: 28,
    lg: 32,
  },
  containers: {
    md: 1200,
    lg: 1400,
  },
  breakpoint: {
    mobile: 400,
    tablet: 768,
    smallLaptop: 1024,
    desktop: 1400,
  },
  spaces: {
    xxs: 5,
    sm: 20,
    md: 40,
    lg: 80,
    xl: 100,
    xxl: 200,
    xxxl: 300,
  },
};

export const themeUtils = {
  mediaQueries: {
    mobile: `@media (max-width: ${emotionTheme.breakpoint.mobile}px)`,
    tablet: `@media (max-width: ${emotionTheme.breakpoint.tablet}px)`,
    smallLaptop: `@media (max-width: ${emotionTheme.breakpoint.smallLaptop}px)`,
    desktop: `@media (max-width: ${emotionTheme.breakpoint.desktop}px)`,

    mobileUp: `@media (min-width: ${emotionTheme.breakpoint.mobile}px)`,
    tabletUp: `@media (min-width: ${emotionTheme.breakpoint.tablet}px)`,
    smallLaptopUp: `@media (min-width: ${emotionTheme.breakpoint.smallLaptop}px)`,
    desktopUp: `@media (min-width: ${emotionTheme.breakpoint.desktop}px)`,
  },

  container: {
    md: `max-width: ${emotionTheme.containers.md}px`,
    lg: `max-width: ${emotionTheme.containers.lg}px`,
  },
};
export const globalStyles = {
  global: (theme: Theme) => `
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    html {
      font-size: ${theme.fontSizes.xs};
      font-family: ${theme.fontFamilies.primary};
     
    }
    
    body {
      color: ${theme.colors.dark};
      background-color: ${theme.colors.white};
     
    }
    
    h1, h2, h3, h4, h5, h6 {
      font-family: ${theme.fontFamilies.secondary};
    
    }
    
    h1 {
      font-size: ${theme.fontSizes.lg}px;
    }
    
    h2 {
      font-size: ${theme.fontSizes.md}px;
    }
    
    h3 {
      font-size: ${theme.fontSizes.sm}px;
    }
       h4 {
      font-size: ${theme.fontSizes.sd}px;
    }
    
    h5 {
      font-size: ${theme.fontSizes.xs}px;
    }
    
    h6 {
      font-size: ${theme.fontSizes.xxs}px;
    }

    
 
    a {
      color: ${theme.colors.primary};
      text-decoration: none;
    }

    .container-md {
      max-width: ${theme.containers.md}px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .container-lg {
      max-width: ${theme.containers.lg}px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    
    .wrapper {
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      
    }
    
    .content {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
    }
     
  `,

  mixins: {
    flexCenter: `
      display: flex;
      justify-content: center;
      align-items: center;
    `,

    flexBetween: `
      display: flex;
      justify-content: space-between;
      align-items: center;
    `,

    absoluteCenter: `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `,
  },
};

export default emotionTheme;
