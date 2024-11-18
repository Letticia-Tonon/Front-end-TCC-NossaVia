import React, { useEffect, useState, useRef } from "react";
import { LocalSvg } from "react-native-svg/css";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
  StatusBar,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import CHeader from "../components/CHeader";
import { get, post, del } from "../utils/api";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import PagerView from "react-native-pager-view";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import CCurtida from "../components/CCurtida";
import CTextBox from "../components/CTextBox";
import { observer } from "mobx-react-lite";
import userContext from "../contexts/user";
import { router } from "expo-router";

const RECLAMACOES_POR_PAGINA = 10;

const { height, width } = Dimensions.get("window");
const ILUMINCAO_ICON = require("../../../assets/icons/falta_iluminacao.svg");
const SINALIZACAO_ICON = require("../../../assets/icons/falta_sinalizacao.svg");
const VIA_ICON = require("../../../assets/icons/irregularidades_asfalto.svg");
const CALCADA_ICON = require("../../../assets/icons/irregularidades_calcada.svg");
const LIXO_ICON = require("../../../assets/icons/lixo_via.svg");
const CARRO_ICON = require("../../../assets/icons/veiculo_abandonado.svg");
const OUTROS_ICON = require("../../../assets/icons/outros.svg");

const DetalheReclamacao = observer(() => {
  const id = userContext && userContext.user ? userContext.user.id : null;

  const commentInputRef = useRef(null);

  const { logado, reclamacaoId, focusComment } = useLocalSearchParams();
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarios, setComentarios] = useState([]);

  const [page, setPage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [paginaCheia, setPaginaCheia] = useState(false);

  const [marker, setMarker] = useState(null);
  const [foto, setFoto] = useState("");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [categoria, setCategoria] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairo, setBairo] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [complemento, setComplemento] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [imageIndex, setImageIndex] = useState(0);
  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [Curtidas, setCurtidas] = useState(0);
  const [idsComentados, setIdsComentados] = useState([]);

  useEffect(() => {
    const fetchReclamacao = async () => {
      try {
        const response = await get(`reclamacao?id=${reclamacaoId}`, true);
        if (response.ok) {
          const reclamacao = await response.json();
          setNome(reclamacao.nome_usuario);
          setFoto(reclamacao.foto_usuario);
          setDescricao(reclamacao.descricao);
          setCep(reclamacao.cep);
          setEndereco(reclamacao.endereco);
          setNumero(reclamacao.numero_endereco);
          setBairo(reclamacao.bairro);
          setCidade(reclamacao.cidade);
          setEstado(reclamacao.estado);
          setComplemento(reclamacao.ponto_referencia);
          setCurtidas(reclamacao.qtd_curtidas);
          setLiked(reclamacao.curtido);
          setLatitude(reclamacao.latitude);
          setLongitude(reclamacao.longitude);
          setImageList(reclamacao.fotos);
          setCategoria(
            {
              via: "via",
              calcada: "calcada",
              sinalizacao: "sinalizacao",
              lixo: "lixo",
              carro: "carro",
              iluminacao: "iluminacao",
              outros: "outros",
            }[reclamacao.categoria]
          );
          setMarker({
            latitude: Number(reclamacao.latitude),
            longitude: Number(reclamacao.longitude),
          });
        } else {
          Alert.alert(
            "Ops!",
            "Ocorreu um erro inesperado ao buscar os detalhes da reclamação"
          );
        }
      } catch (error) {
        Alert.alert(
          "Erro",
          "Não foi possível buscar os detalhes da reclamação. Tente novamente."
        );
      } finally {
        setInitLoading(false);
        setLoading(false);
      }
    };

    fetchReclamacao();
    buscarComentarios(0);
  }, []);

  const buscarComentarios = async (localPage) => {
    get(`comentario?reclamacao=${reclamacaoId}&page=${localPage}`)
      .then((data) => {
        if (data.ok) {
          data.json().then((json) => {
            if (json.length < RECLAMACOES_POR_PAGINA) {
              setPaginaCheia(true);
            }
            if (localPage === 0) {
              setComentarios(json);
              return;
            }
            const filtrado = json.filter((value) => {
              if (idsComentados.includes(value.id_comenatario)) {
                return false;
              }
              return true;
            });
            setComentarios([...comentarios, ...filtrado]);
          });
        } else {
          Alert.alert("Erro ao buscar comentários");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const enviarComentario = async () => {
    if (logado === "false") {
      Alert.alert(
        "Atenção!",
        "Para interagir com uma reclamação você precisa entrar na sua conta.",
        [
          { text: "Cancelar" },
          {
            text: "Entrar",
            onPress: () => router.push("screens/Login"),
          },
        ],
        { cancelable: true }
      );
      return;
    }
    if (novoComentario === null || novoComentario.trim() === "") {
      setNovoComentario("");
      Alert.alert(
        "Atenção!",
        "O comentário não pode estar vazio.",
        [{ text: "OK" }],
        { cancelable: true }
      );
      return;
    }
    const payload = { texto: novoComentario, reclamacao: reclamacaoId };
    post("comentario", payload, true).then((data) => {
      if (data.ok) {
        setNovoComentario("");
        data.json().then((json) => {
          setIdsComentados([...idsComentados, json.id_comenatario]);
          setComentarios([json, ...comentarios]);
        });
      } else {
        Alert.alert("Erro ao enviar comentário");
      }
    });
  };

  const deleteComentario = async (idComentario) => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar, o comentário será permanentemente excluído.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK",
          onPress: async () => {
            if (loading) return;
            setLoading(true);
            try {
              const response = await del(`comentario?id=${idComentario}`, true);
              if (response.status !== 200) {
                Alert.alert(
                  "Ops!",
                  "Não foi possível deletar esse comentário."
                );
                return;
              }
              setComentarios(
                comentarios.filter(
                  (comentario) => comentario.id_comenatario !== idComentario
                )
              );
            } catch (error) {
              Alert.alert(
                "Erro",
                "Não foi possível deletar o comentário. Tente novamente."
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (initLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF7C33" />
      </View>
    );
  }
  return (
    <ScrollView
      onScroll={({ nativeEvent }) => {
        const screenTop = nativeEvent.contentOffset.y;
        const pageSize = nativeEvent.contentSize.height;
        if (screenTop + height + 50 > pageSize && !loading && !paginaCheia) {
          setPage(page + 1);
          setLoading(true);
          buscarComentarios(page + 1);
        }
      }}
    >
      <View style={{ ...styles.container, width: "100%" }}>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <CHeader
          titulo={"Detalhes"}
          logado={logado}
          showText={true}
          goBack={true}
          showIcon={true}
        />
        <PagerView
          style={styles.imagePlaceholder}
          initialPage={0}
          onPageSelected={(e) => {
            setImageIndex(e.nativeEvent.position);
          }}
        >
          {imageList.map((image, index) => (
            <View style={styles.page} key={index}>
              <Image source={{ uri: image }} style={styles.reclamacaoImage} />
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

        <View style={{ padding: 10, width: "100%" }}>
          <View style={styles.overlayIcons}>
            <Image
              source={{ uri: foto }}
              style={{
                width: 65,
                height: 65,
                borderRadius: 40,
              }}
            />

            {categoria && (
              <LocalSvg
                asset={
                  {
                    iluminacao: ILUMINCAO_ICON,
                    sinalizacao: SINALIZACAO_ICON,
                    via: VIA_ICON,
                    calcada: CALCADA_ICON,
                    lixo: LIXO_ICON,
                    carro: CARRO_ICON,
                    outros: OUTROS_ICON,
                  }[categoria]
                }
                height={75}
                width={75}
                style={{ borderRadius: 32.5 }}
              />
            )}
          </View>
          <View style={styles.userInfo}>
            <Text style={{ fontSize: 20 }}>{nome}</Text>

            <Text>
              {endereco}, {numero} - {bairo} - {cidade} - {estado}. {cep}
            </Text>

            {complemento && <Text>Ponto de referência: {complemento}</Text>}

            <Text style={{ fontStyle: "italic" }}>{descricao}</Text>
            <View style={styles.buttonContainer}>
              <CCurtida
                logado={logado}
                quantidade={Curtidas}
                idReclamacao={reclamacaoId}
                liked={liked}
              />
            </View>
          </View>
        </View>
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
        >
          {marker && <Marker coordinate={marker} />}
        </MapView>
      </View>
      <View>
        <View
          style={{
            width: "100%",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <CTextBox
              autofocus={focusComment === "true"}
              inputStyle={{
                height: 80,
              }}
              ref={commentInputRef}
              placeholder="Adicione um comentário..."
              maxLength={500}
              state={novoComentario}
              setState={setNovoComentario}
              onFocus={() => {
                if (logado === "false") {
                  commentInputRef.current.blur();
                  Alert.alert(
                    "Atenção!",
                    "Para interagir com uma reclamação você precisa entrar na sua conta.",
                    [
                      { text: "Cancelar" },
                      {
                        text: "Entrar",
                        onPress: () => router.push("screens/Login"),
                      },
                    ],
                    { cancelable: true }
                  );
                  return;
                }
              }}
            />
            <Pressable onPress={enviarComentario}>
              <FontAwesomeIcon
                icon={faPaperPlane}
                size={20}
                color="#FF7C33"
                style={{ flex: 1 }}
              />
            </Pressable>
          </View>
        </View>
        <View
          style={{
            width: "100%",
          }}
        >
          {comentarios.map((comentario, index) => (
            <View
              key={index}
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: 5,
                paddingBottom: 5,
              }}
            >
              <View
                style={{
                  display: "flex",
                  alignItems: "start",
                  height: "100%",
                  paddingTop: 2,
                }}
              >
                <Image
                  source={{ uri: comentario.foto }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 35,
                  }}
                />
              </View>
              <View
                style={{
                  marginLeft: 10,
                  display: "flex",
                  flex: 1,
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 5,
                  }}
                >
                  <Text style={{ fontSize: 20 }}>{comentario.nome}</Text>
                  <Text style={{ fontSize: 12, marginLeft: 10 }}>{`${
                    comentario.criacao.split("-")[2].split(" ")[0]
                  }/${comentario.criacao.split("-")[1]}/${
                    comentario.criacao.split("-")[0]
                  }   ${comentario.criacao.split(" ")[1].split(":")[0]}:${
                    comentario.criacao.split(" ")[1].split(":")[1]
                  }`}</Text>
                </View>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                  }}
                >
                  <Text style={{ flex: 1, flexWrap: "wrap" }}>
                    {comentario.texto}
                  </Text>
                </View>
              </View>
              {comentario.id_usuario === id && (
                <Pressable
                  onPress={() => {
                    deleteComentario(comentario.id_comenatario);
                  }}
                  style={{ justifyContent: "flex-end", marginRight: 10 }}
                >
                  <FontAwesomeIcon size={20} icon={faTrashCan} />
                </Pressable>
              )}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 5,
  },
  userInfo: {
    marginLeft: 5,
    marginTop: 5,
  },
  overlayIcons: {
    width: width,
    paddingHorizontal: 10,
    position: "absolute",
    top: -60,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    paddingTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 8,
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
  reclamacaoImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default DetalheReclamacao;
