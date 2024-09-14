import { StyleSheet, View, Text, Image, StatusBar } from "react-native";
import { router } from "expo-router";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import logo from "../../../assets/Logo_Fe_VF.png";
import { useState } from "react";
import { post } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaIncorreta, setSenhaIncorreta] = useState(false);

  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />

        {senhaIncorreta && (
          <View style={styles.viewSenhaIncorreta}>
            <Text
              style={{ color: "#ff0022", fontWeight: "bold", fontSize: 20 }}
            >
              E-mail ou senha inválidos
            </Text>
          </View>
        )}

        <CTextInput placeholder="E-mail" setState={setEmail}></CTextInput>

        <CPassInput placeholder="Senha" setState={setSenha}></CPassInput>

        <View style={styles.viewEsqueciSenha}>
          <Text style={{ color: "#a9a9a9" }}>
            Esqueceu sua senha?{" "}
            <Text style={{ color: "#a9a9a9", fontWeight: "bold" }}>
              Clique aqui
            </Text>
          </Text>
        </View>

        <CTextButton
          buttonStyle={{
            backgroundColor: "#FF7C33",
          }}
          textStyle={{
            color: "#FFFFFF",
          }}
          text="Login"
          callback={() => {
            setSenhaIncorreta(false);
            post("login", { email: email, senha: senha }).then((data) => {
              if (data.status !== 200) {
                AsyncStorage.setItem("token", "");
                setSenhaIncorreta(true);
                return;
              }
              data.json().then((data) => {
                AsyncStorage.setItem("token", data.token);
                router.push("screens/Feed?logado=true");
              });
            });
          }}
        ></CTextButton>

        <View style={styles.viewEsqueciSenha}>
          <Text style={{ color: "#a9a9a9", justifyContent: "left" }}>
            Ainda não tem uma conta?{" "}
            <Text
              style={{ color: "#a9a9a9", fontWeight: "bold" }}
              onPress={() => router.push("screens/Cadastro")}
            >
              Cadastre-se
            </Text>
          </Text>
        </View>
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
  viewSenhaIncorreta: {
    display: "flex",
    width: "100%",
    margin: 5,
    alignItems: "center",
  },
  viewEsqueciSenha: {
    display: "flex",
    width: "100%",
    margin: 5,
    alignItems: "center",
  },
  image: {
    width: 300, // Largura da imagem
    height: 200, // Altura da imagem
    marginBottom: 10, // Espaço abaixo da imagem
    marginLeft: 18,
    marginTop: -30,
    resizeMode: "contain", // Mantém a proporção da imagem
  },
});
