export const validarEmail = (email) => {
  const re = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+((\.[a-z]+)+)?$/i;
  return re.test(email);
};

export const validarSenha = (password) => {
  return {
    digitValid: password.length >= 8,
    upperCaseValid: /[A-Z]/.test(password),
    lowerCaseValid: /[a-z]/.test(password),
    specialCharValid: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    numberValid: /\d/.test(password),
    emptyValid: password.length > 0,
  };
};

export const validarTelefone = (telefone) => {
  const re = /^\d{11}$/;
  return re.test(telefone);
};

export const validarCep = (cep) => {
  const re = /^\d{8}$/;
  return re.test(cep);
};

export const validarData = (date) => {
  const re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return re.test(date);
};
