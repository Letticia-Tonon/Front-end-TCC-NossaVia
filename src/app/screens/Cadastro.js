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
import { useState, useEffect } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import CDatePicker from "../components/CDatePicker";
import CHeader from "../components/CHeader";
import {
  validarEmail,
  validarSenha,
  validarTelefone,
  validarCep,
  validarData,
  validarCpf,
} from "../utils/validators";
import { post, get } from "../utils/api";
import { cepMask, phoneMask, cpfMask } from "../utils/masks";

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
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [cpf, setCpf] = useState("");

  const [nomeInvalido, setNomeInvalido] = useState(false);
  const [emailInvalido, setEmailInvalido] = useState(false);
  const [senhaInvalida, setsenhaInvalida] = useState(false);
  const [cepInvalido, setCepInvalido] = useState(false);
  const [dataInvalida, setDataInvalida] = useState(false);
  const [sexoInvalido, setSexoInvalido] = useState(false);
  const [telefoneInvalido, setTelefoneInvalido] = useState(false);
  const [enderecoInvalido, setEnderecoInvalido] = useState(false);
  const [confirmarSenhaInvalida, setConfirmarSenhaInvalida] = useState(false);
  const [bairroInvalido, setBairroInvalido] = useState(false);
  const [cidadeInvalido, setCidadeInvalido] = useState(false);
  const [estadoInvalido, setEstadoInvalido] = useState(false);
  const [cpfInvalido, setCpfInvalido] = useState(false);

  const [cpfMessage, setCpfMessage] = useState("CPF não pode ser vazio");

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
    setBairroInvalido(false);
    setCidadeInvalido(false);
    setEstadoInvalido(false);
    setCpfInvalido(false);

    let nomeTemp = false;
    let emailTemp = false;
    let senhaTemp = false;
    let cepTemp = false;
    let dataTemp = false;
    let sexoTemp = false;
    let telefoneTemp = false;
    let enderecoTemp = false;
    let confirmarSenhaTemp = false;
    let bairroTemp = false;
    let cidadeTemp = false;
    let estadoTemp = false;
    let cpfTemp = false;

    if (!nome) {
      nomeTemp = true;
      setNomeInvalido(true);
    }

    if (!validarCpf(cpf)) {
      if (!cpf) setCpfMessage("CPF não pode ser vazio");
      else setCpfMessage("CPF inválido");
      cpfTemp = true;
      setCpfInvalido(true);
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

    if (!bairro) {
      bairroTemp = true;
      setBairroInvalido(true);
    }

    if (!cidade) {
      cidadeTemp = true;
      setCidadeInvalido(true);
    }

    if (!estado) {
      estadoTemp = true;
      setEstadoInvalido(true);
    }

    if (!cpf) {
      cpfTemp = true;
      setCpfInvalido(true);
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
      confirmarSenhaTemp ||
      bairroTemp ||
      cidadeTemp ||
      estadoTemp ||
      cpfTemp
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
      cpf: cpf,
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
              placeholder="CPF"
              state={cpf}
              setState={setCpf}
              error={cpfInvalido}
              keyboardType="numeric"
              mask={cpfMask}
              errorMessage={cpfMessage}
              maxLength={14}
            ></CTextInput>

            <CDatePicker
              placeholder="Data de nascimento"
              state={nascimento}
              setState={setNascimento}
              error={dataInvalida}
              errorMessage="Data inválida: O usuário precisa ser maior que 16 anos"
            ></CDatePicker>

            <CActionSheet
              state={sexo}
              setState={setSexo}
              placeholder="Sexo"
              itens={["Feminino", "Masculino", "Prefiro não informar"]}
              error={sexoInvalido}
              errorMessage="Selecione uma opção"
            />

            <CTextInput
              placeholder="E-mail"
              state={email}
              setState={setEmail}
              error={emailInvalido}
              errorMessage="E-mail inválido"
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
              error={cidadeInvalido}
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
