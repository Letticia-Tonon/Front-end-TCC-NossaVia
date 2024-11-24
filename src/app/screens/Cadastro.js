import { router } from "expo-router";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Alert,
  StatusBar,
  Pressable,
  Modal,
  Dimensions
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
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faXmarkCircle } from "@fortawesome/free-regular-svg-icons";

const { height } = Dimensions.get("window");

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
  const [termoDeUso, setTermoDeUso] = useState(false);

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
  const [mensagemTermoDeUso, setMensagemTermoDeUso] = useState(false);

  const [cpfMessage, setCpfMessage] = useState("CPF não pode ser vazio");
  const [menuVisible, setMenuVisible] = useState(false);

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
    setMensagemTermoDeUso(!termoDeUso);

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
      cpfTemp ||
      !termoDeUso
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

            <View
              style={{
                width: "100%",
                marginTop: 8,
                marginBottom: mensagemTermoDeUso ? 4 : 8,
                flexDirection: "row",
              }}
            >
              <Pressable
                style={{
                  height: 24,
                  width: 24,
                  borderBlockColor: "#000",
                  borderWidth: 2,
                  borderRadius: 13,
                  borderColor: termoDeUso ? "#FF7C33" : "#888",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onPress={() => {
                  setTermoDeUso(!termoDeUso);
                }}
              >
                {termoDeUso && (
                  <View
                    style={{
                      height: 15,
                      width: 15,
                      borderRadius: 8,
                      backgroundColor: "#FF7C33",
                    }}
                  ></View>
                )}
              </Pressable>
              <Text
                style={{
                  marginLeft: 8,
                  fontSize: 15,
                  color: "#888",
                }}
              >
                Li e concordo com os{" "}
                <Text
                  style={{ color: "#888", fontWeight: "bold" }}
                  onPress={() => {
                    setMenuVisible(true);
                  }}
                >
                  Termos de Uso
                </Text>
              </Text>
            </View>
            {mensagemTermoDeUso && (
              <View style={{ width: "100%", marginBottom: 8 }}>
                <Text style={{ color: "#ff0022", textAlign: "left" }}>
                  Para criar uma conta é necessário concordar com os termos de
                  uso
                </Text>
              </View>
            )}

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
          <Modal
            animationType="none"
            transparent={true}
            visible={menuVisible}
            onRequestClose={() => {
              setMenuVisible(false);
            }}
          >
            <Pressable
              style={{
                flex: 1,
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                justifyContent: "flex-start",
                padding: 22,
                height: height
              }}
              onPress={() => {
                setMenuVisible(false);
              }}
            >
              <View style={{ height: "100%" }}>
                <ScrollView borderRadius={15}>
                  <View backgroundColor="#fff" paddingBottom={10}>
                    <Pressable>
                      <Pressable
                        style={{ alignItems: "flex-end" }}
                        onPress={() => {
                          setMenuVisible(false);
                        }}
                      >
                        <FontAwesomeIcon
                          icon={faXmarkCircle}
                          size={30}
                          color="#666666"
                          style={{ margin: 12 }}
                        ></FontAwesomeIcon>
                      </Pressable>
                      <Text
                        style={{
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: 17,
                        }}
                      >
                        Termos de Uso do Aplicativo Nossa Via
                      </Text>
                      <Text
                        style={{ paddingHorizontal: 22, textAlign: "justify" }}
                      >
                        {"\n"}
                        Última atualização: 16/11/2024
                        {"\n\n"}
                        1. Aceitação dos Termos
                        {"\n\n"}
                        Ao acessar e usar o aplicativo Nossa Via, você concorda
                        em cumprir e estar sujeito a estes Termos de Uso. Se não
                        concordar com alguma parte destes termos, você não deve
                        utilizar o aplicativo.
                        {"\n\n"}
                        2. Descrição do Serviço
                        {"\n\n"}O Nossa Via é um aplicativo que permite aos
                        usuários registrar e relatar problemas encontrados em
                        vias públicas, utilizando fotos e descrições. O objetivo
                        é promover a melhoria das condições das vias urbanas e
                        facilitar a comunicação com as autoridades competentes.
                        {"\n\n"}
                        3. Requisitos de Idade
                        {"\n\n"}O uso do aplicativo é restrito a usuários com 16
                        anos ou mais. Ao se cadastrar, o usuário declara ter a
                        idade mínima necessária.
                        {"\n\n"}
                        4. Cadastro e Responsabilidades do Usuário
                        {"\n\n"}
                        4.1 Para utilizar o aplicativo, é necessário realizar um
                        cadastro, fornecendo informações precisas e atualizadas.
                        O usuário é responsável pela veracidade dos dados
                        fornecidos.
                        {"\n\n"}
                        4.2 O usuário deve manter a confidencialidade de suas
                        credenciais de acesso e é responsável por qualquer
                        atividade que ocorra em sua conta.
                        {"\n\n"}
                        5. Uso do Aplicativo
                        {"\n\n"}
                        5.1 O usuário concorda em utilizar o aplicativo de
                        maneira responsável e em conformidade com a legislação
                        vigente.
                        {"\n\n"}
                        5.2 É proibido:
                        {"\n\n"}
                        Postar conteúdo que seja ofensivo, difamatório,
                        discriminatório ou inadequado. Postar imagens de pessoas
                        sem o seu consentimento. Compartilhar informações falsas
                        ou enganosas sobre os problemas reportados.
                        {"\n\n"}
                        6. Garantia de Veracidade das Denúncias
                        {"\n\n"}
                        Os usuários são responsáveis pela veracidade das
                        informações e imagens enviadas através do aplicativo. O
                        Nossa Via se reserva o direito de investigar e, se
                        necessário, remover conteúdos que não cumpram estas
                        diretrizes.
                        {"\n\n"}
                        7. Propriedade Intelectual
                        {"\n\n"}
                        Todo o conteúdo e funcionalidades do aplicativo,
                        incluindo, mas não se limitando a, textos, imagens,
                        logotipos e design, são de propriedade do Nossa Via ou
                        de seus licenciadores. O uso não autorizado pode
                        resultar em ações legais.
                        {"\n\n"}
                        8. Modificação e Rescisão dos Termos
                        {"\n\n"}O Nossa Via reserva-se o direito de modificar
                        estes Termos de Uso a qualquer momento. As alterações
                        serão publicadas no aplicativo e entrarão em vigor
                        imediatamente após a publicação. O uso contínuo do
                        aplicativo após as alterações implica aceitação dos
                        novos termos.
                        {"\n\n"}
                        9. Isenção de Responsabilidade
                        {"\n\n"}O Nossa Via não se responsabiliza por danos
                        diretos, indiretos, incidentais ou consequentes
                        resultantes do uso ou da incapacidade de uso do
                        aplicativo. Os usuários são incentivados a verificar a
                        precisão das informações relatadas.
                        {"\n\n"}
                        10. Legislação Aplicável
                        {"\n\n"}
                        Este Termo de Uso é regido pelas leis da República
                        Federativa do Brasil. Qualquer litígio decorrente destes
                        termos deverá ser resolvido no foro da comarca onde está
                        situada a sede do Nossa Via.
                        {"\n\n"}
                        11. Contato
                        {"\n\n"}
                        Para esclarecimentos sobre estes Termos de Uso, entre em
                        contato conosco através do e-mail:
                        nossavia.tcc@gmail.com
                      </Text>
                      <View style={{ alignItems: "center" }}>
                        <CTextButton
                          buttonStyle={{
                            backgroundColor: "#FF7C33",
                            width: "90%",
                          }}
                          textStyle={{
                            color: "#FFFFFF",
                          }}
                          text="Concordar"
                          callback={() => {
                            setTermoDeUso(true);
                            setMenuVisible(false);
                          }}
                        />
                      </View>
                    </Pressable>
                  </View>
                </ScrollView>
              </View>
            </Pressable>
          </Modal>
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
