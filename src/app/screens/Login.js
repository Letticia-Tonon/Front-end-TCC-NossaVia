import { StyleSheet, View, Text } from "react-native";
import { router  } from "expo-router";
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
          placeholder="E-mail"
        ></CTextInput>

        <CTextInput
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
    margin: 5,
    alignItems: "flex-end",
  },
});
