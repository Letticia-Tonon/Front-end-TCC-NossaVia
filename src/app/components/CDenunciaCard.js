import React from "react";
import { SvgUri } from "react-native-svg";
import { View, Text, Dimensions, Image, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Lixo_via } from "../../../assets/icons/lixo_via.svg";

const { width } = Dimensions.get("window");
const CDenunciaCard = ({
  nome,
  rua,
  descricao,
  denunciaImagem,
  categoriaIcone,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}></View>

      {/* Informações da denúncia */}
      <View style={styles.content}>
        <View style={styles.header}>
          <FontAwesome name="user-circle" size={40} color="black" />

          <View style={styles.userInfo}>
            <Text style={styles.name}>{nome}</Text>
            <Text>{rua}</Text>
            <Text>{descricao}</Text>
            <SvgUri
              width="100%"
              height="100%"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 20,
    elevation: 2, //sombra
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: width,
  },
  imagePlaceholder: {
    borderRadius: 10,
    width: width,
    height: width,
    elevation: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  denunciaImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  content: {
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  userInfo: {
    marginLeft: 20,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  categoryIcon: {
    // backgroundColor: "#fff",
    // borderRadius: 20,
    // padding: 5,
    // elevation: 2, // Sombra no ícone
    // shadowColor: "#000",
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
    // shadowOffset: { width: 0, height: 2 },
  },
});

export default CDenunciaCard;
