import React, { useState, useEffect } from "react";
import {
  View,
  Pressable,
  Alert,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { post, del, get } from "../utils/api";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faThumbsUp as regularThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { faThumbsUp as solidThumbsUp } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const { width } = Dimensions.get("window");

const CCurtida = observer(({ logado, idReclamacao, quantidade }) => {
  const [liked, setLiked] = useState(false);
  const [quantidadeState, setQuantidadeState] = useState(Number(quantidade) || 0);

  useEffect(() => {
    const fetchCurtidas = async () => {
      try {
        const response = await get(`/curtidas/${idReclamacao}`);
        setQuantidadeState(Number(response.quantidade) || 0);
        setLiked(response.liked);
      } catch (error) {
        console.error("Erro ao buscar curtidas:", error);
        setQuantidadeState(0); // Define quantidade como 0 em caso de erro
      }
    };
    fetchCurtidas();
  }, [idReclamacao]);

  const handleSubmit = async () => {
    if (!logado) {
      Alert.alert(
        "Atenção!",
        "Para interagir com uma reclamação você precisa entrar na sua conta.",
        [
          { text: "Cancelar" },
          { text: "Entrar", onPress: () => router.push("screensLogin") },
        ],
        { cancelable: true }
      );
      return;
    }

    const payload = {
      reclamacao: idReclamacao,
      usuario_id: logado.id,
    };

    try {
      if (liked) {
        await del(`/curtidas`, { data: payload });
        setQuantidadeState((prev) => Math.max(prev - 1, 0));
      } else {
        await post(`/curtidas`, payload);
        setQuantidadeState((prev) => prev + 1);
      }
      setLiked(!liked);
    } catch (error) {
      console.error("Erro ao curtir/descurtir:", error);
      Alert.alert("Erro", "Ocorreu um problema ao curtir a reclamação.");
    }
  };

  return (
    <View style={[styles.flex, { flexDirection: "row", alignItems: "center", justifyContent: "center" }]}>
      <Pressable
        style={styles.icon}
        onPress={handleSubmit}
      >
        <FontAwesomeIcon
          size={30}
          icon={liked ? solidThumbsUp : regularThumbsUp}
          color={liked ? "#FF7C33" : "black"}
        />
      </Pressable>
      <Text style={{ fontSize: 20, marginLeft: 10 }}>{quantidadeState}</Text>
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
