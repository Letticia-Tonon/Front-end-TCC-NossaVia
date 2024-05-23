import { StyleSheet, View, Text } from "react-native";
import { Link } from "expo-router";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";

export default function Login() {
  return (
    <View style={{ ...styles.container, width: "100%" }}>
      <View style={styles.container}>
        <Text style={{ fontSize: 30, marginBottom: 20 }}>
          Login
        </Text>

        <CTextInput
          style={{ marginBottom: "10px" }}
          placeholder="E-mail"
        ></CTextInput>
        <CTextInput
          style={{ marginBottom: "10px" }}
          placeholder="Senha"
          password={true}
        ></CTextInput>

        <View style={styles.viewEsqueciSenha}>
          <Text style={{ color: "#a9a9a9" }}>
            Esqueceu sua senha?{" "}
            <Text style={{ color: "#a9a9a9", fontWeight: "bold" }}>
              Clique aqui
            </Text>
          </Text>
        </View>

        <Link
          href={"/screens/Feed"}
          style={{ width: "100%", marginBottom: "10px" }}
        >
          <CTextButton
            text="Login"
            foreColor="#FFFFFF"
            backgroundColor="#FF7C33"
          ></CTextButton>
        </Link>

        <View style={styles.viewEsqueciSenha}>
          <Text style={{ color: "#a9a9a9" }}>
            Ainda não tem uma conta?{" "}
            <Text style={{ color: "#a9a9a9", fontWeight: "bold" }}>
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
    marginBottom: "10px",
    alignItems: "flex-end",
  },
});
