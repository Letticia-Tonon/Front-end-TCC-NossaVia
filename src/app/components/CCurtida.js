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
import { faThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const { width } = Dimensions.get("window");

const CCurtida = observer(({ logado }) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const abrirMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

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
        <FontAwesomeIcon size={25} icon={faThumbsUp} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  icon: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CCurtida;
