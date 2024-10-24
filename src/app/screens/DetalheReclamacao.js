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
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { get } from "../utils/api";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

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

  const [marker, setMarker] = useState(null);
  const [foto, setFoto] = useState("");
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
  }, []);

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
        <View></View>
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
      </View>
      <View style={styles.overlayIcons}>
      <Image
          source={{ uri: foto }}
          style={{
            width: 80,
            height: 80,
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

      <Text>Descrição: {descricao}</Text>
      <Text>Categoria: {categoria}</Text>
      <Text>CEP: {cep}</Text>
      <Text>
        Endereço: {endereco}, {numero}
      </Text>
      <Text> Complemento: {complemento}</Text>

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
  overlayIcons: {
    width: width,
    paddingHorizontal: 10,
    position: "absolute",
    top: 340,
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
