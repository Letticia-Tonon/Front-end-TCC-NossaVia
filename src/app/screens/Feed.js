import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";

export default function Feed() {
  return (
    <View style={styles.container}>
      <View style={styles.feed}>
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
