import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
} from "react-native";
import logo from "../../../assets/logo.png";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import { useState, useRef } from "react";
import { validarEmail } from "../utils/validators";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false); // Novo estado para exibir o campo de código
  const [codigo, setCodigo] = useState(Array(6).fill("")); // Estado para os 6 dígitos do código
  const [codigoInvalido, setCodigoInvalido] = useState(false); // Estado para o erro de código

  // Criação das referências para os campos de código
  const inputRefs = useRef([]);

  const handleSubmit = async () => {
    setEmailInvalido(false);
    let emailTemp = false;

    if (!validarEmail(email)) {
      emailTemp = true;
      setEmailInvalido(true);
    }

    if (emailTemp) {
      return;
    }
    setIsEmailSent(true);
  };

  const handleCodigoSubmit = async () => {
    setCodigoInvalido(false);
    if (codigo.some((char) => char === "")) {
      setCodigoInvalido(true);
      return;
    }

    console.log("Código enviado:", codigo.join(""));
  };

  const handleCodigoChange = (text, index) => {
    let newCodigo = [...codigo];
    
    // Atualiza o valor do campo atual
    newCodigo[index] = text;
    setCodigo(newCodigo);
  
    // Verifica se o usuário está apagando um caractere (o campo ficou vazio)
    if (text === "" && index > 0) {
      inputRefs.current[index - 1].focus(); // Move o foco para o campo anterior
    }
  
    // Move o foco para o próximo campo, caso não esteja vazio e não seja o último campo
    if (text !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  
    // Verifica se todos os campos foram preenchidos
    if (newCodigo.every((char) => char !== "")) {
      setCodigoInvalido(false);
    }
  };
  

  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />

        {isEmailSent ? (
          <>
            <Text style={styles.titulo}>Esqueceu sua senha?</Text>
            <Text style={styles.texto}>
              Informe o código recebido por e-mail abaixo.
            </Text>

            <View style={styles.codeInputContainer}>
              {Array(6)
                .fill()
                .map((_, index) => (
                  <TextInput
                    key={index}
                    style={[
                      styles.codeInput,
                      codigoInvalido && styles.errorBorder,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={codigo[index]}
                    onChangeText={(text) => handleCodigoChange(text, index)}
                    ref={(el) => (inputRefs.current[index] = el)} // referência por campo
                  />
                ))}
            </View>

            {codigoInvalido && (
              <Text style={styles.errorText}>
                Por favor, preencha todos os campos de código.
              </Text>
            )}

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Enviar"
              callback={handleCodigoSubmit}
            />
          </>
        ) : (
          <>
            <Text style={styles.titulo}>Esqueceu a sua senha?</Text>
            <Text style={styles.texto}>
              Sem problemas! Informe seu e-mail de cadastro e enviaremos as
              instruções para que você possa redefinir sua senha.
            </Text>

            <CTextInput
              placeholder="E-mail"
              state={email}
              setState={setEmail}
              error={emailInvalido}
              errorMessage="E-mail inválido"
            />

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Enviar"
              callback={handleSubmit}
            />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    marginLeft: 18,
    marginTop: -30,
    resizeMode: "contain",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 30,
  },
  texto: {
    fontSize: 18,
    textAlign: "center",
    padding: 15,
  },
  codeInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 20,
    width: "90%", 
  },
  codeInput: {
    width: 45,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
    textAlign: "center",
    fontSize: 18,
  },
  errorBorder: {
    borderColor: "#ff0022",
  },
  errorText: {
    color: "#ff0022",
    marginBottom: 10,
    marginTop: -15,
    fontSize: 14,
  },
});
