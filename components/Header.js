import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { styles } from "../styles/style";
import { theme } from "../styles/color";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Header = ({ working, setWorking }) => {
  const handleTravel = () => {
    setWorking(false);
    changeWorkingState(false);
  };
  const handleWork = () => {
    setWorking(true);
    changeWorkingState(true);
  };
  const changeWorkingState = async (working) => {
    try {
      const s = JSON.stringify(working);
      await AsyncStorage.setItem("WORKING_STATE", s);
    } catch {}
  };
  return (
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
  );
};

export default Header;
