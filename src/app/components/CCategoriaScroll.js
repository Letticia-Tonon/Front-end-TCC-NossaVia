import {
  View,
  StyleSheet,
  ScrollView,
  Text,
} from "react-native";
import { LocalSvg } from "react-native-svg/css";

const categorias = [
  {
    name: "Iluminacao",
    icon: require("../../../assets/icons/falta_iluminacao.svg"),
  },
  {
    name: "Sinalizacao",
    icon: require("../../../assets/icons/falta_sinalizacao.svg"),
  },
  {
    name: "Via",
    icon: require("../../../assets/icons/irregularidades_asfalto.svg"),
  },
  {
    name: "Calcada",
    icon: require("../../../assets/icons/irregularidades_calcada.svg"),
  },
  { name: "Lixo", icon: require("../../../assets/icons/lixo_via.svg") },
  {
    name: "Carro",
    icon: require("../../../assets/icons/veiculo_abandonado.svg"),
  },
  { name: "Outros", icon: require("../../../assets/icons/outros.svg") },
];

const CCategoriaScroll = () => {
  return (

      <ScrollView horizontal={true}>
         {categorias.map((categoria, index) => (
            <View style={styles.page} key={index}>
              <LocalSvg
              asset={categoria.icon}
              height={75}
              width={75}
              style={{ borderRadius: 32.5 }}
            />
            </View>
          ))}
      </ScrollView>

  );
};

const styles = StyleSheet.create({
  container: {

  },
  text: {

  },
});

export default CCategoriaScroll;
