import React, { useState } from "react";
import { Pressable, Alert, StyleSheet, Text } from "react-native";
import { post, del } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const CCurtida = observer(({ logado, idReclamacao, quantidade, liked }) => {
  const [likedState, setLikedState] = useState(liked);
  const [quantidadeState, setQuantidadeState] = useState(quantidade);

  const handleSubmit = async () => {
    if (!logado) {
      Alert.alert(
        "Atenção!",
        "Para interagir com uma reclamação você precisa entrar na sua conta.",
        [
          { text: "Cancelar" },
          { text: "Entrar", onPress: () => router.push("screens/Login") },
        ],
        { cancelable: true }
      );
      return;
    }

    const payload = {
      reclamacao: String(idReclamacao),
    };

    const likes = quantidadeState;
    const liked = likedState;
    setLikedState(!liked);
    if (likedState) {
      setQuantidadeState(likes - 1);
      del(`/curtida?reclamacao=${idReclamacao}`, true).then((data) => {
        if (data.status === 409) {
          return;
        }
        if (data.status !== 200) {
          setLikedState(liked);
          setQuantidadeState(likes);
        }
      });
    } else {
      setQuantidadeState(likes + 1);
      post(`/curtida`, payload, true).then((data) => {
        if (data.status === 409) {
          return;
        }
        if (data.status !== 200 && data.status !== 201) {
          setLikedState(liked);
          setQuantidadeState(likes);
        }
      });
    }
  };

  return (
    <Pressable style={styles.icon} onPress={handleSubmit}>
      <FontAwesomeIcon
        size={30}
        icon={likedState ? solidThumbsUp : regularThumbsUp}
        color={likedState ? "#FF7C33" : "#000"}
      />
      <Text style={{ fontSize: 20, marginLeft: 10 }}>{quantidadeState}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  icon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CCurtida;
