import React, { useState } from "react";
import { useEffect } from "react";
import { LocalSvg } from "react-native-svg/css";
import { View, Text, Dimensions, Image, StyleSheet } from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle, faCircleUser } from "@fortawesome/free-solid-svg-icons";

const { width } = Dimensions.get("window");

const CDenunciaCard = ({ nome, foto, rua, descricao, imagens, categoria }) => {
  const [icon, setIcon] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  useEffect(() => {
    switch (categoria) {
      case "iluminacao":
        setIcon(require("../../../assets/icons/falta_iluminacao.svg"));
        break;
      case "sinalizacao":
        setIcon(require("../../../assets/icons/falta_sinalizacao.svg"));
        break;
      case "via":
        setIcon(require("../../../assets/icons/irregularidades_asfalto.svg"));
        break;
      case "calcada":
        setIcon(require("../../../assets/icons/irregularidades_calcada.svg"));
        break;
      case "lixo":
        setIcon(require("../../../assets/icons/lixo_via.svg"));
        break;
      case "carro":
        setIcon(require("../../../assets/icons/veiculo_abandonado.svg"));
        break;
      case "outros":
        setIcon(require("../../../assets/icons/outros.svg"));
        break;
    }
  }, []);
  return (
    <View style={styles.card}>
      <View style={styles.center}>
        <PagerView
          style={styles.imagePlaceholder}
          initialPage={0}
          onPageSelected={(e) => {
            setImageIndex(e.nativeEvent.position);
          }}
        >
          {imagens.map((image, index) => (
            <View style={styles.page} key={index}>
              <Image source={{ uri: image }} style={styles.denunciaImage} />
            </View>
          ))}
        </PagerView>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            gap: 5,
            marginTop: 8,
            alignItems: "center",
          }}
        >
          {imagens.map((image, index) => (
            <FontAwesomeIcon
              icon={faCircle}
              size={imageIndex === index ? 11 : 8}
              color="#666666"
            ></FontAwesomeIcon>
          ))}
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.overlayIcons}>
          <Image source={{ uri: foto }}
          style={{ width: 65, height: 65, borderRadius: 40, borderColor: "#fff", borderWidth: 5.5 }}/>
          {icon && (
            <LocalSvg
              asset={icon}
              height={65}
              width={65}
              style={styles.categoriaIcon}
            />
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{nome}</Text>
          <Text>{rua}</Text>
          <Text>{descricao}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginVertical: 10,
    elevation: 2, //sombra
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: width,
  },
  center: {
    alignItems: "center",
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
  userInfo: {
    marginLeft: 5,
    marginTop: 5,
  },
  name: {
    fontSize: 20,
  },
  userIcon: {
    backgroundColor: "#fff",
    borderRadius: 40,
  },
  categoriaIcon: {
    marginLeft: 100,
    backgroundColor: "#fff",
    borderRadius: 40,
    padding: 5,
  },
  overlayIcons: {
    position: "absolute",
    top: -50, // é o que sobrepõem os icones sobre a imagem
    left: 10,
    right: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default CDenunciaCard;
