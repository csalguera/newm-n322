import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "../../auth/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export default function ContactsList() {
  const router = useRouter();
  const { user } = useAuth();
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "contacts"),
      where("ownerId", "==", user.uid),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(q, (snap) =>
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
    );
    return unsub;
  }, [user?.uid]);

  const addContact = async () => {
    const trimmed = contactName.trim();
    if (!trimmed || !user) return;

    await addDoc(collection(db, "contacts"), {
      name: trimmed,
      number: contactNumber,
      ownerId: user.uid,
      createdAt: serverTimestamp(),
    });

    setContactName("");
    setContactNumber("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Contacts</Text>
      <View style={styles.row}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="contact name"
          value={contactName}
          onChangeText={setContactName}
          autoCapitalize="words"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
          keyboardType="phone-pad"
        />
        <View style={{ width: 8 }} />
        <Button title="Add" onPress={addContact} />
      </View>

      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => router.push(`/(tabs)/contact-detail?id=${item.id}`)}
          >
            <View style={styles.contactInfo}>
              <Text style={styles.contact}>{item.name}</Text>
              <Text style={styles.contactNumber}>{item.number}</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={styles.subtle}>No contacts yet. Add one above ↑</Text>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 8 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, borderRadius: 8 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  subtle: { color: "#666", marginTop: 8 },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fafafa",
  },
  contactInfo: {
    flex: 1,
  },
  contact: { fontSize: 18, fontWeight: "600", marginBottom: 4 },
  contactNumber: { fontSize: 16, color: "#666" },
  arrow: { fontSize: 24, color: "#06c", marginLeft: 12 },
});
