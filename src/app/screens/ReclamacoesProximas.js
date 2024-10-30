import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  ScrollView,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";
import CReclamacaoCard from "../components/CReclamacaoCard";
import { useEffect, useState } from "react";
import { post, get } from "../utils/api";
import CTextButton from "../components/CTextButton";

const RECLAMACOES_POR_PAGINA = 10;

const { height, width } = Dimensions.get("window");

const Feed = observer(() => {
  const params = useLocalSearchParams();
  const [reclamacoes, setReclamacoes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [paginaCheia, setPaginaCheia] = useState(false);
  const [initLoading, setInitLoading] = useState(true);
  const [error, setError] = useState(false);
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [categoria, setCategoria] = useState("");
  const [payload, setPayload] = useState(null);

  const handleSubmitCancelar = async () => {
    Alert.alert(
      "Atenção!",
      "Tem certeza que cancelar a criação da reclamação?",
      [
        {
          text: "Não",
        },
        {
          text: "Sim",
          onPress: () => {
            router.push("screens/Feed?logado=true");
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleSubmitContinuar = async () => {
    await post("reclamacao", payload, true).then((data) => {
      if (data.status !== 201) {
        Alert.alert(
          "Ops!",
          "Ocorreu um erro inesperado ao criar a reclamação."
        );
        return;
      }
      router.push("screens/Feed?logado=true");
      Alert.alert("Sucesso", "Reclamação criada com sucesso.");
    });
  };

  const getAll = async (localPage) => {
    get(
      `reclamacoes-proximas?longitude=${longitude}&latitude=${latitude}&page=${page}&categoria=${categoria}`,
      true
    )
      .then((data) => {
        if (data.status !== 200) {
          if (initLoading) {
            setError(true);
          } else {
            Alert.alert("Erro", "Não foi possível carregar mais reclamações.");
          }
          return;
        }
        data.json().then((json) => {
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
  };

  useEffect(() => {
    const data = JSON.parse(params.data);
    setLongitude(data.longitude);
    setLatitude(data.latitude);
    setCategoria(data.categoria);
    setReclamacoes(data.reclamacoes);
    setPayload(data.payload);
    if (initLoading) setInitLoading(false);
  }, []);

  return (
    <View>
      <ScrollView
        onScroll={({ nativeEvent }) => {
          const screenTop = nativeEvent.contentOffset.y;
          const pageSize = nativeEvent.contentSize.height;
          if (screenTop + height * 2 > pageSize && !loading && !paginaCheia) {
            setPage(page + 1);
            setLoading(true);
            getAll(page + 1);
          }
        }}
      >
        <View style={styles.container}>
          <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
          <CHeader
            titulo={"Reclamações Próximas"}
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  Não foi possível carregar o feed de reclamações nesse
                  momento...
                </Text>
                <Text style={{ fontSize: 20, textAlign: "center" }}>
                  Tente novamente em alguns instantes.
                </Text>
              </View>
            </View>
          ) : (
            <View style={styles.feed}>
              {reclamacoes &&
                reclamacoes.map((reclamacao, index) => (
                  <CReclamacaoCard
                    id={reclamacao.id}
                    nome={reclamacao.nome_usuario}
                    foto={reclamacao.foto_usuario}
                    rua={reclamacao.endereco}
                    descricao={reclamacao.descricao}
                    imagens={reclamacao.fotos}
                    categoria={reclamacao.categoria}
                    numero={reclamacao.numero_endereco}
                    status={reclamacao.status}
                    Curtidas={reclamacao.qtd_curtidas}
                    key={index}
                    logado={true}
                    showComentario={false}
                    showDetalhes={false}
                  />
                ))}
              <View style={{ height: 160 }}></View>
            </View>
          )}
        </View>
      </ScrollView>
      <View style={styles.floatingBar}>
        <CTextButton
          buttonStyle={{
            backgroundColor: "#FF7C33",
            paddingVertical: 5,
            height: 60,
          }}
          textStyle={{
            color: "#FFFFFF",
          }}
          text="Encontrei meu problema, cancelar criação"
          loading={loading}
          callback={() => {
            if (loading) return;
            setLoading(true);
            handleSubmitCancelar().finally(() => setLoading(false));
          }}
        ></CTextButton>
        <CTextButton
          buttonStyle={{
            backgroundColor: "#FF7C33",
            paddingVertical: 5,
            height: 60,
          }}
          textStyle={{
            color: "#FFFFFF",
          }}
          text="Não encontrei minha reclamação, continuar com a criação"
          loading={loading}
          callback={() => {
            if (loading) return;
            setLoading(true);
            handleSubmitContinuar().finally(() => setLoading(false));
          }}
        ></CTextButton>
      </View>
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
  floatingBar: {
    position: "absolute",
    zIndex: 1000,
    height: 160,
    width: width,
    backgroundColor: "#FFF",
    bottom: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopStartRadius: 15,
    borderTopEndRadius: 15,
    borderColor: "#D9D9D9",
    borderWidth: 1,
  },
  iconContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Feed;
