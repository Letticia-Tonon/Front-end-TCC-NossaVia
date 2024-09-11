import { StyleSheet, View, TextInput, ScrollView, Text } from "react-native";
import { router } from "expo-router";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useState, useEffect } from "react";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PagerView from "react-native-pager-view";
import * as Location from "expo-location";

export default function CriarDenuncia() {
  const [categoria, setCategoria] = useState("");
  const [location, setLocation] = useState(false);
  const [marker, setMarker] = useState(null);

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied");
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
            <PagerView style={styles.container} initialPage={0}>
              <View style={styles.page} key="1">
                <Text>First page</Text>
                <Text>Swipe ➡️</Text>
              </View>
              <View style={styles.page} key="2">
                <Text>Second page</Text>
              </View>
              <View style={styles.page} key="3">
                <Text>Third page</Text>
              </View>
            </PagerView>
            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Adicionar foto 0/5"
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
    paddingTop: 100,
    paddingBottom: 100,
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
  seta: {
    position: "absolute",
    top: -10,
    left: 1,
  },
  map: {
    margin: 20,
    width: "100%",
    height: "50%",
  },
});
