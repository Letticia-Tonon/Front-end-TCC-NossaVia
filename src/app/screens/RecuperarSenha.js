import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import logo from "../../../assets/logo.png";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import { useState } from "react";
import { validarEmail } from "../utils/validators";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [emailInvalido, setEmailInvalido] = useState(false);

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
  };

  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />
        <Text style={styles.titulo}> Esqueceu a sua senha?</Text>
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
          callback={() => {
            handleSubmit();
          }}
        ></CTextButton>
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
    marginBottom: 10,
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
});
