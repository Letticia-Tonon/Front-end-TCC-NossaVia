import { StyleSheet, Pressable, Text } from "react-native";

export default function CTextButton(props) {
  return (
    <Pressable
      style={
        props.buttonStyle
          ? { ...styles.button, ...props.buttonStyle }
          : styles.button
      }
      onPress={props.callback}
    >
      <Text
        style={
          props.textStyle ? { ...styles.text, ...props.textStyle } : styles.text
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
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold"
  },
});
