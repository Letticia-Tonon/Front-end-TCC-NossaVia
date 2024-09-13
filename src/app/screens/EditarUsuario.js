import React, { useState } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  Pressable,
  Image,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import CDatePicker from "../components/CDatePicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft, faCamera, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { post } from "../utils/api"; // Certifique-se de que o caminho está correto

export default function EditarUsuario() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cep, setCep] = useState("");
  const [nascimento, setNascimento] = useState("");
  const [sexo, setSexo] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [image, setImage] = useState(null); // Estado para armazenar a imagem

  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [senhaInvalida, setSenhaInvalida] = useState(false);
  const [telefoneInvalido, setTelefoneInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [dataInvalida, setDataInvalida] = useState(false);
  const [sexoInvalido, setSexoInvalido] = useState(false);

  const handleSubmit = () => {
    setNomeInvalido(false);
    setEmailInvalido(false);
    setSenhaInvalida(false);
    setTelefoneInvalido(false);
    setCepInvalido(false);
    setDataInvalida(false);
    setSexoInvalido(false);

    let nomeTemp = !nome;
    let emailTemp = !validarEmail(email);
    let senhaTemp = !Object.values(validarSenha(senha)).every((item) => item === true);
    let telefoneTemp = !validarTelefone(telefone);
    let cepTemp = !validarCep(cep);
    let dataTemp = !validarData(nascimento);
    let sexoTemp = !sexo;

    if (nomeTemp || emailTemp || senhaTemp || telefoneTemp || cepTemp || dataTemp || sexoTemp) {
      setNomeInvalido(nomeTemp);
      setEmailInvalido(emailTemp);
      setSenhaInvalida(senhaTemp);
      setTelefoneInvalido(telefoneTemp);
      setCepInvalido(cepTemp);
      setDataInvalida(dataTemp);
      setSexoInvalido(sexoTemp);
      return;
    }

    post("usuario", {
      email: email,
      senha: senha,
      nome: nome,
      endereco: endereco,
      cep: cep,
      numero_endereco: numero,
      complemento_endereco: complemento,
      data_nascimento: `${nascimento.split("/")[2]}/${nascimento.split("/")[1]}/${nascimento.split("/")[0]} 00:00:00.000000`,
      sexo: {
        Feminino: "f",
        Masculino: "m",
        "Prefiro não informar": "n",
      }[sexo],
      telefone: telefone,
      foto: image ? image.base64 : null, // Adicionando a imagem ao POST
    })
      .then((data) => {
        if (data.status !== 201) {
          Alert.alert("Erro", "Erro ao criar conta");
          return;
        }
        Alert.alert("Sucesso", "Usuário criado com sucesso");
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
        <View style={styles.container}>
        {/* não ta funcionando */}
          <Pressable style={styles.seta} onPress={() => router.back()}> 
            <FontAwesomeIcon icon={faArrowLeft} size={32} />
          </Pressable>

          <Text style={styles.title}>Editar Informações</Text>

          <Pressable style={styles.adicionarImagem} onPress={pickImage}>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={{ uri: `data:image/jpeg;base64,${image.base64}` }} style={styles.image} />
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
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'center',
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
    alignItems: 'center',
    justifyContent: 'center',
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
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
  },
  icon: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 5,
  },
  imageTextContainer: {
    alignItems: 'center',
  },
  imageText: {
    fontSize: 16,
    color: "#666666",
  },
});
