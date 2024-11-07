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
  ActivityIndicator,
} from "react-native";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";
import CReclamacaoSelf from "../components/CReclamacaoSelf";
import { useEffect, useState } from "react";
import { get } from "../utils/api";
import locationContext from "../contexts/location";
import { LocalSvg } from "react-native-svg/css";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { router } from "expo-router";

const RECLAMACOES_POR_PAGINA = 10;

const { height, width } = Dimensions.get("window");

const categorias = [
  {
    name: "Irregularidades no Asfalto",
    icon: require("../../../assets/icons/irregularidades_asfalto.svg"),
    id: "via",
  },
  {
    name: "Irregularidades na Calçada",
    icon: require("../../../assets/icons/irregularidades_calcada.svg"),
    id: "calcada",
  },
  {
    name: "Falta de Sinalização",
    icon: require("../../../assets/icons/falta_sinalizacao.svg"),
    id: "sinalizacao",
  },
  {
    name: "Lixo na Via",
    icon: require("../../../assets/icons/lixo_via.svg"),
    id: "lixo",
  },
  {
    name: "Veículo Abandonado",
    icon: require("../../../assets/icons/veiculo_abandonado.svg"),
    id: "carro",
  },
  {
    name: "Falta de Iluminação",
    icon: require("../../../assets/icons/falta_iluminacao.svg"),
    id: "iluminacao",
  },
  {
    name: "Outros",
    icon: require("../../../assets/icons/outros.svg"),
    id: "outros",
  },
];

const MinhasReclamacoes = observer(() => {
  const [reclamacoes, setReclamacoes] = useState([]);
  const [page, setPage] = useState(0);
  const [categoria, setCategoria] = useState("");
  const [loading, setLoading] = useState(false);
  const [paginaCheia, setPaginaCheia] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState(false);

  const deleteReclamacao = (id) => {
    setReclamacoes(reclamacoes.filter((reclamacao) => reclamacao.id !== id));
  };

  const getSelf = async (localPage) => {
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      get(`minhas-reclamacoes?&page=${localPage}`, true)
        .then(async (data) => {
          if (data.status !== 200) {
            if (initLoading) {
              setError(true);
            } else {
              Alert.alert("Erro", "Não foi possível carregar as reclamações.");
            }
            return;
          }
          await data.json().then((json) => {
            setCategoria("");
            if (json.length < RECLAMACOES_POR_PAGINA) {
              setPaginaCheia(true);
            }
            if (localPage === 0) {
              setReclamacoes(json);
              return;
            }
            setReclamacoes([...reclamacoes, ...json]);
          });
        })
        .finally(() => {
          if (initLoading) setInitLoading(false);
          setLoading(false);
        });
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
        `minhas-reclamacoes?&page=${localPage}&categoria=${categoria.id}`,
        true
      )
        .then(async (data) => {
          if (data.status !== 200) {
            Alert.alert("Erro", "Não foi possível carregar as reclamações.");
            return;
          }
          await data.json().then((json) => {
            setCategoria(categoria);
            if (json.length < RECLAMACOES_POR_PAGINA) {
              setPaginaCheia(true);
            }
            if (localPage === 0) {
              setReclamacoes(json);
              return;
            }
            setReclamacoes([...reclamacoes, ...json]);
          });
        })
        .finally(() => {
          setLoading(false);
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
          router.back();
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
              titulo={"Minhas Reclamações"}
              logado={true}
              showText={true}
              goBack={true}
              showIcon={true}
            />

            {initLoading ? (
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
            ) : error ? (
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
                  <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Não foi possível carregar as suas reclamações nesse
                    momento...
                  </Text>
                  <Text style={{ fontSize: 20, textAlign: "center" }}>
                    Tente novamente em alguns instantes.
                  </Text>
                </View>
              </View>
            ) : (
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
                    </TouchableOpacity>
                  ))}
                </ScrollView>
                {reclamacoes &&
                  reclamacoes.map((reclamacao, index) => (
                    <CReclamacaoSelf
                      id={reclamacao.id}
                      nome={reclamacao.nome_usuario}
                      foto={reclamacao.foto_usuario}
                      rua={reclamacao.endereco}
                      descricao={reclamacao.descricao}
                      imagens={reclamacao.fotos}
                      categoria={reclamacao.categoria}
                      key={index}
                      status_reclamacao={reclamacao.status}
                      numero={reclamacao.numero_endereco}
                      deleteReclamacao={deleteReclamacao}
                    />
                  ))}
              </View>
            )}
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
    elevation: 8,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default MinhasReclamacoes;
