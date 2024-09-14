import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
  Pressable,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import packageJson from "../../../package.json";

const { width } = Dimensions.get("window");

export default function CHeader(props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const abrirMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  const deslogar = async () => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar a saída você será desconectado de todas as sessões.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK",
          onPress: async () => {
            await AsyncStorage.setItem("token", "");
            router.push("screens/Feed?logado=false");
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.iconContainer}
          >
            <FontAwesomeIcon icon={faArrowLeft} size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>{props.titulo}</Text>

          <Pressable
            onPress={abrirMenu}
            style={[styles.iconContainer, styles.centerIcon]}
          >
            <FontAwesomeIcon icon={faCircleUser} size={35} color="#000" />
          </Pressable>
        </View>
        <View style={styles.topLine} />
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={abrirMenu}
      >
        <Pressable style={styles.overlay} onPress={abrirMenu}>
          <Animated.View
            style={[styles.modal, { transform: [{ translateX: slideAnim }] }]}
          >
            <View style={styles.menu}>
              <FontAwesomeIcon icon={faCircleUser} size={120} color="#000" />

              <View style={styles.innerLine} />

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  abrirMenu();
                  router.push("screens/EditarUsuario");
                }}
              >
                <Text style={styles.menuText}>Editar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  abrirMenu();
                  router.push("screens/EditarSenha");
                }}
              >
                <Text style={styles.menuText}>Editar Senha</Text>
              </TouchableOpacity>

              {/* TODO: tela minhas denuncias programada para próximas sprints */}
              {/* <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  abrirMenu();
                  router.push("screens/MinhasDenuncias");
                }}
              >
                <Text style={styles.menuText}>Minhas Denúncias</Text>
              </TouchableOpacity> */}

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => {
                  abrirMenu();
                  deslogar();
                }}
              >
                <Text style={styles.menuText}>Sair</Text>
              </TouchableOpacity>
            </View>
            <View>
              <Text style={styles.versao}>Versão: {packageJson.version}</Text>
            </View>
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: width,
    paddingTop: 10,
  },
  topLine: {
    backgroundColor: "#FF7C33",
    height: 4,
    width: width,
  },
  innerLine: {
    backgroundColor: "#FF7C33",
    height: 4,
    width: "100%",
    marginTop: 30,
    marginBottom: 10,
  },
  centerIcon: {
    textAlign: "center",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingLeft: 5,
    paddingRight: 5,
  },
  iconContainer: {
    padding: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
  },
  modal: {
    position: "absolute",
    right: 0,
    top: 0,
    width: width - width / 3,
    height: "100%",
    backgroundColor: "#fff",
  },
  menu: {
    paddingTop: 50,
    flex: 1,
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  menuTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  menuItem: {
    marginTop: 20,
  },
  menuText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  versao: {
    fontSize: 13,
    textAlign: "center",
    color: "#555555",
    margin: 10,
  },
});
