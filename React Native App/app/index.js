import React, { useEffect, useState } from "react";
import { Text, View, ActivityIndicator, Image, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Index() {
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
      navigation.navigate("Connect");
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Gasless Transactions</Text>
      <Text style={styles.description}>
        Your gateway to a Send tokens without paying for gas.
      </Text>
      <ActivityIndicator size="large" color="#999" />
      <Image
        source={require("../assets/images/blockchain.png")}
        style={styles.heroImage}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    padding: 20,
  },
  heading: {
    fontSize: 32,
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
  },
  description: {
    fontSize: 18,
    color: "#bbb",
    marginBottom: 60,
    textAlign: "center",
  },
  heroImage: {
    width: 360,
    height: 300,
    resizeMode: "cover",
    marginTop: 60,
  },
});
