import { StyleSheet, View, Text, Image } from "react-native";
import { router } from "expo-router";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import logo from "../../../assets/Logo_Fe_VF.png";

export default function Login() {
  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <View style={styles.container}>
        <Image source={logo} style={styles.image} />

        <CTextInput placeholder="E-mail"></CTextInput>

        <CPassInput placeholder="Senha"></CPassInput>

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
            router.push("screens/Feed");
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
  viewEsqueciSenha: {
    display: "flex",
    width: "100%",
    margin: 5,
    alignItems: "flex-start",
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