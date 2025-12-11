import "@emotion/react";

declare module "@emotion/react" {
  export interface Theme {
    colors: {
      primary: string;
      secondary: string;
      danger: string;
      success: string;
      main: string;
      light: string;
      dark: string;
      white: string;
      black: string;
    };
    fontFamilies: {
      primary: string;
      secondary: string;
      monospace: string;
    };
    fontSizes: {
      xxs: number;
      xs: number;
      sd: number;
      sm: number;
      md: number;
      lg: number;
    };
    containers: {
      md: number;
      lg: number;
    };
    breakpoint: {
      mobile: number;
      tablet: number;
      smallLaptop: number;
      desktop: number;
    };
    spaces: {
      xxs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
      xxxl: number;
    };
  }
}
