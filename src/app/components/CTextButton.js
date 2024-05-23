import { StyleSheet, View, Pressable, Text } from "react-native";

export default function CTextButton(props) {
  return (
    <Pressable
      style={
        props.backgroundColor
          ? { ...styles.button, backgroundColor: props.backgroundColor }
          : styles.button
      }
    >
      <Text
        style={
          props.foreColor
            ? { ...styles.text, color: props.foreColor }
            : styles.text
        }
      >
        {props.text}
      </Text>
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
    backgroundColor: "#FF7C33",
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  text: {
    fontSize: 18,
    color: "#FFFFFF",
  },
});
