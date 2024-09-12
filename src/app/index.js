import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";

export default function App() {
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.push("screens/Feed?logado=false");
        return;
      }
      router.push("screens/Feed?logado=true");
    });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={60} color="#555555" />
      </View>
    </View>
  );
}
