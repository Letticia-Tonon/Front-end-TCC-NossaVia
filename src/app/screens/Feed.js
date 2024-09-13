import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Feed() {
  const { logado } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <View style={styles.feed}>
        {logado === "false" && (
          <CTextButton
            buttonStyle={{
              backgroundColor: "#FF7C33",
            }}
            textStyle={{
              color: "#FFFFFF",
            }}
            text="Fazer Login"
            callback={() => {
              router.push("screens/Login");
            }}
          ></CTextButton>
        )}
        <CTextButton
          buttonStyle={{
            backgroundColor: "#FF7C33",
          }}
          textStyle={{
            color: "#FFFFFF",
          }}
          text="Criar Denúncia"
          callback={() => {
            router.push("screens/CriarDenuncia");
          }}
        ></CTextButton>
        {logado === "true" && (
          <CTextButton
            buttonStyle={{
              backgroundColor: "#FF7C33",
            }}
            textStyle={{
              color: "#FFFFFF",
            }}
            text="Deslogar"
            callback={() => {
              AsyncStorage.setItem("token", "");
              router.push("screens/Feed?logado=false");
            }}
          ></CTextButton>
        )}
      </View>
    </View>
  );
}

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
