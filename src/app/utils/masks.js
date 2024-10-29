export const cepMask = (text) => {
  return text
    .replace(/\D/g, "")
    .replace(/(\d{5})(\d{1,3})/, "$1-$2")
    .replace(/(-\d{3})\d+?$/, "$1");
};

export const phoneMask = (text) => {
  return text
    .replace(/\D/g, "")
    .replace(/(\d{2})(\d+)/, "($1) $2")
    .replace(/(\(\d{2}\)\s)(\d{5})(\d{1,4})/, "$1$2-$3");
};

export const cpfMask = (text) => { 
  return text
    .replace(/\D/g, "")
    .replace(/(\d{3})(\d{1,3})/, "$1.$2")
    .replace(/(\.\d{3})(\d{1,3})/, "$1.$2")
    .replace(/(\.\d{3})(\d{1,2})/, "$1-$2")
    .replace(/(-\d{2})\d+?$/, "$1");
};