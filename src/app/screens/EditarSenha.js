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
import CDatePicker from "../components/CDatePicker";
import {
  validarEmail,
  validarSenha,
  validarTelefone,
  validarCep,
  validarData,
} from "../utils/validators";
import { post } from "../utils/api";

export default function EditarSenha() {
  const [senhaVelha, setSenhaVelha] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");
  
  const [senhaInvalida, setSenhaInvalida] = useState(false);

  const handleSubmit = () => {
    setSenhaInvalida(false);

    // Valida se a senha nova é válida e diferente da antiga
    if (!Object.values(validarSenha(senhaNova)).every((item) => item === true)) {
      setSenhaInvalida(true);
      return;
    }

    if (senhaNova === senhaVelha) {
      setSenhaInvalida(true);
      Alert.alert("Erro", "A nova senha deve ser diferente da senha atual.");
      return;
    }

    // Verifica se a senha nova e a confirmação são iguais
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
            await AsyncStorage.setItem("token", "");
            router.push("screens/Feed?logado=false");
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
            <Link style={styles.seta} href={"/screens/Feed"}>
              <FontAwesomeIcon icon={faArrowLeft} size={32}></FontAwesomeIcon>
            </Link>

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
               setState={setSenhaVelha} // Validar com telefone cadastrado
              error={senhaInvalida}
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
                uma letra minúscula, um número, um caractere especial e deve ser diferente da senha atual
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
