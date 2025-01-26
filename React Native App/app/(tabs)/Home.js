import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

const Home = () => {
  const [tokenType, setTokenType] = useState("ERC20");
  const [contractAddress, setContractAddress] = useState("");
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState("5.243 ETH");

  const handleSubmit = () => {
    if (!contractAddress || !recipient || !amount) {
      Alert.alert("Error", "All fields are required.");
      return;
    }
    Alert.alert(
      "Transaction Submitted",
      "Your transaction is being processed."
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Wallet</Text>

      {/* Wallet Balance */}
      <View style={styles.walletContainer}>
        <Text style={styles.walletText}>Balance: {walletBalance}</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Token Type Selection */}
        <View style={styles.tokenTypeContainer}>
          <TouchableOpacity
            style={[
              styles.tokenButton,
              tokenType === "ERC20" && styles.activeButton,
            ]}
            onPress={() => setTokenType("ERC20")}
          >
            <Text style={styles.buttonText}>ERC-20</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tokenButton,
              tokenType === "ERC721" && styles.activeButton,
            ]}
            onPress={() => setTokenType("ERC721")}
          >
            <Text style={styles.buttonText}>ERC-721</Text>
          </TouchableOpacity>
        </View>

        {/* Input Fields */}
        <View>
          <Text style={styles.label}>Contract Address</Text>
          <TextInput
            style={styles.input}
            placeholder="0x..."
            placeholderTextColor="#aaa"
            value={contractAddress}
            onChangeText={setContractAddress}
          />

          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="0x..."
            placeholderTextColor="#aaa"
            value={recipient}
            onChangeText={setRecipient}
          />

          <Text style={styles.label}>
            {tokenType === "ERC20" ? "Amount" : "Token ID"}
          </Text>
          <TextInput
            style={styles.input}
            placeholder={
              tokenType === "ERC20" ? "Enter Amount" : "Enter Token ID"
            }
            placeholderTextColor="#aaa"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1f1f1f",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Roboto, sans-serif",
  },
  walletContainer: {
    alignSelf: "center",
    width: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 25,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  walletText: {
    fontSize: 20,
    color: "#ffffff",
    textAlign: "center",
    fontWeight: "500",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
  },
  tokenTypeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
  },
  tokenButton: {
    paddingVertical: 16,
    paddingHorizontal: 30,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 30,
    marginHorizontal: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  activeButton: {
    backgroundColor: "#8e44ad",
    elevation: 4,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    color: "#ccc",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 50,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
  },
  submitButton: {
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#8e44ad",
    paddingVertical: 16,
    borderRadius: 50,
    marginTop: 10,
    shadowColor: "#8e44ad",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default Home;
