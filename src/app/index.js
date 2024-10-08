import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect } from "react";
import { router } from "expo-router";
import { View, ActivityIndicator, Alert, BackHandler } from "react-native";
import { get } from "./utils/api";
import { observer } from "mobx-react-lite";
import * as Location from "expo-location";
import userContext from "./contexts/user";
import locationContext from "./contexts/location";
import { startActivityAsync, ActivityAction } from "expo-intent-launcher";
import Constants from "expo-constants";

const App = observer(() => {
  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status === "granted") {
      let location = await Location.getCurrentPositionAsync({});
      locationContext.set(location);
    }
    return status;
  };
  useEffect(() => {
    getLocation().then((status) => {
      if (status !== "granted") {
        Alert.alert(
          "Atenção!",
          "Para utilizar o aplicativo, precisamos da sua localização.",
          [
            {
              text: "Fechar",
              onPress: () => {
                BackHandler.exitApp();
              }
            },
            {
              text: "Permitir",
              onPress: () => {
                const pkg = Constants.expoConfig.releaseChannel
                  ? Constants.expoConfig.android.package
                  : "host.exp.exponent";
                startActivityAsync(
                  ActivityAction.APPLICATION_DETAILS_SETTINGS,
                  {
                    data: "package:" + pkg,
                  }
                );
              },
            },
          ],
          {
            cancelable: true,
          }
        );
        return;
      }
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
