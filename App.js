import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Fontisto } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";

// TouchableOpacity => 클릭 시 전환 발생 , TouchableHighlight => 클릭 시 전환 미발생
export default function App() {
  useEffect(() => {
    loadToDos();
    loadWorkingState();
  }, []);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [updatedText, setUpdatedText] = useState("");
  const [toDos, setToDos] = useState({});
  const handleTravel = () => {
    setWorking(false);
    changeWorkingState(false);
  };
  const handleWork = () => {
    setWorking(true);
    changeWorkingState(true);
  };
  const changeText = (e) => setText(e);

  const saveToDos = async (toSave) => {
    try {
      // try catch 문으로 작성하는 이유는 사용자의 모바일폰에 문제가 생길 경우를 대비해서이다 (용량이 없다던지..)
      const s = JSON.stringify(toSave);
      await AsyncStorage.setItem("STORAGE_KEY", s);
    } catch {}
  };
  const addToDo = () => {
    if (text === "") {
      return "";
    }
    const newToDos = Object.assign({}, toDos, {
      [Date.now()]: { text, work: working, isComplete: false },
    });
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  }; // C
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem("STORAGE_KEY");
    setToDos(JSON.parse(s));
  }; // R , 데이터 읽기
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

  const changeWorkingState = async (working) => {
    try {
      const s = JSON.stringify(working);
      await AsyncStorage.setItem("WORKING_STATE", s);
    } catch {}
  };

  const loadWorkingState = async () => {
    const s = await AsyncStorage.getItem("WORKING_STATE", s);
    setWorking(JSON.parse(s)); // parse 안하면 string으로 나옴 ㅠㅠ
  };
  // 1. 새로고침해도 그 위치에 있도록 => 완료
  // 2. toDo를 완료로 표시할 수 있도록 => 완료
  // 3. toDo를 수정할 수 있도록 => 완료

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleWork}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? "white" : theme.gray,
            }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTravel}>
          <Text
            style={{
              ...styles.btnText,
              color: working ? theme.gray : "white",
            }}
          >
            Travel
          </Text>
        </TouchableOpacity>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholderTextColor="silver"
          placeholder={working ? "Add a To do" : "Where do you want to go?"}
          onSubmitEditing={addToDo}
          onChangeText={changeText}
          value={text}
        />
        <ScrollView>
          {Object.keys(toDos).map((key) => {
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
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal: 20,
  },
  header: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 100,
  },
  btnText: {
    fontSize: 44,
    fontWeight: "600",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginVertical: 20,
    fontSize: 18,
  },
  toDo: {
    backgroundColor: theme.toDoBg,
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  toDoText: {
    color: "white",
    fontSize: 16,
  },
  toDoSelect: {
    justifyContent: "flex-end",
  },
  toDoEdit: {
    backgroundColor: "silver",
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 15,
    color: "white",
    fontSize: 16,
  },
});
