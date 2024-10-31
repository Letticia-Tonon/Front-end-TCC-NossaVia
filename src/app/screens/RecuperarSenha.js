import {
  StyleSheet,
  View,
  Text,
  Image,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import logo from "../../../assets/logo.png";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import { post, get, put } from "../utils/api";
import { useState, useRef } from "react";
import { validarEmail } from "../utils/validators";
import { validarSenha } from "../utils/validators";
import { router } from "expo-router";

export default function RecuperarSenha() {
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isCodigoSent, setIsCodigoSent] = useState(false);

  const [email, setEmail] = useState("");
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);

  const [codigo, setCodigo] = useState(Array(6).fill(""));
  const [codigoInvalido, setCodigoInvalido] = useState(false);
  const [codigoIncorreto, setCodigoIncorreto] = useState(false);
  const [loadingSenha, setLoadingSenha] = useState(false);

  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");
  const [senhaNovaInvalida, setSenhaNovaInvalida] = useState(false);
  const [confirmarSenhaInvalida, setConfirmarSenhaInvalida] = useState(false);
  const [loadingRecuperar, setLoadingRecuperar] = useState(false);

  const inputRefs = useRef([]);

  const handleSubmitEmail = async () => {
    setEmailInvalido(false);
    let emailTemp = false;

    if (!validarEmail(email)) {
      emailTemp = true;
      setEmailInvalido(true);
    }

    if (emailTemp) {
      return;
    }

    await post("recuperar-senha", { email: email }).then((data) => {
      if (data.status === 200) {
        setIsEmailSent(true);
        return;
      }
      if (data.status === 409) {
        Alert.alert(
          "Ops!",
          "Seu e-mail não foi encontrado na nossa base de dados, por favor verifique se digitou corretamente."
        );
        return;
      }
      Alert.alert(
        "Ops!",
        "Ocorreu um erro inesperado ao enviar o código, tente novamente em alguns instantes."
      );
    });
  };

  const handleSubmitCodigo = async () => {
    setCodigoInvalido(false);
    setCodigoIncorreto(false);
    if (codigo.some((char) => char === "")) {
      setCodigoInvalido(true);
      return;
    }

    await get(`recuperar-senha?email=${email}&token=${codigo.join("")}`).then(
      (data) => {
        if (data.status === 200) {
          setIsCodigoSent(true);
        } else {
          setCodigoIncorreto(true);
        }
      }
    );
  };

  const handleCodigoChange = (text, index) => {
    let newCodigo = [...codigo];
    newCodigo[index] = text;
    setCodigo(newCodigo);

    if (text === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }

    if (text !== "" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }

    if (newCodigo.every((char) => char !== "")) {
      setCodigoInvalido(false);
    }
  };

  const handleSubmitRecuperar = async () => {
    setSenhaNovaInvalida(false);
    setConfirmarSenhaInvalida(false);
    let senhaTemp = false;
    let confirmarSenhaTemp = false;

    if (
      !Object.values(validarSenha(senhaNova)).every((item) => item === true)
    ) {
      senhaTemp = true;
      setSenhaNovaInvalida(true);
    }

    if (senhaNova !== confirmarSenhaNova) {
      confirmarSenhaTemp = true;
      setConfirmarSenhaInvalida(true);
    }

    if (senhaTemp || confirmarSenhaTemp) return;

    await put("recuperar-senha", {
      email: email,
      token: codigo.join(""),
      senhaNova: senhaNova,
    }).then((data) => {
      if (data.status === 200) {
        Alert.alert("Sucesso!", "Sua senha foi alterada com sucesso.", [
          {
            text: "OK",
            onPress: () => {
              router.push("screens/Login");
            },
          },
        ]);
        return;
      }
      Alert.alert("Ops!", "Ocorreu um erro ao alterar sua senha.");
    });
  };

  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />

        {!isEmailSent && !isCodigoSent ? (
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
              loading={loadingEmail}
              callback={() => {
                if (loadingEmail) return;
                setLoadingEmail(true);
                handleSubmitEmail().finally(() => setLoadingEmail(false));
              }}
            />
          </>
        ) : isEmailSent && !isCodigoSent ? (
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
                      (codigoInvalido || codigoIncorreto) && styles.errorBorder,
                    ]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={codigo[index]}
                    onChangeText={(text) => handleCodigoChange(text, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                  />
                ))}
            </View>

            {codigoInvalido && (
              <Text style={styles.errorText}>
                Por favor, preencha todos os campos de código.
              </Text>
            )}

            {codigoIncorreto && (
              <Text style={styles.errorText}>
                Código incorreto, verifique seu e-mail e tente novamente.
              </Text>
            )}
            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Confirmar Token"
              loading={loadingSenha}
              callback={() => {
                if (loadingSenha) return;
                setLoadingSenha(true);
                handleSubmitCodigo().finally(() => setLoadingSenha(false));
              }}
            />
          </>
        ) : (
          <>
            <Text style={styles.titulo}>Esqueceu sua senha?</Text>
            <Text style={styles.texto}>
              Informe a nova senha que deseja utilizar.
            </Text>

            <CPassInput
              placeholder="Nova senha"
              state={senhaNova}
              setState={setSenhaNova}
              error={senhaNovaInvalida}
              errorMessage="Senha inválida"
            />

            {senhaNovaInvalida && (
              <Text style={{ color: "#ff0022" }}>
                A senha deve conter no mínimo 8 caracteres, uma letra maiúscula,
                uma letra minúscula, um número e um caractere especial
              </Text>
            )}

            <CPassInput
              placeholder="Confirme sua nova senha"
              state={confirmarSenhaNova}
              setState={setConfirmarSenhaNova}
              error={senhaNova !== confirmarSenhaNova || confirmarSenhaInvalida}
              errorMessage="As senhas devem ser iguais"
            />

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              loading={loadingRecuperar}
              callback={() => {
                if (loadingRecuperar) return;
                setLoadingRecuperar(true);
                handleSubmitRecuperar().finally(() =>
                  setLoadingRecuperar(false)
                );
              }}
              text="Redefinir Senha"
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
