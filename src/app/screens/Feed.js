import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  BackHandler,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Text,
  Pressable,
} from "react-native";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";
import CDenunciaCard from "../components/CDenunciaCard";
import { useEffect, useState } from "react";
import { get } from "../utils/api";
import locationContext from "../contexts/location";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { LocalSvg } from "react-native-svg/css";

const { height, width } = Dimensions.get("window");

const categorias = [
  {
    name: "Asfalto",
    icon: require("../../../assets/icons/irregularidades_asfalto.svg"),
    id: "via",
  },
  {
    name: "Calçada",
    icon: require("../../../assets/icons/irregularidades_calcada.svg"),
    id: "calcada",
  },
  {
    name: "Iluminação",
    icon: require("../../../assets/icons/falta_iluminacao.svg"),
    id: "iluminacao",
  },
  {
    name: "Sinalização",
    icon: require("../../../assets/icons/falta_sinalizacao.svg"),
    id: "sinalizacao",
  },
  {
    name: "Lixo",
    icon: require("../../../assets/icons/lixo_via.svg"),
    id: "lixo",
  },
  {
    name: "Carro",
    icon: require("../../../assets/icons/veiculo_abandonado.svg"),
    id: "carro",
  },
  {
    name: "Outros",
    icon: require("../../../assets/icons/outros.svg"),
    id: "outros",
  },
];

const Feed = observer(() => {
  const { logado } = useLocalSearchParams();
  const [denuncias, setDenuncias] = useState([]);
  const [page, setPage] = useState(0);
  const [categoria, setCategoria] = useState("");

  const getAll = async () => {
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      get(
        `denuncia?longitude=${locationContext.location.coords.longitude}&latitude=${locationContext.location.coords.latitude}&page=${page}`
      ).then((data) => {
        if (data.status !== 200) {
          Alert.alert("Erro", "Não foi possível carregar as denúncias.");
          return;
        }
        data.json().then((json) => {
          setCategoria("")
          setDenuncias(json);
        });
      });
    }
  };

  const getByCategoria = async (categoria) => {
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      return get(
        `denuncia?longitude=${locationContext.location.coords.longitude}&latitude=${locationContext.location.coords.latitude}&page=${page}&categoria=${categoria.id}`
      ).then((data) => {
        if (data.status !== 200) {
          Alert.alert("Erro", "Não foi possível carregar as denúncias.");
          return;
        }
        data.json().then((json) => {
          setCategoria(categoria.name)
          setDenuncias(json);
        });
      });
    }
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        try {
          return true;
        } finally {
          BackHandler.exitApp();
        }
      }
    );

    getAll();

    return () => backHandler.remove();
  }, []);

  return (
    <View>
      {/* Botão Flutuante */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => {
          if (logado === "false") {
            Alert.alert(
              "Atenção!",
              "Para criar uma denúncia você precisa entrar na sua conta.",
              [
                {
                  text: "Cancelar",
                },
                {
                  text: "Entrar",
                  onPress: () => {
                    router.push("screens/Login");
                  },
                },
              ],
              {
                cancelable: true,
              }
            );
            return;
          }
          router.push("screens/CriarDenuncia");
        }}
      >
        <FontAwesomeIcon icon={faPlus} size={24} color="#fff" />
      </TouchableOpacity>
      <ScrollView>
        <View style={styles.container}>
          <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
          <CHeader
            titulo={"Feed"}
            logado={logado === "true"}
            showText={logado === "true"}
            goBack={false}
            showIcon={true}
          />

          <View style={styles.feed}>
            <View
              style={{
                width: "100%",
                alignItems: "flex-start",
                marginTop: 5,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: "bold",
                }}
              >
                Filtrar Por: {categoria}
              </Text>
              {categoria && (
                <TouchableOpacity
                  onPress={() => {
                    getAll();
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                    }}
                  >
                    Limpar Filtro
                  </Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal={true}
              style={{ width: width, paddingHorizontal: 5 }}
              showsHorizontalScrollIndicator={false}
            >
              {categorias.map((categoria, index) => (
                <TouchableOpacity
                  style={styles.iconContainer}
                  key={index}
                  onPress={() => {
                    getByCategoria(categoria);
                  }}
                >
                  <LocalSvg
                    asset={categoria.icon}
                    height={75}
                    width={75}
                    style={{ marginHorizontal: 4 }}
                  />
                  <Text>{categoria.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {denuncias &&
              denuncias.map((denuncia, index) => (
                <CDenunciaCard
                  nome={denuncia.nome_usuario}
                  foto={denuncia.foto_usuario}
                  rua={denuncia.endereco}
                  descricao={denuncia.descricao}
                  imagens={denuncia.fotos}
                  categoria={denuncia.categoria}
                  key={index}
                />
              ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    paddingBottom: 5,
  },
  feed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  floatingButton: {
    position: "absolute",
    zIndex: 1000,
    top: height - 70,
    left: width - 77,
    backgroundColor: "#FF7C33",
    borderRadius: 50,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 2 },
    elevation: 8, // Sombra
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Feed;
