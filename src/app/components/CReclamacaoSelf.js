import React, { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { LocalSvg } from "react-native-svg/css";
import {
  View,
  Text,
  Dimensions,
  Image,
  StyleSheet,
  Pressable,
} from "react-native";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle,faTrash, } from "@fortawesome/free-solid-svg-icons";
import {
  faPenToSquare,
} from "@fortawesome/free-regular-svg-icons";
import CActionSheet from "./CActionSheet";
import { router } from "expo-router";
import { del, put } from "../utils/api";

const { width } = Dimensions.get("window");

const CReclamacaoSelf = ({
  id,
  rua,
  descricao,
  imagens,
  categoria,
  numero,
  status_reclamacao,
  deleteReclamacao,
}) => {
  const [icon, setIcon] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [status, setStatus] = useState(
    {
      nao_resolvido: "Não resolvida",
      resolvido: "Resolvida",
    }[status_reclamacao]
  );

  const [loading, setLoading] = useState(false);

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

  const deletarReclamacao = async () => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar, a reclamação será permanentemente excluída.",
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
              const response = await del(`reclamacao?id=${id}`, true);
              if (response.status !== 200) {
                Alert.alert("Ops!", "Não foi possível deletar essa reclamação.");
                return;
              }
              if (deleteReclamacao) deleteReclamacao(id);
              Alert.alert("Sucesso", "Reclamação excluída com sucesso.");
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
              <Image source={{ uri: image }} style={styles.reclamacaoImage} />
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
          <Text>
            Endereço: {rua ? rua.trim() : ""}
            {numero ? `, ${numero}` : ""}
          </Text>
          <Text>{descricao}</Text>

          <View style={styles.buttonContainer}>
            <Pressable style={styles.icon} onPress={deletarReclamacao}>
              <FontAwesomeIcon size={23} icon={faTrash} />
            </Pressable>

            <Pressable
              style={styles.icon}
              onPress={() => router.push(`screens/EditarReclamacao?id=${id}`)}
            >
              <FontAwesomeIcon size={25} icon={faPenToSquare} />
            </Pressable>

            <View style={{ flex: 1 }}>
              <CActionSheet
                style={{
                  backgroundColor:
                    status === "Não resolvida" ? "#FF4444" : "#00C851",
                  borderRadius: 25,
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                }}
                state={status}
                setState={(value) => {
                  current = status;
                  put(
                    `reclamacão?id=${id}`,
                    {
                      status: {
                        "Não resolvida": "nao_resolvido",
                        Resolvida: "resolvido",
                      }[value],
                    },
                    true
                  ).then((response) => {
                    if (response.status !== 200) {
                      setStatus(current);
                      Alert.alert(
                        "Ops!",
                        "Não foi possível atualizar o status dessa reclamação."
                      );
                    }
                  });
                  setStatus(value);
                }}
                placeholder="Status"
                itens={["Não resolvida", "Resolvida"]}
              >
                <Text style={{ color: "#FFFFFF", marginRight: 8 }}>
                  {status}
                </Text>
              </CActionSheet>
            </View>
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
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    width: width,
  },
  estado: {
    flexDirection: "row",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
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
  reclamacaoImage: {
    width: width,
    height: width,
    resizeMode: "cover",
  },
  content: {
    padding: 10,
  },
  userInfo: {
    marginLeft: 5,
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
    justifyContent: "flex-end",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
  },
  icon: {
    width: "15%",
  },
});

export default CReclamacaoSelf;
