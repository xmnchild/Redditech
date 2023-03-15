import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

//** SCREENS */
import LoginPage from "../screen/LoginPage";

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Login"
        component={LoginPage}
        options={{ title: "Welcome" }}
      />
    </Stack.Navigator>
  );
}
