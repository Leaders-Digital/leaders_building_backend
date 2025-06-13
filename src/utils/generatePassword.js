
export const generatePassword = () =>
    Math.random().toString(36).slice(-4) +
    Math.random().toString(36).toUpperCase().slice(-3) +
    Math.floor(Math.random() * 10) + "!";

