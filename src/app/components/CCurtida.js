import React, { useState, useRef } from "react";
import {
  View,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  Animated,
  Text,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons"; 
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const { width } = Dimensions.get("window");

const CCurtida = observer(({ logado }) => {
  const [liked, setLiked] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  return (
    <View style={[styles.flex, { flexDirection: "row", alignItems: "center", justifyContent: "center" }]}>
      <Pressable 
        style={styles.icon}
        onPress={() => {
          // if (!logado) {
          //   Alert.alert(
          //     "Atenção!",
          //     "Para interagir com uma reclamação você precisa entrar na sua conta.",
          //     [
          //       {
          //         text: "Cancelar",
          //       },
          //       {
          //         text: "Entrar",
          //         onPress: () => {
          //           router.push("screens/Login");
          //         },
          //       },
          //     ],
          //     { cancelable: true }
          //   );
          //   return;
          // }
          setLiked(!liked);
          console.log("curtir");
        }}
      >
        <FontAwesomeIcon 
          size={30} 
          icon={liked ? solidThumbsUp : regularThumbsUp}
          color={liked ? "#FF7C33" : "black"} 
        />
      </Pressable>
      {/* rever esse tamanho de fonte */}
      <Text style={{ fontSize: 20 , marginLeft: 10 }}>1</Text>  
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
