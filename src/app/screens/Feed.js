import { StyleSheet, View, StatusBar } from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";
import { useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { observer } from "mobx-react-lite";
import userContext from "../utils/context";

const Feed = observer(() => {
  const { logado } = useLocalSearchParams();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
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
            callback={async () => {
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
          callback={async () => {
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
            callback={async () => {
              AsyncStorage.setItem("token", "");
              userContext.set(null);
              router.push("screens/Feed?logado=false");
            }}
          ></CTextButton>
        )}
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
