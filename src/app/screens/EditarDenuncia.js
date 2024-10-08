import { router, useLocalSearchParams } from "expo-router"; // Importação do hook
import { useState, useEffect } from "react";
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
import CHeader from "../components/CHeader";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PagerView from "react-native-pager-view";
import * as Location from "expo-location";
import CTextBox from "../components/CTextBox";
import { get, put } from "../utils/api";
import { cepMask } from "../utils/masks";
import { validarCep } from "../utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const { width } = Dimensions.get("window");

export default function EditarDenuncia() {
  // Capturar todos os parâmetros que foram passados na navegação
  const { id, nome, foto, rua, descricao, imagens, categoria } = useLocalSearchParams(); 
  
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [marker, setMarker] = useState(null);
  const [descricaoState, setDescricaoState] = useState(descricao || ""); // Usar valor de descrição recebido
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState(rua || ""); // Usar rua recebida
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [descricaoInvalida, setDescricaoInvalida] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [imageList, setImageList] = useState(imagens || []); // Usar imagens recebidas
  const [imageIndex, setImageIndex] = useState(0);

  // const fetchDenuncia = async (denunciaId) => {
  //   // Implementação da função que pode buscar os dados de uma denúncia, se necessário
  // };

  useEffect(() => {
    if (id) {
      fetchDenuncia(id); // Carregar dados adicionais da denúncia se necessário
    }
  }, [id]);

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

    if (!descricaoState) {
      descricaoTemp = true;
      setDescricaoInvalida(true);
    }

    if (descricaoTemp || enderecoTemp || cepTemp) {
      return;
    }

    try {
      const response = await put(
        `denuncia/${id}`,
        {
          descricao: descricaoState,
          endereco,
          numero_endereco: numero,
          ponto_referencia: complemento,
          cep,
          latitude: latitude?.toString(),
          longitude: longitude?.toString(),
        },
        true
      );

      if (response.status === 200) {
        Alert.alert("Sucesso", "Denúncia editada com sucesso.");
        router.replace("screens/Feed?logado=true"); // Redireciona para o feed
      } else {
        Alert.alert("Ops!", "Ocorreu um erro inesperado ao editar a denúncia.");
      }
    } catch (error) {
      Alert.alert("Ops!", "Erro ao editar a denúncia.");
    } finally {
      setLoading(false);
    }
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

          <PagerView
            style={styles.imagePlaceholder}
            initialPage={0}
            onPageSelected={(e) => {
              setImageIndex(e.nativeEvent.position);
            }}
          >
            {imageList.map((image, index) => (
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
            {imageList.map((image, index) => (
              <FontAwesomeIcon
                icon={faCircle}
                size={imageIndex === index ? 11 : 8}
                color="#666666"
                key={index}
              />
            ))}
          </View>

          <CTextBox
            placeholder="Descreva aqui o seu problema"
            state={descricaoState}
            setState={setDescricaoState}
            error={descricaoInvalida}
            errorMessage="Campo obrigatório"
            maxLength={500}
          />

          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            region={
              location?.coords &&
              location.coords.latitude &&
              location.coords.longitude && {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
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
  imagePlaceholder: {
    width: "100%",
    height: 300,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  denunciaImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
