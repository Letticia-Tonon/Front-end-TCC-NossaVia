import React, { useEffect, useState } from "react";
import { LocalSvg } from "react-native-svg/css";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Button,
} from "react-native";
import CTextInput from "../components/CTextInput";
import { useLocalSearchParams } from "expo-router";
import CHeader from "../components/CHeader";
import { get, post } from "../utils/api";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import CCurtida from "../components/CCurtida";
import CComentario from "../components/CComentario";

const { height, width } = Dimensions.get("window");

const ILUMINCAO_ICON = require("../../../assets/icons/falta_iluminacao.svg");
const SINALIZACAO_ICON = require("../../../assets/icons/falta_sinalizacao.svg");
const VIA_ICON = require("../../../assets/icons/irregularidades_asfalto.svg");
const CALCADA_ICON = require("../../../assets/icons/irregularidades_calcada.svg");
const LIXO_ICON = require("../../../assets/icons/lixo_via.svg");
const CARRO_ICON = require("../../../assets/icons/veiculo_abandonado.svg");
const OUTROS_ICON = require("../../../assets/icons/outros.svg");

const DetalheReclamacao = () => {
  const { id } = useLocalSearchParams();
  const [logado, setLogado] = useState(false);
  const [Curtidas, setCurtidas] = useState(0);
  const [comentarios, setComentarios] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [page, setPage] = useState(5);
  const reclamacaoId = 1;

  const [marker, setMarker] = useState(null);
  const [foto, setFoto] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReclamacao = async () => {
      try {
        const response = await get(`reclamacao?id=${id}`);
        if (response.ok) {
          const reclamacao = await response.json();
          setNome(reclamacao.nome_usuario);
          setFoto(reclamacao.foto_usuario);
          setDescricao(reclamacao.descricao);
          setCep(reclamacao.cep);
          setEndereco(reclamacao.endereco);
          setNumero(reclamacao.numero_endereco);
          setComplemento(reclamacao.ponto_referencia);
          setLatitude(reclamacao.latitude);
          setLongitude(reclamacao.longitude);
          setImageList(reclamacao.fotos);
          setCategoria(
            {
              via: "via",
              calcada: "calcada",
              sinalizacao: "sinalizacao",
              lixo: "lixo",
              carro: "carro",
              iluminacao: "iluminacao",
              outros: "outros",
            }[reclamacao.categoria]
          );
          setMarker({
            latitude: Number(reclamacao.latitude),
            longitude: Number(reclamacao.longitude),
          });
        } else {
          console.log("Erro na resposta:", response.status);
          Alert.alert(
            "Ops!",
            "Ocorreu um erro inesperado ao buscar os detalhes da reclamação"
          );
        }
      } catch (error) {
        console.error("Erro ao buscar reclamação:", error);
        Alert.alert(
          "Erro",
          "Não foi possível buscar os detalhes da reclamação. Tente novamente."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReclamacao();
  }, [id]);

  useEffect(() => {
    buscarComentarios();
  }, [page]);

  const buscarComentarios = async () => {
    try {
      const response = await get(`comentarios?reclamacao=${reclamacaoId}&page=${page}`);
      if (response.ok) {
        const comentariosData = await response.json();
        setComentarios([...comentarios, ...comentariosData]);
      } else {
        Alert.alert("Erro ao buscar comentários");
      }
    } catch (error) {
      console.error("Erro ao buscar comentários:", error);
    }
  };

  const enviarComentario = async () => {
    try {
      const payload = { texto: novoComentario, reclamacao: reclamacaoId };
      const response = await post("comentarios", payload);
      if (response.ok) {
        setNovoComentario("");
        buscarComentarios(); // Atualiza a lista após enviar
      } else {
        Alert.alert("Erro ao enviar comentário");
      }
    } catch (error) {
      console.error("Erro ao enviar comentário:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7C33" />
      </View>
    );
  }
  return (
    <ScrollView>
      <View style={{ ...styles.container, width: "100%" }}>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <CHeader
          titulo={"Detalhes"}
          logado={true}
          showText={true}
          goBack={true}
          showIcon={false}
        />
        <PagerView
          style={styles.imagePlaceholder}
          initialPage={0}
          onPageSelected={(e) => {
            setImageIndex(e.nativeEvent.position);
          }}
        >
          {imageList.map((image, index) => (
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
          {imageList.map((image, index) => (
            <FontAwesomeIcon
              icon={faCircle}
              size={imageIndex === index ? 11 : 8}
              color="#666666"
              key={index}
            />
          ))}
        </View>

      <View style={{ padding: 10 }}>
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
          <Text style={{ fontSize: 20 }}>{nome}</Text>

          <Text>
            {endereco}, {numero} - Vila Graciosa - São Paulo - SP. {cep}
          </Text>

          {complemento && <Text>Ponto de referência: {complemento}</Text>}

          <Text style={{ fontStyle: "italic" }}>{descricao}</Text>
        </View>
      </View>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={
          latitude &&
          longitude && {
            latitude: Number(latitude),
            longitude: Number(longitude),
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          }
        }
      >
        {marker && <Marker coordinate={marker} />}
      </MapView>
      </View>
        <View>
        <View style={styles.buttonContainer}>
              <CCurtida logado={logado} quantidade={Curtidas} idReclamacao={id} />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <CComentario />
              </View>
            </View>            
            <CTextInput
              placeholder="Adicione um comentário..."
              multiline={true}
              numberOfLines={4}
              style={{
                borderColor: "#ccc",
                borderWidth: 1,
                borderRadius: 5,
                padding: 10,
                marginTop: 10,
              }}
            />
            <View style={styles.commentsSection}>
              {comentarios.map((comentario, index) => (
                <View key={index} style={styles.comment}>
                  <Text style={styles.commentAuthor}>{comentario.nome}</Text>
                  <Text>{comentario.texto}</Text>
                </View>
              ))}
            </View>

            <Button title="Enviar" onPress={enviarComentario} />
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 5,
  },
  userInfo: {
    marginLeft: 5,
    marginTop: 5,
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 16,
  },buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
  },
  map: {
    margin: 8,
    width: width,
    height: width,
  },
  imagePlaceholder: {
    marginTop: 8,
    width: width,
    height: width,
  },
  reclamacaoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default DetalheReclamacao;
