import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  StatusBar,
} from "react-native";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import { useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { validarSenha } from "../utils/validators";
import { post } from "../utils/api";
import { router, useLocalSearchParams } from "expo-router";
import CHeader from "../components/CHeader";

export default function EditarSenha() {
  const params = useLocalSearchParams();

  const [senhaAtual, setSenhaAtual] = useState(""); 
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");
  
  const [senhaInvalida, setSenhaInvalida] = useState(false);
  const [senhaCorreta, setSenhaCorreta] = useState(true); 

  const handleSubmit = async () => {
    setSenhaInvalida(false);
    setSenhaCorreta(true);

    if (!Object.values(validarSenha(senhaNova)).every((item) => item === true)) {
      setSenhaInvalida(true);
      Alert.alert("Erro", "A nova senha não atende aos requisitos.");
      return;
    }

    if (senhaNova !== confirmarSenhaNova) {
      setSenhaInvalida(true);
      Alert.alert("Erro", "A confirmação de senha não corresponde à nova senha.");
      return;
    }

    alterar();
  };

  const alterar = async () => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar, sua senha será alterada e você precisará utilizá-la para o próximo acesso",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK",
          onPress: async () => {
            const payload = { senhaAtual: senhaAtual, senhaNova: senhaNova };
            const response = await post("alterar-senha", payload, true);
            if (response.status === 200) {
              router.push("screens/Feed?logado=true");
              Alert.alert("Sucesso", "Sua senha foi alterada com sucesso.");
            } else {
              console.log(response);
              Alert.alert("Erro", "Ocorreu um erro ao alterar sua senha.");
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <ActionSheetProvider>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader
              titulo={"Editar Senha"}
              logado={true}
              goBack={true}
              showIcon={false}
            />
            <View style={styles.innerContainer}>
              <CPassInput
                placeholder="Senha atual"
                state={senhaAtual}
                setState={setSenhaAtual}
                error={!senhaCorreta}
                errorMessage="Senha incorreta"
              />

              <CPassInput
                placeholder="Nova senha"
                state={senhaNova}
                setState={setSenhaNova}
                error={senhaInvalida}
                errorMessage="Senha inválida"
              />

              {senhaInvalida && (
                <Text style={{ color: "#ff0022" }}>
                  A senha deve conter no mínimo 8 caracteres, uma letra maiúscula,
                  uma letra minúscula, um número e um caractere especial
                </Text>
              )}

              <CPassInput
                placeholder="Confirme sua nova senha"
                state={confirmarSenhaNova}
                setState={setConfirmarSenhaNova}
                error={senhaNova !== confirmarSenhaNova}
                errorMessage="As senhas devem ser iguais"
              />

              <View style={{ padding: 20 }}></View>

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Alterar senha"
              callback={handleSubmit}
            />
            </View>
          </View>
        </View>
      </ScrollView>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 5,
  },
  innerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: "70%",
  },
});
