import { StyleSheet, View } from "react-native";
import Login from "./screens/Login";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

export default function App() {
  return (
    <View style={styles.container}>
      <Login />
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
});
