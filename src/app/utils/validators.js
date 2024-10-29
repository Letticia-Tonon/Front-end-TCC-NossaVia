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
  const re = /^\(\d{2}\)\s\d{5}\-\d{4}$/;
  return re.test(telefone);
};

export const validarCep = (cep) => {
  const re = /^\d{5}\-\d{3}$/;
  return re.test(cep);
};

export const validarData = (date) => {
  const re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!re.test(date)) {
    return false;
  }

  const [day, month, year] = date.split('/').map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  const dayDiff = today.getDate() - birthDate.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 16;
};

export const validarCpf = (cpf) => {
  const re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/;
  return re.test(cpf);
};

