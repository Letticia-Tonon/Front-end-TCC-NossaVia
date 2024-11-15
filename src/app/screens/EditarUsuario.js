import React, { useState, useEffect } from "react";
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
import CHeader from "../components/CHeader";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faCamera, faPlus } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import * as ImagePicker from "expo-image-picker";
import { put, del, get } from "../utils/api";
import { validarTelefone, validarCep, validarData } from "../utils/validators";
import { observer } from "mobx-react-lite";
import userContext from "../contexts/user";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { cepMask, phoneMask } from "../utils/masks";
import { router } from "expo-router";

const EditarUsuario = observer(() => {
  const [loading, setLoading] = useState(false);

  const [nome, setNome] = useState(userContext.user.nome);
  const [telefone, setTelefone] = useState(userContext.user.telefone);
  const [cep, setCep] = useState(userContext.user.cep);
  const [nascimento, setNascimento] = useState(
    `${userContext.user.data_nascimento.split("-")[2].split(" ")[0]}/${
      userContext.user.data_nascimento.split("-")[1]
    }/${userContext.user.data_nascimento.split("-")[0]}`
  );
  const [sexo, setSexo] = useState(
    { f: "Feminino", m: "Masculino", n: "Prefiro não informar" }[
      userContext.user.sexo
    ]
  );
  const [endereco, setEndereco] = useState(userContext.user.endereco);
  const [numero, setNumero] = useState(userContext.user.numero_endereco);
  const [complemento, setComplemento] = useState(
    userContext.user.complemento_endereco
  );
  const [bairro, setBairro] = useState(userContext.user.bairro);
  const [cidade, setCidade] = useState(userContext.user.cidade);
  const [estado, setEstado] = useState(userContext.user.estado);
  const [image, setImage] = useState(userContext.user.foto);

  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [telefoneInvalido, setTelefoneInvalido] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [dataInvalida, setDataInvalida] = useState(false);
  const [sexoInvalido, setSexoInvalido] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [bairroInvalido, setBairroInvalido] = useState(false);
  const [cidadeInvalida, setCidadeInvalida] = useState(false);
  const [estadoInvalido, setEstadoInvalido] = useState(false);

  useEffect(() => {
    get("usuario", true).then((data) => {
      data.json().then((json) => {
        if (data.status === 200) {
          userContext.set(json);
        }
      });
    });
  }, []);

  useEffect(() => {
    if (cep.length === 9) {
      get(`localizacao/viacep?cep=${cep}`).then((data) => {
        if (data.status === 200) {
          data.json().then((data) => {
            if (!data || data.erro) return;
            setEndereco(data.logradouro);
            setBairro(data.bairro);
            setCidade(data.localidade);
            setEstado(data.uf);
          });
        }
      });
    }
  }, [cep]);

  const deletar = async () => {
    Alert.alert(
      "Atenção!",
      "Ao confirmar, sua conta será permanentemente excluída.",
      [
        {
          text: "Cancelar",
        },
        {
          text: "OK",
          onPress: async () => {
            if (loading) return;
            setLoading(true);
            try {
              const response = await del("usuario", true);
              if (response.status === 200) {
                Alert.alert("Sucesso", "Conta excluida.");
                AsyncStorage.setItem("token", "");
                router.push("screens/Feed?logado=false");
                userContext.set(null);
              } else if (response.status === 404) {
                Alert.alert("Ops!", "Usuário não encontrado.");
              } else {
                Alert.alert("Ops!", "Ocorreu um erro inesperado.");
              }
            } catch (error) {
              Alert.alert("Ops!", "Ocorreu um erro inesperado.");
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  const handleSubmit = async () => {
    setNomeInvalido(false);
    setTelefoneInvalido(false);
    setCepInvalido(false);
    setDataInvalida(false);
    setSexoInvalido(false);
    setEnderecoInvalido(false);
    setBairroInvalido(false);
    setCidadeInvalida(false);
    setEstadoInvalido(false);
    let nomeTemp = !nome;
    let telefoneTemp = !validarTelefone(telefone);
    let cepTemp = !validarCep(cep);
    let dataTemp = !validarData(nascimento);
    let sexoTemp = !sexo;
    let enderecoTemp = !endereco;
    let bairroTemp = !bairro;
    let cidadeTemp = !cidade;
    let estadoTemp = !estado;

    if (
      nomeTemp ||
      telefoneTemp ||
      cepTemp ||
      dataTemp ||
      sexoTemp ||
      enderecoTemp ||
      bairroTemp ||
      cidadeTemp ||
      estadoTemp
    ) {
      setNomeInvalido(nomeTemp);
      setTelefoneInvalido(telefoneTemp);
      setCepInvalido(cepTemp);
      setDataInvalida(dataTemp);
      setSexoInvalido(sexoTemp);
      setEnderecoInvalido(enderecoTemp);
      setBairroInvalido(bairroTemp);
      setCidadeInvalida(cidadeTemp);
      setEstadoInvalido(estadoTemp);
      return;
    }

    const payload = {
      nome: nome,
      endereco: endereco,
      cep: cep,
      numero_endereco: numero,
      complemento_endereco: complemento,
      data_nascimento: `${nascimento.split("/")[2]}-${
        nascimento.split("/")[1]
      }-${nascimento.split("/")[0]} 00:00:00.000000`,
      sexo: {
        Feminino: "f",
        Masculino: "m",
        "Prefiro não informar": "n",
      }[sexo],
      telefone: telefone,
      bairro: bairro,
      cidade: cidade,
      estado: {
        AC: "AC",
        AL: "AL",
        AP: "AP",
        AM: "AM",
        BA: "BA",
        CE: "CE",
        DF: "DF",
        ES: "ES",
        GO: "GO",
        MA: "MA",
        MT: "MT",
        MS: "MS",
        MG: "MG",
        PA: "PA",
        PB: "PB",
        PR: "PR",
        PE: "PE",
        PI: "PI",
        RR: "RR",
        RO: "RO",
        RJ: "RJ",
        RN: "RN",
        RS: "RS",
        SC: "SC",
        SP: "SP",
        SE: "SE",
        TO: "TO",
      }[estado],
    };
    if (image && image.base64) {
      payload.foto = image.base64;
    }

    if (!image) {
      payload.foto = null;
    }

    await put("usuario", payload, true).then((data) => {
      if (data.status !== 200) {
        Alert.alert(
          "Ops!",
          "Ocorreu um erro inesperado, tente novamente mais tarde."
        );
        return;
      }
      Alert.alert("Sucesso", "Dados alterados com sucesso.");
      data.json().then((data) => {
        userContext.set(data);
      });
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
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader
              titulo={"Dados Pessoais"}
              logado={true}
              showText={true}
              goBack={true}
              showIcon={false}
            />
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
                  <Pressable style={styles.editIcon} onPress={pickImage}>
                    <FontAwesomeIcon
                      icon={faPenToSquare}
                      size={30}
                      color="#FF7C33"
                    />
                  </Pressable>
                  <Pressable style={styles.trashIcon} onPress={removeImage}>
                    <FontAwesomeIcon
                      icon={faTrashCan}
                      size={30}
                      color="#FF7C33"
                    />
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

            <Text style={styles.pontuacao}>Pontuação: {userContext.user.pontuacao}</Text>

            <CTextInput
              placeholder="Nome"
              state={nome}
              setState={setNome}
              error={nomeInvalido}
              errorMessage="Nome não pode ser vazio"
            />

            <CTextInput
              placeholder="CPF"
              state={userContext.user.cpf}
              disabled={true}
            />

            <CDatePicker
              placeholder="Data de nascimento"
              state={nascimento}
              setState={setNascimento}
              error={dataInvalida}
              errorMessage="Data inválida: O usuário precisa ser maior que 16 anos"
            />
            <CActionSheet
              state={sexo}
              setState={setSexo}
              placeholder="Sexo"
              itens={["Feminino", "Masculino", "Prefiro não informar"]}
              error={sexoInvalido}
              errorMessage="Selecione uma opção"
            />

            <CTextInput
              placeholder="email"
              state={userContext.user.email}
              disabled={true}
            />

            <CTextInput
              placeholder="Telefone Ex.: (00) 00000-0000"
              state={telefone}
              setState={setTelefone}
              error={telefoneInvalido}
              errorMessage="Telefone inválido"
              mask={phoneMask}
              keyboardType="numeric"
              maxLength={15}
            />

            <CTextInput
              placeholder="CEP"
              state={cep}
              setState={setCep}
              error={cepInvalido}
              errorMessage="CEP inválido"
              mask={cepMask}
              maxLength={9}
              keyboardType="numeric"
            />

            <CTextInput
              placeholder="Endereço"
              state={endereco}
              setState={setEndereco}
              error={enderecoInvalido}
              errorMessage="Campo obrigatório"
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

            <CTextInput
              placeholder="Bairro"
              state={bairro}
              setState={setBairro}
              error={bairroInvalido}
              errorMessage="Bairro não pode ser vazio"
            ></CTextInput>

            <CTextInput
              placeholder="Cidade"
              state={cidade}
              setState={setCidade}
              error={cidadeInvalida}
              errorMessage="Cidade não pode ser vazio"
            ></CTextInput>

            <CActionSheet
              state={estado}
              setState={setEstado}
              placeholder="Estado"
              itens={[
                "AC",
                "AL",
                "AP",
                "AM",
                "BA",
                "CE",
                "DF",
                "ES",
                "GO",
                "MA",
                "MT",
                "MS",
                "MG",
                "PA",
                "PB",
                "PR",
                "PE",
                "PI",
                "RR",
                "RO",
                "RJ",
                "RN",
                "RS",
                "SC",
                "SP",
                "SE",
                "TO",
              ]}
              error={estadoInvalido}
              errorMessage="Selecione uma opção"
            />

            <CTextButton
              buttonStyle={{ backgroundColor: "#FF7C33" }}
              textStyle={{ color: "#FFFFFF" }}
              text="Salvar alterações"
              loading={loading}
              callback={() => {
                if (loading) return;
                setLoading(true);
                handleSubmit().finally(() => setLoading(false));
              }}
            />

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
                borderWidth: 2,
                borderColor: "#FFFFFF",
              }}
              textStyle={{ color: "#FFFFFF" }}
              text="Altera Senha"
              loading={loading}
              callback={() => {
                router.push("screens/EditarSenha");
              }}
            />

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FFFFFF",
                borderWidth: 2,
                borderColor: "#ff0022",
              }}
              textStyle={{ color: "#ff0022" }}
              text="Excluir conta"
              loading={loading}
              callback={deletar}
            />
          </View>
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
    width: "90%",
    paddingBottom: 5,
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
    marginTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
  },
  trashIcon: {
    position: "absolute",
    bottom: 50,
    right: -50,
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 5,
  },
  editIcon: {
    position: "absolute",
    top: 50,
    right: -50,
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
  pontuacao: {
    fontSize: 18,
    marginBottom: 10,
  }
});

export default EditarUsuario;
