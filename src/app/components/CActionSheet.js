import { StyleSheet, Text, Pressable, View } from "react-native";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons/faCaretDown";

const INPUT_HEIGHT = 50;

export default function CActionSheet(props) {
  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = props.itens;
    const cancelButtonIndex = -1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        props.setState(props.itens[selectedIndex]);
      }
    );
  };
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{props.state ? props.state : props.placeholder}</Text>
      <View style={styles.icon}>
        <FontAwesomeIcon
          icon={faCaretDown}
          size={INPUT_HEIGHT - 25}
          color="#FF7C33"
        ></FontAwesomeIcon>
      </View>
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
    paddingLeft: 10,
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    margin: 5,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#555555",
    height: INPUT_HEIGHT,
    flexDirection: "row",
  },
  text: {
    fontSize: 18,
    borderColor: "#555555",
    width: "85%",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
});
