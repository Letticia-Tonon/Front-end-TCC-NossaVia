import { StyleSheet, View, StatusBar, Alert } from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";

const Feed = observer(() => {
  const { logado } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
      <CHeader
        titulo={"Feed"}
        logado={logado === "true"}
        showText={logado === "true"}
        goBack={false}
        showIcon={true}
      />
      <View style={styles.feed}>
        <CTextButton
          buttonStyle={{
            backgroundColor: "#FF7C33",
          }}
          textStyle={{
            color: "#FFFFFF",
          }}
          text="Criar denúncia"
          callback={() => {
            if (logado === "false") {
              Alert.alert(
                "Atenção!",
                "Para criar uma denúncia você precisa entrar na sua conta.",
                [
                  {
                    text: "Cancelar",
                  },
                  {
                    text: "Entrar",
                    onPress: () => {
                      router.push("screens/Login");
                    },
                  },
                ],
                {
                  cancelable: true,
                }
              );
              return;
            }
            router.push("screens/CriarDenuncia");
          }}
        ></CTextButton>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  feed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
});

export default Feed;
