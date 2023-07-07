import React, { useState } from "react";
import { Alert, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { styles } from "../styles/style";
import { theme } from "../styles/color";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

const Todos = ({ toDos, working, setToDos, saveToDos }) => {
  const [updatedText, setUpdatedText] = useState("");

  const changeTodo = (key) => {
    const { text, work, isComplete } = toDos[key];
    const newToDos = {
      ...toDos,
      [key]: {
        text: text,
        work: work,
        isComplete: !isComplete,
      },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
  }; // U , Todo 완료 여부 변경
  const updateTodo = (key, updatedText) => {
    const { work, isComplete } = toDos[key];
    const newToDos = {
      ...toDos,
      [key]: {
        text: updatedText,
        work: work,
        isComplete: isComplete,
      },
    };
    setToDos(newToDos);
    saveToDos(newToDos);
  }; // U , 실질적인 데이터 변경
  const changeTodoText = (key, updatedText) => {
    Alert.prompt(
      "modify text?",
      "Do you want to modify text?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: (value) => updateTodo(key, value),
        },
      ],
      "plain-text", // 기본 text
      updatedText // value
    );
  }; // U , Alert.prompt
  const deleteToDo = async (key) => {
    // Alert API 사용
    Alert.alert("Delete To Do", "Are you sure", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        style: "destructive",
        onPress: async () => {
          // Yes 누르면 실행되는 함수
          const newToDos = { ...toDos };
          delete newToDos[key];
          setToDos(newToDos);
          await saveToDos(newToDos);
        },
      },
    ]);
    return;
  }; // D

  return (
    <ScrollView>
      {toDos
        ? Object?.keys(toDos).map((key) => {
            const { work, isComplete, text } = toDos[key];
            return work === working ? (
              <View style={styles?.toDo} key={key}>
                <Text
                  style={{
                    ...styles?.toDoText,
                    textDecorationLine: isComplete ? "line-through" : null,
                  }}
                >
                  {toDos[key].text}
                </Text>

                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => changeTodo(key)}>
                    {isComplete ? (
                      <Fontisto
                        name="checkbox-active"
                        size={22}
                        color={theme.gray}
                      />
                    ) : (
                      <Fontisto
                        name="checkbox-passive"
                        size={24}
                        color={theme.gray}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ marginLeft: 15 }}
                    // onPress={() => setUpdatingTodo(key)}
                    onPress={() => changeTodoText(key, updatedText)}
                  >
                    <Entypo name="edit" size={24} color={theme.gray} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => deleteToDo(key)}
                    style={{ marginLeft: 15 }}
                  >
                    <Fontisto name="trash" size={24} color={theme.gray} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null;
          })
        : null}
    </ScrollView>
  );
};

export default Todos;
