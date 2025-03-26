console.log("JS CONECTADO!"); // Mensagem no console para indicar que o JavaScript foi carregado corretamente

// Captura os elementos do formulário e os campos de entrada
const formulario = document.getElementById("cadastroForm");
const nome = document.getElementById("nome");
const email = document.getElementById("email");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const celular = document.getElementById("celular");
const cpf = document.getElementById("cpf");
const rg = document.getElementById("rg");
const msgError = document.getElementsByClassName("msgError");

// Função para exibir mensagens de erro no formulário
const createDisplayMsgError = (mensagem) => {
  msgError[0].textContent = mensagem;
};

// Função para validar o nome, permitindo apenas letras e espaços
const checkNome = () => {
  const nomeRegex = /^[A-Za-zÀ-ÿ\s]+$/;
  return nomeRegex.test(nome.value);
};

// Função para validar o e-mail, aceitando apenas domínios específicos (Gmail, Outlook, Hotmail)
const checkEmail = (email) => {
  const partesEmail = email.split("@");

  if (
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "gmail.com") ||
    (partesEmail.length === 2 &&
      partesEmail[1].toLowerCase() === "outlook.com") ||
    (partesEmail.length === 2 && partesEmail[1].toLowerCase() === "hotmail.com")
  ) {
    return true;
  } else {
    return false;
  }
};

// Função para verificar se as senhas digitadas são iguais
function checkPasswordMatch() {
  return senha.value === confirmarSenha.value ? true : false;
}

// Adiciona máscara ao número de celular
document.getElementById("celular").addEventListener("input", maskPhoneNumber);

function maskPhoneNumber(event) {
  let celular = event.target.value;
  let errorMessage = document.getElementById("error-message");

  // Verifica se há caracteres inválidos no número de telefone
  if (/[A-Za-zÀ-ÿ]/.test(celular)) {
    errorMessage.textContent = "O celular deve conter apenas números!";
    errorMessage.style.color = "red";
  } else {
    errorMessage.textContent = "";
  }

  // Remove caracteres não numéricos
  celular = celular.replace(/\D/g, "");

  // Limita o tamanho do número para 11 dígitos
  if (celular.length > 11) {
    celular = celular.substring(0, 11);
  }

  // Aplica a formatação do número (DDD)
  if (celular.length > 2) {
    celular = `(${celular.substring(0, 2)}) ${celular.substring(2)}`;
  } else if (celular.length > 0) {
    celular = `(${celular}`;
  }

  // Adiciona hífen ao número caso tenha 10 ou mais dígitos
  if (celular.length > 10) {
    celular = celular.replace(/(\(\d{2}\)) (\d{5})(\d{1,4})/, "$1 $2-$3");
  }

  event.target.value = celular;
}

// Adiciona máscara ao CPF
function maskCPF(event) {
  let cpf = event.target.value;

  // Verifica se há caracteres inválidos no CPF
  if (/[A-Za-zÀ-ÿ]/.test(cpf)) {
    createDisplayMsgError("O CPF deve conter apenas números!");
  } else {
    createDisplayMsgError("");
  }

  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, "");

  // Limita o CPF a 11 dígitos
  if (cpf.length > 11) {
    cpf = cpf.substring(0, 11);
  }

  // Aplica a formatação do CPF (XXX.XXX.XXX-XX)
  if (cpf.length > 10) {
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }

  event.target.value = cpf;
}

// Adiciona o evento de input ao campo CPF
cpf.addEventListener("input", maskCPF);

// Função para verificar a força da senha com base em critérios específicos
function checkPasswordStrength(senha) {
  if (!/[a-z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra minúscula!";
  }
  if (!/[A-Z]/.test(senha)) {
    return "A senha deve ter pelo menos uma letra maiúscula!";
  }
  if (!/[\W_]/.test(senha)) {
    return "A senha deve ter pelo menos um caractere especial!";
  }
  if (!/\d/.test(senha)) {
    return "A senha deve ter pelo menos um número!";
  }
  if (senha.length < 8) {
    return "A senha deve ter pelo menos 8 caracteres!";
  }

  return null;
}

// Função para validar os dados do formulário e exibir mensagens de erro antes do envio
function fetchDatas(event) {
  event.preventDefault();

  if (!checkNome()) {
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
    return;
  }

  if (!checkEmail(email.value)) {
    createDisplayMsgError("O e-mail digitado não é válido!");
    return;
  }

  if (!checkPasswordMatch()) {
    createDisplayMsgError("As senhas digitadas não coincidem!");
    return;
  }

  const senhaError = checkPasswordStrength(senha.value);
  if (senhaError) {
    createDisplayMsgError(senhaError);
    return;
  }

  if (celular.value && /[A-Za-zÀ-ÿ]/.test(celular.value)) {
    createDisplayMsgError("O telefone deve conter apenas números");
    return;
  }

  // Cria um objeto com os dados do formulário
  const formData = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    celular: celular.value,
    cpf: cpf.value,
    rg: rg.value,
  };

  // Exibe os dados no console
  console.log("Formulário Enviado: ", JSON.stringify(formData, null, 2));
}

// Adiciona o evento de submissão ao formulário
formulario.addEventListener("submit", fetchDatas);

// Adiciona eventos de input para validação dinâmica
nome.addEventListener("input", () => {
  if (nome.value && !checkNome()) {
    createDisplayMsgError(
      "O nome não pode conter números ou caracteres especiais!"
    );
  } else {
    createDisplayMsgError("");
  }
});

email.addEventListener("input", () => {
  if (email.value && !checkEmail(email.value)) {
    createDisplayMsgError("O e-mail digitado não é válido!");
  } else {
    createDisplayMsgError("");
  }
});

senha.addEventListener("input", () => {
  if (senha.value && checkPasswordStrength(senha.value)) {
    createDisplayMsgError(checkPasswordStrength(senha.value));
  } else {
    createDisplayMsgError("");
  }
});

// Função para criar efeito de chuva animada na interface
const rainFunction = () => {
  let rain = document.createElement("span");
  let cont_rain = document.getElementsByClassName("container_rain");
  let left = Math.floor(Math.random() * (310 - 65) + 65);
  let duration = Math.random() * 5;

  rain.classList.add("rain");
  cont_rain[0].appendChild(rain);
  rain.style.left = left + "px";
  rain.style.animationDuration = 1 + duration;

  // Remove o elemento de chuva após um tempo para não sobrecarregar o DOM
  setTimeout(() => {
    cont_rain[0].removeChild(rain);
  }, 1500);
};

// Configura um intervalo para criar o efeito de chuva repetidamente
setInterval(() => {
  rainFunction();
}, 250);
