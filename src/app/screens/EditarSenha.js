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
import { router } from "expo-router";
import CHeader from "../components/CHeader";

export default function EditarSenha() {
  const [loading, setLoading] = useState(false);

  const [senhaAtual, setSenhaAtual] = useState("");
  const [senhaNova, setSenhaNova] = useState("");
  const [confirmarSenhaNova, setConfirmarSenhaNova] = useState("");

  const [senhaAtualInvalida, setSenhaAtualInvalida] = useState(false);
  const [senhaNovaInvalida, setSenhaNovaInvalida] = useState(false);
  const [confirmarSenhaInvalida, setConfirmarSenhaInvalida] = useState(false);

  const handleSubmit = async () => {
    setSenhaNovaInvalida(false);
    setConfirmarSenhaInvalida(false);
    setSenhaAtualInvalida(false);
    let senhaTemp = false;
    let confirmarSenhaTemp = false;
    let senhaAtualTemp = false;

    if (!senhaAtual) {
      senhaAtualTemp = true;
      setSenhaAtualInvalida(true);
    }

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

    if (senhaAtualTemp || senhaTemp || confirmarSenhaTemp) return;

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
            if (loading) return;
            setLoading(true);
            const payload = { senhaAtual: senhaAtual, senhaNova: senhaNova };
            await post("alterar-senha", payload, true).then((data) => {
              setLoading(false);
              if (data.status !== 200) {
                Alert.alert("Ops!", "Ocorreu um erro ao alterar sua senha.");
                return;
              }
              router.push("screens/Feed?logado=true");
              Alert.alert("Sucesso", "Sua senha foi alterada com sucesso.");
            });
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
              showText={true}
              goBack={true}
              showIcon={false}
            />
            <View style={styles.innerContainer}>
              <CPassInput
                placeholder="Senha atual"
                state={senhaAtual}
                setState={setSenhaAtual}
                error={senhaAtualInvalida}
                errorMessage="Campo obrigatório"
              />

              <CPassInput
                placeholder="Nova senha"
                state={senhaNova}
                setState={setSenhaNova}
                error={senhaNovaInvalida}
                errorMessage="Senha inválida"
              />

              {senhaNovaInvalida && (
                <Text style={{ color: "#ff0022" }}>
                  A senha deve conter no mínimo 8 caracteres, uma letra
                  maiúscula, uma letra minúscula, um número e um caractere
                  especial
                </Text>
              )}

              <CPassInput
                placeholder="Confirme sua nova senha"
                state={confirmarSenhaNova}
                setState={setConfirmarSenhaNova}
                error={
                  senhaNova !== confirmarSenhaNova || confirmarSenhaInvalida
                }
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
                loading={loading}
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
