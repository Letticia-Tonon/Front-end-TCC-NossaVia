import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  StatusBar,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import CHeader from "../components/CHeader";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PagerView from "react-native-pager-view";
import * as Location from "expo-location";
import CTextBox from "../components/CTextBox";
import { get, put } from "../utils/api";
import { cepMask } from "../utils/masks";
import { validarCep } from "../utils/validators";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

export default function EditarDenuncia() {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [descricaoInvalida, setDescricaoInvalida] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [imageList, setImageList] = useState([]); // Estado para armazenar as imagens
  const [imageIndex, setImageIndex] = useState(0); // Índice da imagem atual exibida

  // Função para buscar os dados da denúncia existente, incluindo as imagens
  const fetchDenuncia = async (denunciaId) => {
    try {
      const response = await get(`denuncia/${denunciaId}`);
      const denuncia = response.data;

      // Preencher os campos com os dados da denúncia
      setDescricao(denuncia.descricao);
      setCep(denuncia.cep);
      setEndereco(denuncia.endereco);
      setNumero(denuncia.numero_endereco);
      setComplemento(denuncia.ponto_referencia);
      setLatitude(parseFloat(denuncia.latitude));
      setLongitude(parseFloat(denuncia.longitude));
      setMarker({
        latitude: parseFloat(denuncia.latitude),
        longitude: parseFloat(denuncia.longitude),
      });

      // Carregar as imagens da denúncia
      if (denuncia.fotos) {
        setImageList(
          denuncia.fotos.map((fotoBase64) => ({
            uri: `data:image/jpeg;base64,${fotoBase64}`,
            base64: fotoBase64,
          }))
        );
      }
    } catch (error) {
      Alert.alert("Erro", "Não foi possível carregar a denúncia.");
    }
  };

  useEffect(() => {
    if (denunciaId) {
      fetchDenuncia(denunciaId); // Buscar dados ao carregar a tela
    }
  }, [denunciaId]);

  const handleSubmit = async () => {
    setDescricaoInvalida(false);
    setEnderecoInvalido(false);
    setCepInvalido(false);

    let cepTemp = false;
    let enderecoTemp = false;
    let descricaoTemp = false;

    if (!validarCep(cep)) {
      cepTemp = true;
      setCepInvalido(true);
    }

    if (!endereco) {
      enderecoTemp = true;
      setEnderecoInvalido(true);
    }

    if (!descricao) {
      descricaoTemp = true;
      setDescricaoInvalida(true);
    }

    if (descricaoTemp || enderecoTemp || cepTemp) {
      return;
    }

    await put(
      `denuncia/${denunciaId}`,
      {
        descricao: descricao,
        endereco: endereco,
        numero_endereco: numero,
        ponto_referencia: complemento,
        cep: cep,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      },
      true
    )
      .then((data) => {
        if (data.status !== 200) {
          Alert.alert("Ops!", "Ocorreu um erro inesperado ao editar a denúncia.");
        } else {
          Alert.alert("Sucesso", "Denúncia editada com sucesso.");
          router.push("screens/Feed?logado=true");
        }
      });
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <ActionSheetProvider>
      <ScrollView>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <CHeader titulo={"Editar Denúncia"} logado={true} goBack={true} />

          {/* Exibir as imagens carregadas */}
          {imageList.length > 0 && (
            <PagerView
              style={styles.fotos}
              initialPage={0}
              onPageSelected={(e) => setImageIndex(e.nativeEvent.position)}
            >
              {imageList.map((image, index) => (
                <View style={styles.page} key={index}>
                  <Image source={{ uri: image.uri }} style={styles.image} />
                </View>
              ))}
            </PagerView>
          )}

          {/* Navegação entre as imagens */}
          {imageList.length > 0 && (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                gap: 5,
                margin: 8,
                alignItems: "center",
              }}
            >
              {imageList.map((image, index) => (
                <FontAwesomeIcon
                  key={index}
                  icon={faCircle}
                  size={imageIndex === index ? 11 : 8}
                  color="#666666"
                />
              ))}
            </View>
          )}

          <CTextBox
            placeholder="Descreva aqui o seu problema"
            state={descricao}
            setState={setDescricao}
            error={descricaoInvalida}
            errorMessage="Campo obrigatório"
            maxLength={500}
          />

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={
              latitude && longitude && {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }
            }
            onPress={(event) => {
              setLatitude(event.nativeEvent.coordinate.latitude);
              setLongitude(event.nativeEvent.coordinate.longitude);
              setMarker({
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              });
            }}
          >
            {marker && <Marker coordinate={marker} />}
          </MapView>

          <CTextInput
            placeholder="CEP"
            state={cep}
            setState={setCep}
            mask={cepMask}
            error={cepInvalido}
            errorMessage="Campo obrigatório"
            maxLength={9}
            keyboardType="numeric"
          />

          <CTextInput
            placeholder="Endereço"
            state={endereco}
            setState={setEndereco}
            error={enderecoInvalido}
            errorMessage="Campo obrigatório"
          />

          <CTextInput
            placeholder="Número aproximado"
            state={numero}
            setState={setNumero}
          />

          <CTextInput
            placeholder="Ponto de referência"
            state={complemento}
            setState={setComplemento}
          />

          <CTextButton
            buttonStyle={{
              backgroundColor: "#FF7C33",
            }}
            textStyle={{
              color: "#FFFFFF",
            }}
            text="Editar denúncia"
            loading={loading}
            callback={() => {
              if (loading) return;
              setLoading(true);
              handleSubmit().finally(() => setLoading(false));
            }}
          />
        </View>
      </ScrollView>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 5,
  },
  map: {
    margin: 8,
    width: width,
    height: width,
  },
  fotos: {
    width: "100%",
    height: 300,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
