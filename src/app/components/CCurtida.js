import React, { useState, useRef } from "react";
import {
  View,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const { width } = Dimensions.get("window");

const CCurtida = observer(({ logado }) => {
  //  const [status, setStatus] = useState(
  //   {
  //     nao_resolvido: "Não resolvida",
  //     resolvido: "Resolvida",
  //   }[status_reclamacao]
  // );
  const slideAnim = useRef(new Animated.Value(width)).current;

  return (
    <View>
      <Pressable 
        style={styles.icon}
        onPress={() => {
          if (!logado) {
            Alert.alert(
              "Atenção!",
              "Para interagir com uma reclamação você precisa entrar na sua conta.",
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
              { cancelable: true }
            );
            return;
          }
          console.log("curtir");
        }}
      >
        <FontAwesomeIcon size={30} icon={faThumbsUp} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  icon: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CCurtida;
