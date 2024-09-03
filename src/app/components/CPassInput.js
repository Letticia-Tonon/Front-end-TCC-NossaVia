import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { useState } from "react";

const INPUT_HEIGHT = 50;

export default function CTextInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={styles.container}>
      <TextInput
        style={
          props.inputStyle
            ? { ...styles.input, ...props.inputStyle }
            : styles.input
        }
        placeholder={props.placeholder}
        secureTextEntry={!showPassword}
        placeholderTextColor="#555555"
      ></TextInput>
      <Pressable
        style={styles.icon}
        onPress={() => {
          setShowPassword(!showPassword);
        }}
      >
        <FontAwesomeIcon
          icon={showPassword ? faEye : faEyeSlash}
          size={INPUT_HEIGHT - 25}
          color="#FF7C33"
        ></FontAwesomeIcon>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    margin: 8,
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
  },
  input: {
    backgroundColor: "transparent",
    height: INPUT_HEIGHT,
    width: "85%",
    paddingHorizontal: 10,
    fontSize: 18,
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
});