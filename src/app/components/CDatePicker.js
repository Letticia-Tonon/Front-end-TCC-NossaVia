import { StyleSheet, Text, Pressable, View } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCalendar } from "@fortawesome/free-solid-svg-icons/faCalendar";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";

const INPUT_HEIGHT = 50;

export default function CDatePicker(props) {
  const onChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      return;
    }
    const date = selectedDate;
    const yyyy = date.getFullYear();
    let mm = date.getMonth() + 1;
    let dd = date.getDate();

    if (dd < 10) dd = "0" + dd;
    if (mm < 10) mm = "0" + mm;

    const formatted = dd + "/" + mm + "/" + yyyy;
    props.setState(formatted);
  };

  const onPress = () => {
    DateTimePickerAndroid.open({
      value: new Date(),
      onChange,
      mode: "date",
    });
  };
  return (
    <View style={{ width: "100%", margin: 8 }}>
      <Pressable
        style={
          props.error
            ? { ...styles.button, borderColor: "#ff0022" }
            : styles.button
        }
        onPress={onPress}
      >
        <Text style={styles.text}>
          {props.state ? props.state : props.placeholder}
        </Text>
        <View style={styles.icon}>
          <FontAwesomeIcon
            icon={faCalendar}
            size={INPUT_HEIGHT - 25}
            color={props.error ? "#ff0022" : "#FF7C33"}
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
    borderRadius: 8,
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
