import {
  StyleSheet,
  View,
  StatusBar,
  Alert,
  BackHandler,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import CTextButton from "../components/CTextButton";
import { useLocalSearchParams } from "expo-router";
import { observer } from "mobx-react-lite";
import CHeader from "../components/CHeader";
import CDenunciaCard from "../components/CDenunciaCard";
import { useEffect, useState } from "react";
import { get } from "../utils/api";
import locationContext from "../contexts/location";

const Feed = observer(() => {
  const { logado } = useLocalSearchParams();
  const [denuncias, setDenuncias] = useState([]);

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
    if (
      locationContext &&
      locationContext.location &&
      locationContext.location.coords &&
      locationContext.location.coords.latitude &&
      locationContext.location.coords.longitude
    ) {
      get(
        `denuncia?longitude=${locationContext.location.coords.longitude}&latitude=${locationContext.location.coords.longitude}&page=0`
      ).then((data) => {
        data.json().then((json) => {
          setDenuncias(json);
        });
      });
    }

    return () => backHandler.remove();
  }, []);

  return (
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
          {denuncias.map((denuncia, index) => (
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

          <CTextButton
            buttonStyle={{
              backgroundColor: "#FF7C33",
            }}
            textStyle={{
              color: "#FFFFFF",
            }}
            text="Criar denúncia"
            callback={() => {
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
          ></CTextButton>
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
    width: "100%",
    paddingBottom: 5,
  },
  feed: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
});

export default Feed;
