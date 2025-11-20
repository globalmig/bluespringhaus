export {};

declare global {
  interface Window {
    wcs?: {
      inflow?: () => void;
      trans?: (conv: { type: string }) => void;
    };
    wcs_add?: {
      [key: string]: string;
    };
    wsa?:{
  cnv: (type: string, value: number, code: string) => void;
  inflow?: (domain: string) => void;
}
  }
}