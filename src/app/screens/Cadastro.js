import { StyleSheet, View, ScrollView, Text, Alert } from "react-native";
import CTextInput from "../components/CTextInput";
import CPassInput from "../components/CPassInput";
import CTextButton from "../components/CTextButton";
import CActionSheet from "../components/CActionSheet";
import { Link } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { useState } from "react";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";

// Função para validar e-mail
const validateEmail = (email) => {
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

// Função para validar as senhas
const validatePasswords = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Função para validar o telefone (  deve ter 8 ou 9 dígitos)
const validatePhone = (phone) => {
  const re = /^\d{8,9}$/;
  return re.test(phone);
};

// Função para validar o CEP (  deve ter 8 dígitos)
const validateCEP = (cep) => {
  const re = /^\d{8}$/;
  return re.test(cep);
};

// Função para validar a data de nascimento (  deve estar no formato DD/MM/AAAA)
const validateDate = (date) => {
  const re = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  return re.test(date);
};

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [cep, setCep] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = () => {
    try {
      if (!validateEmail(email)) {
        throw new Error("E-mail inválido");
      }

      if (!validatePasswords(password, confirmPassword)) {
        throw new Error("As senhas não coincidem");
      }

      if (!validatePhone(phone)) {
        throw new Error("Telefone inválido. Deve conter 8 ou 9 dígitos");
      }

      if (!validateCEP(cep)) {
        throw new Error("CEP inválido. Deve conter 8 dígitos");
      }

      if (!validateDate(birthDate)) {
        throw new Error(
          "Data de nascimento inválida. Use o formato DD/MM/AAAA"
        );
      }

      if (!gender) {
        throw new Error("Selecione um sexo");
      }

      // Se todas as validações passarem, o usuário é cadastrado
      Alert.alert("Sucesso", "Conta criada com sucesso!");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

  return (
    <ActionSheetProvider>
      <ScrollView>
        <View style={{ ...styles.container, width: "100%" }}>
          <View style={styles.container}>
            <Link style={styles.seta} href={"/screens/Login"}>
              <FontAwesomeIcon icon={faArrowLeft} size={32}></FontAwesomeIcon>
            </Link>

            <Text
              style={{
                fontSize: 28,
                fontWeight: "bold",
                marginBottom: 30,
                marginTop: 20,
              }}
            >
              {" "}
              Cadastre-se
            </Text>

            <CTextInput placeholder="Nome"></CTextInput>

            <CTextInput
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
            />

            <CPassInput
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
            />

            <CPassInput
              placeholder="Confirme sua senha"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <CTextInput
              placeholder="Telefone"
              value={phone}
              onChangeText={setPhone}
            />

            <CActionSheet
              state={gender}
              setState={setGender}
              placeholder="Sexo"
              itens={["Feminino", "Masculino", "Prefiro não informar"]}
            />

            <CTextInput
              placeholder="Data de nascimento"
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <CTextInput placeholder="CEP" value={cep} onChangeText={setCep} />

            <CTextInput placeholder="Endereço"></CTextInput>

            <CTextInput placeholder="Número"></CTextInput>

            <CTextInput placeholder="Complemento"></CTextInput>

            <CTextButton
              buttonStyle={{
                backgroundColor: "#FF7C33",
              }}
              textStyle={{
                color: "#FFFFFF",
              }}
              text="Criar conta"
              onPress={handleSubmit} // Chama a função handleSubmit ao pressionar o botão
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
    paddingTop: 20,
    paddingBottom: 10,
  },
  seta: {
    position: "absolute",
    top: -10,
    left: 1,
  },
});
