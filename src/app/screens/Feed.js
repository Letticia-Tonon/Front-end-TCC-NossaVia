import { StyleSheet, View } from "react-native";
import { Link } from 'expo-router';

export default function Feed() {
  return (
    <View style={styles.container}>
      <Link href={"/screens/Login"}>Abrir Login</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
