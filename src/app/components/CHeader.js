import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { router } from "expo-router"; 
import AsyncStorage from "@react-native-async-storage/async-storage"; // Para gerenciamento do AsyncStorage

const { width } = Dimensions.get("window");

export default function CHeader(props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(width)).current;

  const abrirMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 100,
        useNativeDriver: true,
      }).start(() => setMenuVisible(false));
    } else {
      setMenuVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const deslogar = async () => {
    // Limpa o token do AsyncStorage
    await AsyncStorage.setItem("token", "");
    // Navega para a tela de Feed com logado=false
    router.push("screens/Feed?logado=false");
  };

  return (
    <View>
      <View style={styles.headerContainer}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.iconContainer}>
            <FontAwesomeIcon icon={faArrowLeft} size={28} color="#000" />
          </TouchableOpacity>

          <Text style={styles.title}>{props.titulo}</Text>

          <TouchableOpacity onPress={abrirMenu} style={[styles.iconContainer, styles.centerIcon]}>
            <FontAwesomeIcon icon={faCircleUser} size={35} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.topLine} />
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={menuVisible}
        onRequestClose={abrirMenu}
      >
        <TouchableOpacity style={styles.overlay} onPress={abrirMenu}>
          <Animated.View
            style={[
              styles.menu,
              { transform: [{ translateX: slideAnim }] },
            ]}
          >
            <Text style={styles.menuTitle}>Menu Usuário</Text>
            
            <FontAwesomeIcon icon={faCircleUser} size={100} color="#000"  />

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
                router.push("/denuncias");
              }}
            >
              <Text style={styles.menuText}>Minhas Denúncias</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                abrirMenu();
                deslogar(); // Chama a função de logout
              }}
            >
              <Text style={styles.menuText}>Sair</Text>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
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
  centerIcon:{
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
  menu: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#FFF",
    padding: 20,
    borderLeftWidth: 1,
    borderColor: "#ccc",
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
    marginVertical: 10,
  },
  menuText: {
    fontSize: 18,
  },
});
