import { StyleSheet, TextInput, View, Text } from "react-native";
import React, { useImperativeHandle, forwardRef, useRef } from "react";

const CTextBox = forwardRef((props, ref) => {
  const internalInputRef = useRef();
  useImperativeHandle(ref, () => ({
    blur: () => {
      internalInputRef.current.blur();
    },
  }));

  return (
    <View style={{ width: "100%", margin: 8 }}>
      <TextInput
        autoFocus={props.autofocus}
        style={
          props.inputStyle
            ? props.error
              ? { ...styles.input, ...props.inputStyle, borderColor: "#ff0022" }
              : { ...styles.input, ...props.inputStyle }
            : props.error
            ? { ...styles.input, borderColor: "#ff0022" }
            : styles.input
        }
        placeholder={props.placeholder}
        value={props.state}
        multiline={true}
        placeholderTextColor="#555555"
        maxLength={props.maxLength}
        onChangeText={(text) => {
          if (props.setState) {
            props.setState(text);
          }
        }}
        onFocus={props.onFocus}
        ref={internalInputRef}
      ></TextInput>
      {props.error && props.errorMessage && (
        <Text style={{ color: "#ff0022" }}>{props.errorMessage}</Text>
      )}
    </View>
  );
});

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

export default CTextBox;
