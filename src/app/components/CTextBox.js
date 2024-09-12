import { StyleSheet, TextInput, View, Text } from "react-native";

export default function CTextBox(props) {
  return (
    <View style={{ width: "100%", margin: 8 }}>
      <TextInput
        style={
          props.inputStyle
            ? props.error
              ? { ...styles.input, ...props.inputStyle }
              : { ...styles.input, ...props.inputStyle, borderColor: "#ff0022" }
            : props.error
            ? { ...styles.input, borderColor: "#ff0022" }
            : styles.input
        }
        placeholder={props.placeholder}
        multiline={true}
        placeholderTextColor="#555555"
        maxLength={props.maxLength}
        onChangeText={(text) => {
          if (props.setState) {
            props.setState(text);
          }
        }}
      ></TextInput>
      {props.error && props.errorMessage && (
        <Text style={{ color: "#ff0022" }}>{props.errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "transparent",
    padding: 10,
    textAlignVertical: "top",
    height: 120,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
    width: "100%",
    fontSize: 18,
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
});
