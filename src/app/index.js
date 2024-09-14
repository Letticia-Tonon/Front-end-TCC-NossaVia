import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { get } from "./utils/api";
import { observer } from "mobx-react-lite";
import userContext from "./utils/context";

const App = observer(() => {
  useEffect(() => {
    AsyncStorage.getItem("token").then((token) => {
      if (!token) {
        router.push("screens/Feed?logado=false");
        return;
      }
      get("usuario", true).then((data) => {
        data.json().then((json) => {
          if (data.status !== 200) {
            AsyncStorage.setItem("token", "");
            userContext.set(null);
            router.push("screens/Feed?logado=false");
            return;
          }
          userContext.set(json);
          router.push("screens/Feed?logado=true");
        });
      });
    });
  }, []);
  return (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size={60} color="#FF7C33" />
      </View>
    </View>
  );
});

export default App;
