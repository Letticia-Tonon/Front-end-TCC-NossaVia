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
} from "react-native";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";
import CDenunciaSelf from "../components/CDenunciaSelf";
import { useEffect, useState } from "react";
import { get } from "../utils/api";
import locationContext from "../contexts/location";
import { LocalSvg } from "react-native-svg/css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

const DENUNCIAS_POR_PAGINA = 10;

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

const MinhasDenuncias = observer(() => {
  const [denuncias, setDenuncias] = useState([]);
  const [page, setPage] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaCheia, setPaginaCheia] = useState(false);
  const [status, setStatus] = useState("");

  const getSelf = async (localPage) => {
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      get(`minhas-denuncias?&page=${localPage}`, true)
        .then((data) => {
          if (data.status !== 200) {
            Alert.alert("Erro", "Não foi possível carregar as denúncias.");
            return;
          }
          data.json().then((json) => {
            setCategoria("");
            if (json.length < DENUNCIAS_POR_PAGINA) {
              setPaginaCheia(true);
            }
            if (localPage === 0) {
              setDenuncias(json);
              return;
            }
            setDenuncias([...denuncias, ...json]);
          });
        })
        .finally(() => setLoading(false));
    }
  };

  const getByCategoria = async (categoria, localPage) => {
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      return get(
        `minhas-denuncias?&page=${localPage}&categoria=${categoria.id}`,
        true
      ).then((data) => {
        if (data.status !== 200) {
          Alert.alert("Erro", "Não foi possível carregar as denúncias.");
          return;
        }
        data
          .json()
          .then((json) => {
            setCategoria(categoria);
            if (json.length < DENUNCIAS_POR_PAGINA) {
              setPaginaCheia(true);
            }
            if (localPage === 0) {
              setDenuncias(json);
              return;
            }
            setDenuncias([...denuncias, ...json]);
          })
          .finally(() => {
            setLoading(false);
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

    getSelf(0);

    return () => backHandler.remove();
  }, []);

  return (
    <ActionSheetProvider>
      <View>
        <ScrollView
          onScroll={({ nativeEvent }) => {
            const screenTop = nativeEvent.contentOffset.y;
            const pageSize = nativeEvent.contentSize.height;
            if (screenTop + height * 2 > pageSize && !loading && !paginaCheia) {
              setPage(page + 1);
              setLoading(true);
              if (categoria) {
                getByCategoria(categoria, page + 1);
              } else {
                getSelf(page + 1);
              }
            }
          }}
        >
          <View style={styles.container}>
            <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
            <CHeader
              titulo={"Minhas Denúncias"}
              logado={true}
              showText={true}
              goBack={true}
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
                  Filtrar Por: {categoria.name}
                </Text>
                {categoria && (
                  <TouchableOpacity
                    onPress={() => {
                      if (loading) return;
                      setLoading(true);
                      setPaginaCheia(false);
                      setPage(0);
                      getSelf(0);
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
                      if (loading) return;
                      setLoading(true);
                      setPaginaCheia(false);
                      setPage(0);
                      getByCategoria(categoria, 0);
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
                  <CDenunciaSelf
                    id={denuncia.id}
                    nome={denuncia.nome_usuario}
                    foto={denuncia.foto_usuario}
                    rua={denuncia.endereco}
                    descricao={denuncia.descricao}
                    imagens={denuncia.fotos}
                    categoria={denuncia.categoria}
                    key={index}
                    status_denuncia={denuncia.status}
                    numero={denuncia.numero_endereco}
                  />
                ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </ActionSheetProvider>
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

export default MinhasDenuncias;
