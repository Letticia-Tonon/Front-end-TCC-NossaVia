import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
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
import * as ImagePicker from "expo-image-picker";
const { height, width } = Dimensions.get("window");

export default function CriarDenuncia() {
  const [categoria, setCategoria] = useState("");
  const [location, setLocation] = useState(false);
  const [marker, setMarker] = useState(null);
  const [imageList, setImageList] = useState([]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && imageList.length < 5) {
      setImageList([...imageList, result.assets[0].uri]);
    }
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(false);
    setLocation(location);
  };
  useEffect(() => {
    getLocation();
  }, []);
  return (
    <ActionSheetProvider>
      <ScrollView>
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader titulo={"Criação de Denúncia"}/>
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
                      Adicionar Foto{" "}
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
              <PagerView style={styles.fotos} initialPage={1}>
                {imageList.map((image, index) => (
                  <View style={styles.page} key={index}>
                    <Image source={{ uri: image }} style={styles.image} />
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

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              callback={pickImage}
              text={`Adicionar Foto ${imageList.length}/5`}
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
            />

            <TextInput
              style={styles.caixaTexto}
              placeholder="Descreva aqui o seu problema"
            ></TextInput>

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
                setMarker({
                  latitude: event.nativeEvent.coordinate.latitude,
                  longitude: event.nativeEvent.coordinate.longitude,
                });
              }}
            >
              {marker && <Marker coordinate={marker} />}
            </MapView>

            <CTextInput placeholder="CEP"></CTextInput>
            <CTextInput placeholder="Endereço"></CTextInput>
            <CTextInput placeholder="Número Aproximado"></CTextInput>
            <CTextInput placeholder="Ponto de Referência"></CTextInput>

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Criar Denúncia"
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
    paddingTop: 5,
    paddingBottom: 5,
  },
  caixaTexto: {
    borderWidth: 1,
    borderColor: "#555555",
    padding: 10,
    borderRadius: 5,
    height: 100,
    textAlignVertical: "top",
    borderRadius: 10,
    borderWidth: 2,
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 18,
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  map: {
    margin: 20,
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
