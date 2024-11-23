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

  const [day, month, year] = date.split("/").map(Number);
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

export const validarCpf = (strCPF) => {
  let Soma = 0;
  let Resto;
  strCPF = strCPF.replace(/\D/g, "");
  const invalidos = [
    "00000000000",
    "11111111111",
    "22222222222",
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
    "88888888888",
    "99999999999",
  ];
  try {
    if (invalidos.includes(strCPF)) return false;
    if (strCPF.length !== 11) return false;

    for (let i = 1; i <= 9; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    }
    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) {
      Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    }
    Resto = (Soma * 10) % 11;

    if (Resto === 10 || Resto === 11) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  } catch (error) {
    console.error(error);
  }
};
