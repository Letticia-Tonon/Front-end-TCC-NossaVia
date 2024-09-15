import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  StatusBar,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import { Link } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { validarSenha } from "../utils/validators";
import { post } from "../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage"; 
import { router, useLocalSearchParams } from "expo-router";
import CHeader from "../components/CHeader";

export default function EditarSenha() {
  const params = useLocalSearchParams();

  const [senhaVelha, setSenhaVelha] = useState(""); 
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
    const token = await AsyncStorage.getItem("token");
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
            const payload = { senhaAtual: senhaVelha, senhaNova };
            const response = await post("usuario/alterarSenha", payload, true, {
              Authorization: `Bearer ${token}`,
            });

            if (response.status === 200) {
              await AsyncStorage.setItem("token", "");
              router.push("screens/Feed?logado=false");
              Alert.alert("Sucesso", "Sua senha foi alterada com sucesso.");
            } else {
              Alert.alert("Erro", response.data.msg || "Ocorreu um erro ao alterar sua senha.");
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
      <ScrollView>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
          <CHeader
              titulo={"Alter"}
              logado={true}
              goBack={true}
              showIcon={true}
            />

            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                marginBottom: 30,
                marginTop: 20,
              }}
            >
              Editar senha
            </Text>

            <CPassInput
              placeholder="Senha atual"
              state={senhaVelha}
              setState={setSenhaVelha}
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
      </ScrollView>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingTop: 20,
    paddingBottom: 10,
  },
  seta: {
    position: "absolute",
    top: -10,
    left: 1,
  },
});
