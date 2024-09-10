import { Pressable, StyleSheet, TextInput, View, Text } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { useState } from "react";

const INPUT_HEIGHT = 50;

export default function CTextInput(props) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <View style={{ width: "100%", margin: 8 }}>
      <View
        style={
          props.error
            ? { ...styles.container, borderColor: "#ff0022" }
            : styles.container
        }
      >
        <TextInput
          style={
            props.inputStyle
              ? { ...styles.input, ...props.inputStyle }
              : styles.input
          }
          placeholder={props.placeholder}
          secureTextEntry={!showPassword}
          placeholderTextColor="#555555"
          onChangeText={(text) => {
            if (props.setState) {
              props.setState(text);
            }
          }}
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
      {props.error && props.errorMessage && (
        <Text style={{ color: "#ff0022" }}>{props.errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
    height: INPUT_HEIGHT,
  },
  input: {
    backgroundColor: "transparent",
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
