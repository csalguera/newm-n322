import { useState } from "react";

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Pressable,
} from "react-native";

import { Feather } from "@expo/vector-icons"

export default function App() {
  const [todo, setTodo] = useState("")
  const [list, setList] = useState([])
  const [todoId, setTodoId] = useState(null)
  const [todoName, setTodoName] = useState("")
  const [inputFocus, setInputFocus] = useState(0)

  const addTodo = () => {
    if (todo.trim().length === 0) return;
    setList([...list, { id: Date.now().toString(), name: todo }]);
    setTodo("");
  };

  const removeTodo = (id) => {
    setList(list.filter((g) => g.id !== id));
  };

  const editTodo = (id, name) => {
    setTodoId(id)
    setTodoName(name)
  }

  const saveTodo = (id) => {
    setList(list.map((g) => (g.id === id ? { ...g, name: todoName } : g)))
    setTodoId(null)
    setTodoName("")
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>To-Do List</Text>
      <View style={styles.inputRow}>
        <TextInput
          style={[
            styles.input,
            inputFocus === 1 && styles.inputFocused
          ]}
          placeholder="Add To-Do"
          value={todo}
          onChangeText={setTodo}
          onFocus={() => setInputFocus(1)}
          onBlur={() => setInputFocus(0)}
        />
        <Button title="Add" onPress={addTodo} />
      </View>
      <FlatList
        data={list}
        keyExtractor={(g) => g.id}
        renderItem={({ item: todo }) => (
          <View style={styles.todoRow}>
            {todoId === todo.id ? (
              <TextInput
                style={[
                  styles.input,
                  inputFocus === 2 && styles.inputFocused
                ]}
                value={todoName}
                onChangeText={setTodoName}
                onFocus={() => setInputFocus(2)}
                onBlur={() => setInputFocus(0)}
              />
            ) : (
              <Text style={styles.todoText}>{todo.name}</Text>
            )}
            <View style={{ flexDirection: "row" }}>
              {todoId === todo.id ? (
                <Pressable onPress={() => saveTodo(todo.id)}>
                  <Feather
                    name="save"
                    size={22}
                    color="green"
                    style={styles.saveBtn}
                  />
                </Pressable>
              ) : (
                <Pressable onPress={() => editTodo(todo.id, todo.name)}>
                  <Feather
                    name="edit"
                    size={22}
                    color="blue"
                    style={styles.editBtn}
                  />
                </Pressable>
              )}
              <Pressable onPress={() => removeTodo(todo.id)}>
                <Feather
                  name="trash-2"
                  size={22}
                  color="red"
                  style={styles.deleteBtn}
                />
              </Pressable>
            </View>
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
    borderColor: "#e0e0e0",
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginRight: 12,
    borderRadius: 10,
    backgroundColor: "#fafafa",
    fontSize: 16,
    color: "#333",
  },
  inputFocused: {
    borderColor: "#4A90E2",
    backgroundColor: "#fff",
  },
  todoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#f0f0f0",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  todoText: {
    fontSize: 16,
  },
  deleteBtn: {
    fontSize: 24,
    color: "red",
  },
  editBtn: {
    marginRight: 20,
    fontSize: 24,
    color: "blue",
  },
  saveBtn: {
    marginRight: 20,
    fontSize: 24,
    color: "green",
  },
});
