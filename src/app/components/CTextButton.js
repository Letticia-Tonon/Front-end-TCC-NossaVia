import React, { useState } from "react";
import { StyleSheet, Pressable, Text, ActivityIndicator } from "react-native";

export default function CTextButton(props) {
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    if (loading) return;
    setLoading(true);
    props.callback().finally(() => {
      setLoading(false);
    });
  };

  return (
    <Pressable
      style={
        props.buttonStyle
          ? {
              ...styles.button,
              ...props.buttonStyle,
              ...(loading && styles.disabledButton),
            }
          : { ...styles.button, ...(loading && styles.disabledButton) }
      }
      onPress={handlePress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator size="small" color="#FFFFFF" /> // Indicador de carregamento
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
    opacity: 0.7, // Estilo de desativado quando em loading
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
