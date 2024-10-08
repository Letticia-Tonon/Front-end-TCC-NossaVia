import React, { useState, useEffect } from "react";
import { LocalSvg } from "react-native-svg/css";
import { View, Text, Dimensions, Image, StyleSheet, Pressable } from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle, faCheck, faTrash } from "@fortawesome/free-solid-svg-icons";
import CActionSheet from "./CActionSheet"; 
import { del } from "../utils/api";

const { width } = Dimensions.get("window");

const CDenunciaSelf = ({id, nome, foto, rua, descricao, imagens, categoria }) => {
  const [icon, setIcon] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [status, setStatus] = useState("Em aberto");

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
  }, [categoria]);

  const deletarDenuncia = async () => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar, a denúncia será permanentemente excluída.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK",
          onPress: async () => {
            if (loading) return;
            setLoading(true);
            try {
              const response = await del("denuncia", true);
              if (response.status === 200) {
                Alert.alert("Sucesso", "Denúncia excluída.");
                router.push("screens/Feed?logado=true");
              } else if (response.status === 404) {
                Alert.alert("Ops!", "Denúncia não encontrada.");
              } else {
                Alert.alert("Ops!", "Ocorreu um erro inesperado.");
              }
            } catch (error) {
              Alert.alert("Ops!", "Ocorreu um erro inesperado.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };
  

  // Função para definir a cor com base no status
  const getButtonStyle = () => {
    return {
      flexDirection: "row",
      backgroundColor: status === "Em aberto" ? "#FF4444" : "#00C851", 
      borderRadius: 25,
      paddingVertical: 10,
      paddingHorizontal: 20,
      alignItems: "center",
    };
  };

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
              key={index}
            />
          ))}
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.overlayIcons}>
          <Image
            source={{ uri: foto }}
            style={{
              width: 65,
              height: 65,
              borderRadius: 40,
            }}
          />
          {icon && (
            <LocalSvg
              asset={icon}
              height={75}
              width={75}
              style={{ borderRadius: 32.5 }}
            />
          )}
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.name}>{nome}</Text>
          <Text>{rua}</Text>
          <Text>{descricao}</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.CheckIcon}onPress={router.push("screens/EditarDenuncia")}>
             <FontAwesomeIcon icon={faCheck} size={16} color="#00C851" />
            </Pressable>
            <Pressable style={styles.trashIcon} onPress={deletarDenuncia}>
             <FontAwesomeIcon icon={faTrash} size={30} color="#FF7C33" />
            </Pressable>
          </View>

          <View style={getButtonStyle()}>
            <Text style={{ color: "#FFFFFF", marginRight: 8 }}>{status}</Text>
            <CActionSheet
              style={styles.estado}
              state={status}
              setState={setStatus}
              placeholder="Status"
              itens={["Em aberto", "Resolvida"]}
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
    marginVertical: 10,
    elevation: 2, // sombra
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: width,
  },
  estado: {
    flexDirection: "row", // Para alinhar o texto e o ícone em linha
    borderRadius: 25, // Deixa as bordas arredondadas
    paddingVertical: 10, // Padding vertical para aumentar a área clicável
    paddingHorizontal: 20, // Padding horizontal para dar espaço ao texto
    alignItems: "center", // Centraliza o texto e o ícone verticalmente
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
  overlayIcons: {
    width: width,
    paddingHorizontal: 10,
    position: "absolute",
    top: -60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-around",
  },
});

export default CDenunciaSelf;
