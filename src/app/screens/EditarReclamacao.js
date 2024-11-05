import { router, useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  Alert,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import CHeader from "../components/CHeader";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import PagerView from "react-native-pager-view";
import CTextBox from "../components/CTextBox";
import { get, put } from "../utils/api";
import { cepMask } from "../utils/masks";
import { validarCep } from "../utils/validators";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";

const { height, width } = Dimensions.get("window");

export default function EditarReclamacao() {
  const { id } = useLocalSearchParams();

  const [marker, setMarker] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSalvar, setLoadingSalvar] = useState(false);

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
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");

  const [descricaoInvalida, setDescricaoInvalida] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [categoriaInvalida, setCategoriaInvalida] = useState(false);
  const [bairroInvalido, setBairroInvalido] = useState(false);
  const [cidadeInvalida, setCidadeInvalida] = useState(false);
  const [estadoInvalido, setEstadoInvalido] = useState(false);
  const [numeroInvalido, setNumeroInvalido] = useState(false);

  const fetchReclamacao = async () => {
    get(`reclamacao?id=${id}`, true)
      .then((response) => {
        if (response.status === 200) {
          response.json().then((reclamacao) => {
            setDescricao(reclamacao.descricao);
            setCep(reclamacao.cep);
            setEndereco(reclamacao.endereco);
            setNumero(reclamacao.numero_endereco);
            setComplemento(reclamacao.ponto_referencia);
            setLatitude(reclamacao.latitude);
            setLongitude(reclamacao.longitude);
            setImageList(reclamacao.fotos);
            setBairro(reclamacao.bairro);
            setCidade(reclamacao.cidade);
            setEstado(reclamacao.estado);
            setCategoria(
              {
                via: "Irregularidades no Asfalto",
                calcada: "Irregularidades na Calçada",
                sinalizacao: "Falta de Sinalização",
                lixo: "Lixo na Via",
                carro: "Veículo Abandonado",
                iluminacao: "Falta de Iluminação",
                outros: "Outros",
              }[reclamacao.categoria]
            );
            setMarker({
              latitude: Number(reclamacao.latitude),
              longitude: Number(reclamacao.longitude),
            });
          });
        } else {
          Alert.alert(
            "Ops!",
            "Ocorreu um erro inesperado ao buscar a reclamação"
          );
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (id) {
      fetchReclamacao();
    }
  }, []);

  const handleSubmit = async () => {
    if (loadingSalvar) return;
    setLoadingSalvar(true);
    setDescricaoInvalida(false);
    setEnderecoInvalido(false);
    setCepInvalido(false);
    setCategoriaInvalida(false);
    setBairroInvalido(false);
    setCidadeInvalida(false);
    setEstadoInvalido(false);
    setNumeroInvalido(false);

    let cepTemp = false;
    let enderecoTemp = false;
    let descricaoTemp = false;
    let categoriaTemp = false;
    let localTemp = false;
    let bairroTemp = false;
    let cidadeTemp = false;
    let estadoTemp = false;
    let numeroInvalidoTemp = false;

    if (!validarCep(cep)) {
      cepTemp = true;
      setCepInvalido(true);
    }

    if (!endereco.trim()) {
      enderecoTemp = true;
      setEnderecoInvalido(true);
    }

    if (!descricao.trim()) {
      descricaoTemp = true;
      setDescricaoInvalida(true);
    }

    if (!categoria) {
      categoriaTemp = true;
      setCategoriaInvalida(true);
    }

    if (!(latitude && longitude)) {
      localTemp = true;
      Alert.alert(
        "Atenção!",
        "Selecione um local no mapa para prosseguir com a criação da sua reclamação."
      );
    }

    if (!bairro.trim()) {
      bairroTemp = true;
      setBairroInvalido(true);
    }

    if (!cidade.trim()) {
      cidadeTemp = true;
      setCidadeInvalida(true);
    }

    if (!estado) {
      estadoTemp = true;
      setEstadoInvalido(true);
    }

    if (!numero.trim()) {
      numeroInvalidoTemp = true;
      setNumeroInvalido(true);
    }

    if (
      descricaoTemp ||
      enderecoTemp ||
      cepTemp ||
      categoriaTemp ||
      localTemp ||
      bairroTemp ||
      cidadeTemp ||
      estadoTemp ||
      numeroInvalidoTemp
    ) {
      setLoadingSalvar(false);
      return;
    }

    await put(
      `reclamacao?id=${id}`,
      {
        descricao: descricao,
        endereco: endereco,
        numero_endereco: numero,
        ponto_referencia: complemento,
        cep: cep,
        latitude: latitude?.toString(),
        longitude: longitude?.toString(),
        categoria: {
          "Irregularidades no Asfalto": "via",
          "Irregularidades na Calçada": "calcada",
          "Falta de Sinalização": "sinalizacao",
          "Lixo na Via": "lixo",
          "Veículo Abandonado": "carro",
          "Falta de Iluminação": "iluminacao",
          Outros: "outros",
        }[categoria],
        bairro: bairro,
        cidade: cidade,
        estado: {
          AC: "AC",
          AL: "AL",
          AP: "AP",
          AM: "AM",
          BA: "BA",
          CE: "CE",
          DF: "DF",
          ES: "ES",
          GO: "GO",
          MA: "MA",
          MT: "MT",
          MS: "MS",
          MG: "MG",
          PA: "PA",
          PB: "PB",
          PR: "PR",
          PE: "PE",
          PI: "PI",
          RR: "RR",
          RO: "RO",
          RJ: "RJ",
          RN: "RN",
          RS: "RS",
          SC: "SC",
          SP: "SP",
          SE: "SE",
          TO: "TO",
        }[estado],
      },
      true
    )
      .then((response) => {
        if (response.status === 200) {
          Alert.alert("Sucesso", "Reclamação editada com sucesso.");
          router.navigate("screens/MinhasReclamacoes");
        } else {
          Alert.alert(
            "Ops!",
            "Ocorreu um erro inesperado ao editar a reclamação."
          );
        }
      })
      .finally(() => setLoadingSalvar(false));
  };

  return (
    <ActionSheetProvider>
      <ScrollView>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader
              titulo={"Editar Reclamação"}
              logado={true}
              goBack={true}
              showText={true}
            />
            {loading ? (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: height / 2 - 100,
                }}
              >
                <View
                  style={{ justifyContent: "center", alignItems: "center" }}
                >
                  <ActivityIndicator size={60} color="#FF7C33" />
                </View>
              </View>
            ) : (
              <View style={{ ...styles.container, width: "100%" }}>
                <PagerView
                  style={styles.imagePlaceholder}
                  initialPage={0}
                  onPageSelected={(e) => {
                    setImageIndex(e.nativeEvent.position);
                  }}
                >
                  {imageList.map((image, index) => (
                    <View style={styles.page} key={index}>
                      <Image
                        source={{ uri: image }}
                        style={styles.reclamacaoImage}
                      />
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
                />

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
                  error={numeroInvalido}
                  errorMessage="Campo obrigatório"
                />

                <CTextInput
                  placeholder="Ponto de referência"
                  state={complemento}
                  setState={setComplemento}
                />

                <CTextInput
                  placeholder="Bairro"
                  state={bairro}
                  setState={setBairro}
                  error={bairroInvalido}
                  errorMessage="Bairro não pode ser vazio"
                ></CTextInput>

                <CTextInput
                  placeholder="Cidade"
                  state={cidade}
                  setState={setCidade}
                  error={cidadeInvalida}
                  errorMessage="Cidade não pode ser vazio"
                ></CTextInput>

                <CActionSheet
                  state={estado}
                  setState={setEstado}
                  placeholder="Estado"
                  itens={[
                    "AC",
                    "AL",
                    "AP",
                    "AM",
                    "BA",
                    "CE",
                    "DF",
                    "ES",
                    "GO",
                    "MA",
                    "MT",
                    "MS",
                    "MG",
                    "PA",
                    "PB",
                    "PR",
                    "PE",
                    "PI",
                    "RR",
                    "RO",
                    "RJ",
                    "RN",
                    "RS",
                    "SC",
                    "SP",
                    "SE",
                    "TO",
                  ]}
                  error={estadoInvalido}
                  errorMessage="Selecione uma opção"
                />

                <CTextButton
                  buttonStyle={{
                    backgroundColor: "#FF7C33",
                  }}
                  textStyle={{
                    color: "#FFFFFF",
                  }}
                  text="Salvar"
                  loading={loadingSalvar}
                  callback={() => {
                    handleSubmit().finally(() => setLoadingSalvar(false));
                  }}
                />
              </View>
            )}
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
  imagePlaceholder: {
    marginTop: 8,
    width: width,
    height: width,
  },
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  reclamacaoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
