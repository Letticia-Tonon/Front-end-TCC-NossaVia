import React from "react";
import { StyleSheet, Pressable, Text, ActivityIndicator } from "react-native";

export default function CTextButton(props) {
  return (
    <Pressable
      style={
        props.buttonStyle
          ? {
              ...styles.button,
              ...props.buttonStyle,
              ...(props.loading && styles.disabledButton),
            }
          : { ...styles.button, ...(props.loading && styles.disabledButton) }
      }
      onPress={() => {
        if (props.callback) props.callback();
      }}
      disabled={props.loading}
    >
      {props.loading ? (
        <ActivityIndicator
          size={35}
          color={
            props.textStyle && props.textStyle["color"]
              ? props.textStyle["color"]
              : "#FFF"
          }
        />
      ) : (
        <Text
          style={
            props.textStyle
              ? { ...styles.text, ...props.textStyle }
              : styles.text
          }
        >
          {props.text}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
    width: "100%",
    paddingHorizontal: 10,
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
  disabledButton: {
    opacity: 0.7,
  },
  text: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
