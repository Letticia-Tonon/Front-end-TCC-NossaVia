import { StyleSheet, TextInput } from "react-native";

export default function CTextInput(props) {
  return (
    <TextInput
      style={
        props.inputStyle
          ? { ...styles.input, ...props.inputStyle }
          : styles.input
      }
      placeholder={props.placeholder}
      secureTextEntry={props.password === true}
      placeholderTextColor="#555555"
    ></TextInput>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    height: 50,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
    width: "100%",
    paddingHorizontal: 10,
    fontSize: 18,
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 8,
  },
});
