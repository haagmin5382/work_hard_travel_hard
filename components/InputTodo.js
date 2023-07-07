import React from "react";
import { TextInput } from "react-native";
import { styles } from "../styles/style";

const InputTodo = ({ addToDo, working, text, changeText }) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="silver"
      placeholder={working ? "Add a To do" : "Where do you want to go?"}
      onSubmitEditing={addToDo}
      onChangeText={changeText}
      value={text}
    />
  );
};

export default InputTodo;
