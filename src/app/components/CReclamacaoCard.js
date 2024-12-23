import React, { useState } from "react";
import { router } from "expo-router";
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
import { faCircle, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import CComentario from "./CComentario";
import CCurtida from "./CCurtida";

const { width } = Dimensions.get("window");

const ILUMINCAO_ICON = require("../../../assets/icons/falta_iluminacao.svg");
const SINALIZACAO_ICON = require("../../../assets/icons/falta_sinalizacao.svg");
const VIA_ICON = require("../../../assets/icons/irregularidades_asfalto.svg");
const CALCADA_ICON = require("../../../assets/icons/irregularidades_calcada.svg");
const LIXO_ICON = require("../../../assets/icons/lixo_via.svg");
const CARRO_ICON = require("../../../assets/icons/veiculo_abandonado.svg");
const OUTROS_ICON = require("../../../assets/icons/outros.svg");

const CReclamacaoCard = ({
  id,
  nome,
  foto,
  rua,
  descricao,
  imagens,
  categoria,
  numero,
  status,
  Curtidas,
  liked,
  logado,
  showComentario = true,
  showDetalhes = true,
}) => {
  const [imageIndex, setImageIndex] = useState(0);

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
              <Image source={{ uri: image }} style={styles.ReclamacaoImage} />
              {status === "resolvido" && (
                <View style={styles.status}>
                  <Text
                    style={{
                      color: "#FFF",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 15,
                    }}
                  >
                    Este problema foi resolvido!
                  </Text>
                </View>
              )}
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
            ></FontAwesomeIcon>
          ))}
        </View>
      </View>
      <Pressable
        onPress={() => {
          if (showDetalhes) {
            router.push(
              `screens/DetalheReclamacao?reclamacaoId=${id}&logado=${logado}&focusComment=false`
            );
          }
        }}
      >
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
            {categoria && (
              <LocalSvg
                asset={
                  {
                    iluminacao: ILUMINCAO_ICON,
                    sinalizacao: SINALIZACAO_ICON,
                    via: VIA_ICON,
                    calcada: CALCADA_ICON,
                    lixo: LIXO_ICON,
                    carro: CARRO_ICON,
                    outros: OUTROS_ICON,
                  }[categoria]
                }
                height={75}
                width={75}
                style={{ borderRadius: 32.5 }}
              />
            )}
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.name}>{nome}</Text>
            <Text>
              Endereço: {rua ? rua.trim() : ""}
              {numero ? `, ${numero}` : ""}
            </Text>
            <Text style={{ fontStyle: "italic" }}>{descricao}</Text>
            <View
              style={{
                borderBottomColor: "#D9D9D9",
                borderBottomWidth: 1,
                marginTop: 10,
                marginRight: 5,
              }}
            />
            <View style={styles.buttonContainer}>
              <CCurtida
                logado={logado}
                quantidade={Curtidas}
                idReclamacao={id}
                liked={liked}
              />
              <View style={{ flex: 1, marginLeft: 20 }}>
                {showComentario && (
                  <CComentario logado={logado} idReclamacao={id} />
                )}
              </View>
              {showComentario && (
                <View style={{marginRight: 8}}>
                  <FontAwesomeIcon
                    icon={faMagnifyingGlass}
                    size={30}
                  ></FontAwesomeIcon>
                </View>
              )}
            </View>
          </View>
        </View>
      </Pressable>
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
  ReclamacaoImage: {
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
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    paddingVertical: 10,
  },
  status: {
    position: "absolute",
    right: 0,
    top: 0,
    backgroundColor: "#00BB00",
    padding: 5,
    borderBottomLeftRadius: 10,
    zIndex: 1001,
  },
  icon: {
    width: "15%",
  },
});

export default CReclamacaoCard;
