import { View, Text, StyleSheet, FlatList } from "react-native";

export default function History() {
  // Sample transaction data
  const transactions = [
    {
      id: "1",
      description: "Paid to John",
      amount: "-$50",
      date: "2025-01-24",
    },
    {
      id: "2",
      description: "Received from Alice",
      amount: "+$75",
      date: "2025-01-23",
    },
    {
      id: "3",
      description: "Bought groceries",
      amount: "-$30",
      date: "2025-01-22",
    },
    { id: "4", description: "Sold bike", amount: "+$200", date: "2025-01-20" },
  ];

  const renderTransaction = ({ item }) => {
    return (
      <View style={styles.transaction}>
        <Text style={styles.description}>{item.description}</Text>
        <View style={styles.details}>
          <Text
            style={[
              styles.amount,
              item.amount.startsWith("-")
                ? styles.redAmount
                : styles.greenAmount,
            ]}
          >
            {item.amount}
          </Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Transaction History</Text>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={renderTransaction}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#1f1f1f",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
    color: "#ffffff",
    letterSpacing: 1.5,
  },
  list: {
    flexGrow: 1,
  },
  transaction: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: "#000",
  },
  description: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  redAmount: {
    color: "#e74c3c",
  },
  greenAmount: {
    color: "#2ecc71",
  },
  date: {
    fontSize: 14,
    color: "#bdc3c7",
  },
});
