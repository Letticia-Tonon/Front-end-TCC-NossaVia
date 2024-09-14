import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  Pressable,
  Image,
  StatusBar,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import CDatePicker from "../components/CDatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faCamera,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { put } from "../utils/api";
import { router } from "expo-router";
import { validarTelefone, validarCep, validarData } from "../utils/validators";
import { observer } from "mobx-react-lite";
import userContext from "../utils/context";

const EditarUsuario = observer(() => {
  const [nome, setNome] = useState(userContext.user.nome);
  const [telefone, setTelefone] = useState(userContext.user.telefone);
  const [cep, setCep] = useState(userContext.user.cep);
  const [nascimento, setNascimento] = useState(
    `${userContext.user.data_nascimento.split("-")[2].split(" ")[0]}/${
      userContext.user.data_nascimento.split("-")[1]
    }/${userContext.user.data_nascimento.split("-")[0]}`
  );
  const [sexo, setSexo] = useState(
    { f: "Feminino", m: "Masculino", n: "Prefiro não informar" }[userContext.user.sexo]
  );
  const [endereco, setEndereco] = useState(userContext.user.endereco);
  const [numero, setNumero] = useState(userContext.user.numero_endereco);
  const [complemento, setComplemento] = useState(userContext.user.complemento_endereco);
  const [image, setImage] = useState(userContext.user.foto);

  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [telefoneInvalido, setTelefoneInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [dataInvalida, setDataInvalida] = useState(false);
  const [sexoInvalido, setSexoInvalido] = useState(false);

  const handleSubmit = () => {
    setNomeInvalido(false);
    setTelefoneInvalido(false);
    setCepInvalido(false);
    setDataInvalida(false);
    setSexoInvalido(false);

    let nomeTemp = !nome;
    let telefoneTemp = !validarTelefone(telefone);
    let cepTemp = !validarCep(cep);
    let dataTemp = !validarData(nascimento);
    let sexoTemp = !sexo;

    if (nomeTemp || telefoneTemp || cepTemp || dataTemp || sexoTemp) {
      setNomeInvalido(nomeTemp);
      setTelefoneInvalido(telefoneTemp);
      setCepInvalido(cepTemp);
      setDataInvalida(dataTemp);
      setSexoInvalido(sexoTemp);
      return;
    }

    const payload = {
      nome: nome,
      endereco: endereco,
      cep: cep,
      numero_endereco: numero,
      complemento_endereco: complemento,
      data_nascimento: `${nascimento.split("/")[2]}/${
        nascimento.split("/")[1]
      }/${nascimento.split("/")[0]} 00:00:00.000000`,
      sexo: {
        Feminino: "f",
        Masculino: "m",
        "Prefiro não informar": "n",
      }[sexo],
      telefone: telefone,
    };

    if (image && image.base64) {
      payload.foto = image.base64;
    }

    if (!image) {
      payload.foto = null;
    }

    put("usuario", payload, true)
      .then((data) => {
        if (data.status !== 200) {
          Alert.alert(
            "Ops!",
            "Ocorreu um erro inesperado, tente novamente mais tarde."
          );
          return data.json();
        }
        Alert.alert("Sucesso", "Usuário alterado com sucesso.");
        return data.json();
      })
      .then((data) => {
        if (!data) return;
        console.log(data);
      });
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  return (
    <ActionSheetProvider>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={styles.container}>
          <Pressable style={styles.seta} onPress={() => router.back()}>
            <FontAwesomeIcon icon={faArrowLeft} size={32} />
          </Pressable>

          <Text style={styles.title}>Editar Perfil</Text>

          <Pressable style={styles.adicionarImagem} onPress={pickImage}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image
                  source={
                    image && image.base64
                      ? { uri: `data:image/jpeg;base64,${image.base64}` }
                      : { uri: image }
                  }
                  style={styles.image}
                />
                <Pressable style={styles.icon} onPress={removeImage}>
                  <FontAwesomeIcon icon={faTrash} size={30} color="#FF7C33" />
                </Pressable>
              </View>
            ) : (
              <View style={styles.imageContainer}>
                <FontAwesomeIcon icon={faCamera} size={80} color="#666666" />
                <View style={styles.imageTextContainer}>
                  <Text style={styles.imageText}>Adicionar Foto</Text>
                  <FontAwesomeIcon icon={faPlus} size={25} color="#666666" />
                </View>
              </View>
            )}
          </Pressable>

          <CTextInput
            placeholder="Nome"
            state={nome}
            setState={setNome}
            error={nomeInvalido}
            errorMessage="Nome não pode ser vazio"
          />

          <CTextInput
            placeholder="email"
            state={userContext.user.email}
            disabled={true}
          />

          <CTextInput
            placeholder="Telefone Ex.: 00 00000-0000"
            state={telefone}
            setState={setTelefone}
            error={telefoneInvalido}
            errorMessage="Telefone inválido"
          />

          <CActionSheet
            state={sexo}
            setState={setSexo}
            placeholder="Sexo"
            itens={["Feminino", "Masculino", "Prefiro não informar"]}
            error={sexoInvalido}
            errorMessage="Selecione uma opção"
          />

          <CDatePicker
            placeholder="Data de nascimento"
            state={nascimento}
            setState={setNascimento}
            error={dataInvalida}
            errorMessage="Data inválida"
          />

          <CTextInput
            placeholder="CEP"
            state={cep}
            setState={setCep}
            error={cepInvalido}
            errorMessage="CEP inválido"
          />

          <CTextInput
            placeholder="Endereço"
            state={endereco}
            setState={setEndereco}
          />

          <CTextInput
            placeholder="Número"
            state={numero}
            setState={setNumero}
          />

          <CTextInput
            placeholder="Complemento"
            state={complemento}
            setState={setComplemento}
          />

          <CTextButton
            buttonStyle={{ backgroundColor: "#FF7C33" }}
            textStyle={{ color: "#FFFFFF" }}
            text="Salvar"
            callback={handleSubmit}
          />
        </View>
      </ScrollView>
    </ActionSheetProvider>
  );
});

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 20,
  },
  seta: {
    position: "absolute",
    top: 20,
    left: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    marginTop: 20,
  },
  adicionarImagem: {
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  imageContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  icon: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
  },
  imageTextContainer: {
    alignItems: "center",
  },
  imageText: {
    fontSize: 16,
    color: "#666666",
  },
});

export default EditarUsuario;