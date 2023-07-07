import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, TextInput } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { styles } from "./styles/style";
import Header from "./components/Header";
import Todos from "./components/Todos";
import InputTodo from "./components/InputTodo";

// TouchableOpacity => 클릭 시 전환 발생 , TouchableHighlight => 클릭 시 전환 미발생
export default function App() {
  useEffect(() => {
    loadToDos();
    loadWorkingState();
  }, []);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});

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
      <Header working={working} setWorking={setWorking} />
      <View>
        <InputTodo
          addToDo={addToDo}
          working={working}
          text={text}
          changeText={changeText}
        />
        <Todos
          toDos={toDos}
          working={working}
          setToDos={setToDos}
          saveToDos={saveToDos}
        />
      </View>
    </View>
  );
}
