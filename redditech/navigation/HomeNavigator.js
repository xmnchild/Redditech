import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

/**SCREEN COMPONENTS */
import Settings from "../screen/SettingsPage";
import Feed from "../components/Feed";
import Post from "../components/Post";
import ProfilePage from "../screen/ProfilePage";
import Subreddit from "../screen/Subreddit";

const Stack = createStackNavigator();

function CustomHeader() {
  return (
    <View style={{}}>
      <Image source={""} style={{ width: 150, height: 60 }} />
    </View>
  );
}

export default function HomeNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerBackVisible: false,
          headerTitle: () => <CustomHeader />,
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen
        name="Settings"
        component={Settings}
        options={{ headerShown: true }}
      />
      <Stack.Screen
        name="Post"
        component={Post}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfilePage}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Subreddit"
        component={Subreddit}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
