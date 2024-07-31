import { StyleSheet, Text, View } from "react-native";
import React from "react";

const App = () => {
  return (
    <View style={styles.container}>
      <Text>index</Text>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
