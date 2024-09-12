import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCircleUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native"; // Para controlar a navegação

const { height, width } = Dimensions.get("window");

export default function CHeader(props) {
  const navigation = useNavigation(); // Para controlar a navegação com a seta
  return (
    <View style={styles.headerContainer}>
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.iconContainer}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={28} color="#000" />
        </TouchableOpacity>

        <Text style={styles.title}>{props.titulo}</Text>

        <TouchableOpacity style={styles.iconContainer}>
          <FontAwesomeIcon icon={faCircleUser} size={35} color="#000" />
        </TouchableOpacity>
      </View>
      <View style={styles.topLine} />
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
});
