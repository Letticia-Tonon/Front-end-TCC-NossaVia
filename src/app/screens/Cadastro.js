import { router } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  StatusBar,
} from "react-native";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import { useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import CDatePicker from "../components/CDatePicker";
import CHeader from "../components/CHeader";
import {
  validarEmail,
  validarSenha,
  validarTelefone,
  validarCep,
  validarData,
} from "../utils/validators";
import { post } from "../utils/api";
import { cepMask, phoneMask } from "../utils/masks";

export default function Cadastro() {
  const [loading, setLoading] = useState(false);

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

  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [senhaInvalida, setsenhaInvalida] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [dataInvalida, setDataInvalida] = useState(false);
  const [sexoInvalido, setSexoInvalido] = useState(false);
  const [telefoneInvalido, setTelefoneInvalido] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [confirmarSenhaInvalida, setConfirmarSenhaInvalida] = useState(false);

  const handleSubmit = async () => {
    setNomeInvalido(false);
    setEmailInvalido(false);
    setsenhaInvalida(false);
    setCepInvalido(false);
    setDataInvalida(false);
    setSexoInvalido(false);
    setTelefoneInvalido(false);
    setEnderecoInvalido(false);
    setConfirmarSenhaInvalida(false);
    let nomeTemp = false;
    let emailTemp = false;
    let senhaTemp = false;
    let cepTemp = false;
    let dataTemp = false;
    let sexoTemp = false;
    let telefoneTemp = false;
    let enderecoTemp = false;
    let confirmarSenhaTemp = false;

    if (!nome) {
      nomeTemp = true;
      setNomeInvalido(true);
    }

    if (!validarEmail(email)) {
      emailTemp = true;
      setEmailInvalido(true);
    }

    if (!Object.values(validarSenha(senha)).every((item) => item === true)) {
      senhaTemp = true;
      setsenhaInvalida(true);
    }

    if (!validarTelefone(telefone)) {
      telefoneTemp = true;
      setTelefoneInvalido(true);
    }

    if (!validarCep(cep)) {
      cepTemp = true;
      setCepInvalido(true);
    }

    if (!validarData(nascimento)) {
      dataTemp = true;
      setDataInvalida(true);
    }

    if (!sexo) {
      sexoTemp = true;
      setSexoInvalido(true);
    }

    if (!endereco) {
      enderecoTemp = true;
      setEnderecoInvalido(true);
    }

    if (senha !== confirmarSenha) {
      confirmarSenhaTemp = true;
      setConfirmarSenhaInvalida(true);
    }

    if (
      nomeTemp ||
      emailTemp ||
      senhaTemp ||
      cepTemp ||
      dataTemp ||
      sexoTemp ||
      telefoneTemp ||
      enderecoTemp ||
      confirmarSenhaTemp
    ) {
      return;
    }

    await post("usuario", {
      email: email,
      senha: senha,
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
    })
      .then((data) => {
        if (data.status !== 201) {
          Alert.alert("Ops!", "Ocorreu um erro inesperado ao criar sua conta.");
          return;
        }
        Alert.alert("Sucesso", "Conta criada com sucesso.");
        return data.json();
      })
      .then((data) => {
        if (!data) return;
        router.push("screens/Login");
      });
  };

  return (
    <ActionSheetProvider>
      <ScrollView>
        <StatusBar backgroundColor="#FF7C33" barStyle="light-content" />
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <CHeader
              titulo={"Cadastre-se"}
              logado={false}
              showText={true}
              goBack={true}
              showIcon={false}
            ></CHeader>

            <CTextInput
              placeholder="Nome"
              inputStyle={{ marginTop: 8 }}
              state={nome}
              setState={setNome}
              error={nomeInvalido}
              errorMessage="Nome não pode ser vazio"
            ></CTextInput>

            <CTextInput
              placeholder="E-mail"
              state={email}
              setState={setEmail}
              error={emailInvalido}
              errorMessage="E-mail inválido"
            />

            <CPassInput
              placeholder="Senha"
              state={senha}
              setState={setSenha}
              error={senhaInvalida}
              errorMessage="Senha inválida"
            />

            {senhaInvalida && (
              <Text style={{ color: "#ff0022" }}>
                A senha deve conter no mínimo 8 caracteres, uma letra maiúscula,
                uma letra minúscula, um número e um caractere especial
              </Text>
            )}

            <CPassInput
              placeholder="Confirme sua senha"
              state={confirmarSenha}
              setState={setConfirmarSenha}
              error={senha !== confirmarSenha || confirmarSenhaInvalida}
              errorMessage="As senhas devem ser iguais"
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
            ></CDatePicker>

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
            ></CTextInput>

            <CTextInput
              placeholder="Número"
              state={numero}
              setState={setNumero}
            ></CTextInput>

            <CTextInput
              placeholder="Complemento"
              state={complemento}
              setState={setComplemento}
            ></CTextInput>

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Criar conta"
              loading={loading}
              callback={() => {
                if (loading) return;
                setLoading(true);
                handleSubmit().finally(() => setLoading(false));
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ActionSheetProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
    paddingBottom: 5,
  },
});
