import { StyleSheet, TextInput, View, Text } from "react-native";

export default function CTextInput(props) {
  const styles = StyleSheet.create({
    input: {
      backgroundColor: "transparent",
      height: 50,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: props.error ? "#ff0022" : "#555555",
      width: "100%",
      paddingHorizontal: 10,
      fontSize: 18,
      outlineStyle: "none",
      shadowColor: "#000",
      shadowOffset: { width: -1, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      color: props.disabled ? "#888" : "#000",
    },
  });

  return (
    <View style={{ width: "100%", margin: 8 }}>
      <TextInput
        style={
          props.inputStyle
            ? { ...styles.input, ...props.inputStyle }
            : styles.input
        }
        placeholder={props.placeholder}
        placeholderTextColor="#888"
        onChangeText={(text) => {
          if (props.setState) {
            props.setState(text);
          }
        }}
        editable={!props.disabled}
        value={props.mask ? props.mask(props.state) : props.state}
        maxLength={props.maxLength}
        keyboardType={props.keyboardType ? props.keyboardType : "default"}
      ></TextInput>
      {props.error && props.errorMessage && (
        <Text style={{ color: "#ff0022" }}>{props.errorMessage}</Text>
      )}
    </View>
  );
}
