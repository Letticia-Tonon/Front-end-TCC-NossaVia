import React, { useState, useRef } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
    Modal,
    Animated,
    Pressable,
    Alert,
    Image,
    TextInput,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {  faComment } from "@fortawesome/free-regular-svg-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import packageJson from "../../../package.json";
import { observer } from "mobx-react-lite";
import userContext from "../contexts/user";

const { width } = Dimensions.get("window");

const CComentario = observer((props) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const [commentModalVisible, setCommentModalVisible] = useState(false);
    const [comment, setComment] = useState("");
    const slideAnim = useRef(new Animated.Value(width)).current;

    const abrirMenu = () => {
        if (menuVisible) {
            Animated.timing(slideAnim, {
                toValue: width,
                duration: 150,
                useNativeDriver: true,
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 150,
                useNativeDriver: true,
            }).start();
        }
    };


    return (
        <View>
            <Pressable
                style={styles.icon}
                onPress={() => setCommentModalVisible(true)}
            >
                <FontAwesomeIcon size={30} icon={faComment} />
            </Pressable>

            <Modal
                animationType="slide"
                transparent={true}
                visible={commentModalVisible}
                onRequestClose={() => setCommentModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Adicionar Comentário</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="Digite seu comentário"
                            value={comment}
                            onChangeText={setComment}
                        />
                        <TouchableOpacity
                            style={styles.button}
                            onPress={() => {
                                setCommentModalVisible(false);
                            }}
                        >
                            <Text style={styles.buttonText}>Enviar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </View>
    );
});

const styles = StyleSheet.create({
    icon: {
        padding: 10,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    textInput: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: "#FF7C33",
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default CComentario;
