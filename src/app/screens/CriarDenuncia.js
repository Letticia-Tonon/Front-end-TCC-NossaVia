import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faCamera } from "@fortawesome/free-solid-svg-icons/faCamera";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";
import * as ImagePicker from "expo-image-picker";
import CTextBox from "../components/CTextBox";
import { post } from "../utils/api";
import { cepMask } from "../utils/masks";
import { validarCep } from "../utils/validators";
import { router } from "expo-router";
import locationContext from "../contexts/location";

const { width } = Dimensions.get("window");

export default function CriarDenuncia() {
  const [loading, setLoading] = useState(false);

  const [categoria, setCategoria] = useState("");
  const [location, setLocation] = useState(false);
  const [marker, setMarker] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();

  const [categoriaInvalida, setCategoriaInvalida] = useState(false);
  const [descricaoInvalida, setDescricaoInvalida] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);

  const handleSubmit = async () => {
    setCategoriaInvalida(false);
    setDescricaoInvalida(false);
    setEnderecoInvalido(false);
    setCepInvalido(false);
    let imagemTemp = false;
    let categoriaTemp = false;
    let descricaoTemp = false;
    let localTemp = false;
    let enderecoTemp = false;
    let cepTemp = false;

    if (imageList.length === 0) {
      imagemTemp = true;
      Alert.alert(
        "Atenção!",
        "Adicione pelo menos uma imagem para prosseguir com a criação da sua denúncia."
      );
    }

    if (!validarCep(cep)) {
      cepTemp = true;
      setCepInvalido(true);
    }

    if (!categoria) {
      categoriaTemp = true;
      setCategoriaInvalida(true);
    }

    if (!endereco) {
      enderecoTemp = true;
      setEnderecoInvalido(true);
    }

    if (!descricao) {
      descricaoTemp = true;
      setDescricaoInvalida(true);
    }

    if (!(latitude && longitude)) {
      localTemp = true;
      Alert.alert(
        "Atenção!",
        "Selecione um local no mapa para prosseguir com a criação da sua denúncia."
      );
    }

    if (
      imagemTemp ||
      categoriaTemp ||
      descricaoTemp ||
      localTemp ||
      enderecoTemp ||
      cepTemp
    ) {
      return;
    }

    const imageListBase64 = imageList.map((image) => image.base64);
    await post(
      "denuncia",
      {
        descricao: descricao,
        categoria: {
          "Irregularidades no Asfalto": "via",
          "Irregularidades na Calçada": "calcada",
          "Falta de Sinalização": "sinalizacao",
          "Lixo na Via": "lixo",
          "Veículo Abandonado": "carro",
          "Falta de Iluminação": "iluminacao",
          Outros: "outros",
        }[categoria],
        data: new Date().toISOString().replace("T", " ").replace("Z", "000"),
        endereco: endereco,
        numero_endereco: numero,
        ponto_referencia: complemento,
        cep: cep,
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        fotos: imageListBase64,
      },
      true
    )
      .then((data) => {
        if (data.status !== 201) {
          Alert.alert("Ops!", "Ocorreu um erro inesperado ao criar a denúncia.");
          return;
        }
        router.push("screens/Feed?logado=true");
        Alert.alert("Sucesso", "Denúncia criada com sucesso.");
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled && imageList.length < 5) {
      setImageList([...imageList, result.assets[0]]);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    locationContext.set(location);
  };
  useEffect(() => {
    getLocation();
  }, []);
  return (
    <ActionSheetProvider>
      <ScrollView>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader
              titulo={"Criação de Denúncia"}
              logado={true}
              showText={true}
              goBack={true}
              showIcon={true}
            />
            {imageList.length === 0 ? (
              <Pressable style={styles.adicionarImagem} onPress={pickImage}>
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FontAwesomeIcon
                    icon={faCamera}
                    size={100}
                    color="#666666"
                  ></FontAwesomeIcon>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 25,
                        fontWeight: "bold",
                        color: "#666666",
                      }}
                    >
                      Adicionar foto{" "}
                    </Text>
                    <FontAwesomeIcon
                      icon={faPlus}
                      size={25}
                      color="#666666"
                    ></FontAwesomeIcon>
                  </View>
                </View>
              </Pressable>
            ) : (
              <PagerView
                style={styles.fotos}
                initialPage={1}
                onPageSelected={(e) => {
                  setImageIndex(e.nativeEvent.position);
                }}
              >
                {imageList.map((image, index) => (
                  <View style={styles.page} key={index}>
                    <Image source={{ uri: image.uri }} style={styles.image} />
                    <Pressable
                      style={styles.icon}
                      onPress={() => {
                        setImageList(
                          imageList.filter((item, i) => i !== index)
                        );
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        size={30}
                        color="#FF7C33"
                      ></FontAwesomeIcon>
                    </Pressable>
                  </View>
                ))}
              </PagerView>
            )}

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
                    icon={faCircle}
                    size={imageIndex === index ? 11 : 8}
                    color="#666666"
                    key={index}
                  ></FontAwesomeIcon>
                ))}
              </View>
            )}

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              callback={pickImage}
              text={`Adicionar foto ${imageList.length}/5`}
            ></CTextButton>

            <CActionSheet
              state={categoria}
              setState={setCategoria}
              placeholder="Categoria"
              itens={[
                "Irregularidades no Asfalto",
                "Irregularidades na Calçada",
                "Falta de Sinalização",
                "Lixo na Via",
                "Veículo Abandonado",
                "Falta de Iluminação",
                "Outros",
              ]}
              error={categoriaInvalida}
              errorMessage="Selecione uma categoria"
            />

            <CTextBox
              placeholder="Descreva aqui o seu problema"
              state={descricao}
              setState={setDescricao}
              error={descricaoInvalida}
              errorMessage="Campo obrigatório"
              maxLength={500}
            ></CTextBox>

            <MapView
              provider={PROVIDER_GOOGLE}
              style={styles.map}
              region={
                location.coords &&
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
            ></CTextInput>

            <CTextInput
              placeholder="Número aproximado"
              state={numero}
              setState={setNumero}
            ></CTextInput>

            <CTextInput
              placeholder="Ponto de referência"
              state={complemento}
              setState={setComplemento}
            ></CTextInput>

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Criar denúncia"
              loading={loading}
              callback={() => {
                if (loading) return;
                setLoading(true);
                handleSubmit().finally(() => setLoading(false));
              }}
            ></CTextButton>
          </View>
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
  adicionarImagem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: width,
    height: width,
    backgroundColor: "#DDDDDD",
    margin: 8,
  },
  fotos: {
    flex: 1,
    width: width,
    height: width,
    margin: 8,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#333333",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  icon: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 10,
    borderRadius: 10,
    position: "absolute",
    top: 10,
    right: 10,
  },
});
