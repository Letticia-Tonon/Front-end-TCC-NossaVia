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
    <View style={{ width: "100%", margin: 8 }}>
    <Pressable
      style={
        props.error ? { ...styles.button, borderColor: "#ff0022" } : styles.button
      }
      onPress={onPress}
    >
      <Text style={styles.text}>
        {props.state ? props.state : props.placeholder}
      </Text>
      <View style={styles.icon}>
        <FontAwesomeIcon
          icon={faCaretDown}
          size={INPUT_HEIGHT - 25}
          color="#FF7C33"
        ></FontAwesomeIcon>
      </View>
    </Pressable>
    {props.error && props.errorMessage && (
        <Text style={{ color: "#ff0022" }}>{props.errorMessage}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    width: "100%",
    paddingLeft: 10,
    outlineStyle: "none",
    shadowColor: "#000",
    shadowOffset: { width: -1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    color: "#555555",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "15%",
  },
});
