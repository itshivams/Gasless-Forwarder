import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/MaterialIcons";

const Connect = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const navigation = useNavigation();

  const handleConnect = () => {
    setIsConnected(true);
    setWalletAddress("0x1234...5678");
    Alert.alert("Wallet Connected", `Address: ${walletAddress}`, [
      {
        text: "OK",
        onPress: () => {
          navigation.navigate("(tabs)");
        },
      },
    ]);
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <SafeAreaView style={styles.container}>
        <View style={styles.topWrapper}>
          <Image
            source={require("../assets/images/wallet.png")}
            style={styles.image}
          />
        </View>

        <View style={styles.bottomWrapper}>
          <Text style={styles.title}>Connect Your Wallet</Text>

          <View style={styles.walletSection}>
            {isConnected ? (
              <View style={styles.walletInfo}>
                <Icon name="account-balance-wallet" size={24} color="#4CAF50" />
                <Text style={styles.walletAddress}>{walletAddress}</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.connectButton}
                onPress={handleConnect}
              >
                <Icon name="link" size={20} color="#fff" />
                <Text style={styles.buttonText}>Connect Wallet</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
    padding: 20,
  },
  topWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    paddingBottom: 40,
  },
  image: {
    width: 320,
    height: 320,
    resizeMode: "contain",
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "600",
    marginBottom: 20,
  },
  walletSection: {
    width: "100%",
    alignItems: "center",
  },
  walletInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletAddress: {
    marginLeft: 10,
    fontSize: 16,
    color: "#4CAF50",
  },
  connectButton: {
    flexDirection: "row",
    width: "60%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blueviolet",
    paddingVertical: 16,
    paddingHorizontal: 30,
    borderRadius: 50,
    marginTop: 20,
  },
  buttonText: {
    marginLeft: 10,
    fontSize: 18,
    color: "#ffffff",
  },
});

export default Connect;
