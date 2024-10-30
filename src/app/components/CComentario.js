import React, { useRef } from "react";
import { View, StyleSheet, Alert, Pressable } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faComment } from "@fortawesome/free-regular-svg-icons";
import { router } from "expo-router";
import { observer } from "mobx-react-lite";

const CComentario = observer((props) => {
  const textInputRef = useRef(null);
  const { id, logado, Curtidas, liked } = props;

  const handleSubmit = async () => {
    if (!logado) {
      Alert.alert(
        "Atenção!",
        "Para interagir com uma reclamação você precisa entrar na sua conta.",
        [
          { text: "Cancelar" },
          {
            text: "Entrar",
          },
        ],
        { cancelable: true }
      );
      return;
    }
    router.push(
      `screens/DetalheReclamacao?reclamacaoId=${id}&logado=${logado}&Curtidas=${Curtidas}&liked=${liked}`
    );
  };

  return (
    <View>
      <Pressable style={styles.icon} onPress={handleSubmit}>
        <FontAwesomeIcon size={30} icon={faComment} />
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  textInput: {
    width: "100%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#FF7C33",
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CComentario;
