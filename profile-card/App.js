import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import { useState } from "react";

export default function App() {
  const profileImage = require("./assets/front-profile.jpeg");
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.imageWrapper}>
          <Image
            source={profileImage}
            style={styles.avatar}
            onLoadStart={() => setLoading(true)}
            onLoadEnd={() => setLoading(false)}
          />
          {loading &&
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={styles.loader}
            />
          }
        </View>
        <Text style={styles.name}>Carlos Salguera</Text>
        <Text style={styles.bio}>Junior | Computer Science Major</Text>
        <Text style={styles.funFact}>
          Enjoy playing board games with wife and friends.
        </Text>
        <Text style={styles.funFact}>
          Go to weekly tournaments for a trading card game along with wife.
        </Text>
        <Text style={styles.funFact}>
          Completed a software engineering bootcamp in March 2023.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#bacfffff",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
  },
  imageWrapper: {
    width: 200,
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    marginBottom: 15,
  },
  loader: {
    position: "absolute",
  },
  name: {
    fontSize: 24,
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 5,
  },
  bio: {
    fontSize: 18,
    textAlign: "center",
    maxWidth: 200,
    color: "#333",
    marginBottom: 15,
  },
  funFact: {
    fontSize: 14,
    maxWidth: 200,
    textAlign: "center",
    color: "#555",
    marginTop: 10,
  },
});
