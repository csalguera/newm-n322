import { useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
} from "react-native";

export default function App() {
  const [todo, setTodo] = useState("")
  const [list, setList] = useState([])

  const addTodo = () => {
    if (todo.trim().length === 0) return;
    setList([...list, { id: Date.now().toString(), name: todo }]);
    setTodo("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Add To-Do"
          value={todo}
          onChangeText={setTodo}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(g) => g.id}
        renderItem={({ item: todo }) => (
          <View style={styles.todoRow}>
            <Text style={styles.todoText}>{todo.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  inputRow: {
    flexDirection: "row",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
  },
  todoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  todoText: {
    fontSize: 16,
  },
});
