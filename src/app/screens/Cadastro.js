import { StyleSheet, View, ScrollView, Text} from "react-native";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import { Link } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";

export default function Cadastro() {
  return (
    <ScrollView>
      <View style={{ ...styles.container, width: "100%" }}>
        <View style={styles.container}>
          <Link style={styles.seta} href={"/screens/Login"}>
            <FontAwesomeIcon icon={faArrowLeft} size={32}></FontAwesomeIcon>
          </Link>

          <Text style={{fontSize:28, fontWeight:"bold", marginBottom:30, marginTop:20 }}> Cadastre-se</Text>

          <CTextInput placeholder="Nome"></CTextInput>

          <CTextInput placeholder="E-mail"></CTextInput>

          <CTextInput placeholder="Senha"></CTextInput>

          <CTextInput placeholder="Confirme sua senha"></CTextInput>

          <CTextInput placeholder="Telefone"></CTextInput>

          <CTextInput placeholder="Sexo"></CTextInput>

          <CTextInput placeholder="Data de nascimento"></CTextInput>

          <CTextInput placeholder="CEP"></CTextInput>

          <CTextInput placeholder="Endereço"></CTextInput>

          <CTextInput placeholder="Número"></CTextInput>

          <CTextInput placeholder="Complemento"></CTextInput>

          <CTextButton 
            buttonStyle={{
              backgroundColor: "#FF7C33",
            }}
            textStyle={{
              color: "#FFFFFF",
            }}
            text="Criar conta"
          ></CTextButton>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingVertical: 20,
  },
  seta: {
    position: "absolute",
    top: -10,
    left: 1,
  },
});
