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
import { useAuth } from "../../auth/AuthContext";
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

export default function ContactsList() {
  const { user } = useAuth();
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [editingId, setEditingId] = useState(null);
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

  const addOrSave = async () => {
    const trimmed = contactName.trim();
    if (!trimmed || !user) return;
    if (editingId) {
      await updateDoc(doc(db, "contacts", editingId), {
        name: trimmed,
        number: contactNumber,
      });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "contacts"), {
        name: trimmed,
        number: contactNumber,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
    }
    setContactName("");
    setContactNumber("");
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setContactName(item.name);
    setContactNumber(item.number);
  };

  const remove = async (id) => {
    await deleteDoc(doc(db, "contacts", id));
    if (editingId === id) {
      setEditingId(null);
      setContactName("");
      setContactNumber("");
    }
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
          autoCapitalize="none"
        />
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="contact number"
          value={contactNumber}
          onChangeText={setContactNumber}
          autoCapitalize="none"
        />
        <View style={{ width: 8 }} />
        <Button title={editingId ? "Save" : "Add"} onPress={addOrSave} />
      </View>

      <FlatList
        style={{ marginTop: 16 }}
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.contact}>{item.name}</Text>
            <Text style={styles.contact}>{item.number}</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity onPress={() => startEdit(item)}>
                <Text style={styles.link}>Edit</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 8 }}>|</Text>
              <TouchableOpacity onPress={() => remove(item.id)}>
                <Text style={[styles.link, { color: "#c00" }]}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.subtle}>No contacts yet. Add one ↑</Text>
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
    padding: 12,
    borderWidth: 1,
    borderColor: "#eee",
    borderRadius: 10,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contact: { fontSize: 18, fontWeight: "600" },
  cardButtons: { flexDirection: "row", alignItems: "center" },
  link: { fontSize: 16, color: "#06c" },
});
