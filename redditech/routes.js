import React, { useEffect } from "react";

/*--------Recoil---------*/
import { useRecoilState } from "recoil";
import { tokenAtom, settingsAtom } from "./helpers/UserState";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

/**------------NAVIGATION ------------- */
import HomeNavigator from "./navigation/HomeNavigator";
import AuthNavigator from "./navigation/AuthNavigator";

export default function Route() {
  const [doneToken] = useRecoilState(tokenAtom);
  const [, setSettings] = useRecoilState(settingsAtom);

  function getSettings() {
    fetch("https://oauth.reddit.com/api/v1/me/prefs", {
      method: "GET",
      headers: {
        Authorization: "bearer " + doneToken,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setSettings(data);
      });
  }

  useEffect(() => {
    if (doneToken) {
      getSettings();
    }
  }, [doneToken]);
  return (
    <NavigationContainer>
      {doneToken ? <HomeNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
