import { StyleSheet, View } from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";

export default function Feed() {
  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
