// RegExp-
export const validateLength = (value: string, maxLength: number) => value.length > maxLength;
export const validatePattern = (value: string, pattern: RegExp) => !pattern.test(value);

// RegExp Pattern
export const PatternUsername: RegExp = /^[a-zA-Z0-9_.@]*$/;
export const PatternPassword: RegExp = /^[a-zA-Z0-9]*$/;
