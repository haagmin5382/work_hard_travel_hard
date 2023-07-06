import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  TextInput,
  ScrollView,
} from "react-native";
import { theme } from "./color";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TouchableOpacity => 클릭 시 전환 발생 , TouchableHighlight => 클릭 시 전환 미발생
export default function App() {
  useEffect(() => {
    loadToDos();
  }, []);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] = useState({});
  const handleTravel = () => setWorking(false);
  const handleWork = () => setWorking(true);
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
      [Date.now()]: { text, work: working },
    });
    setToDos(newToDos);
    saveToDos(newToDos);
    setText("");
  };
  // console.log(toDos);

  const loadToDos = async () => {
    const s = await AsyncStorage.getItem("STORAGE_KEY");
    setToDos(JSON.parse(s));
    console.log(s);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleWork}>
          <Text
            style={{ ...styles.btnText, color: working ? "white" : theme.gray }}
          >
            Work
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleTravel}>
          <Text
            style={{ ...styles.btnText, color: working ? theme.gray : "white" }}
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
          {Object.keys(toDos).map((key) =>
            toDos[key].work === working ? (
              <View style={styles?.toDo} key={key}>
                <Text style={styles?.toDoText}>{toDos[key].text}</Text>
              </View>
            ) : null
          )}
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
  },
  toDoText: {
    color: "white",
    fontSize: 16,
  },
});
