import { useEffect } from "react";
import { StyleSheet, Text, View, Image, Pressable, Linking } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { encode as btoa } from "base-64";
import axios from "axios";
//* ------- RECOIL ------- *//
import { useRecoilState } from "recoil";
//* ------- STORE ------- *//
import { setToken } from "../store/token";
//* ------- ATOMS ------- *//
import { tokenAtom } from "../helpers/UserState";
WebBrowser.maybeCompleteAuthSession();
const CLIENT_ID = "8H3_j3pSQaxgfHJkG6hwlA";
// Endpoint
const discovery = {
  authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
  tokenEndpoint: "https://www.reddit.com/api/v1/access_token",
};
export default function LoginPage() {
  const navigation = useNavigation();
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ["*"],
      redirectUri: "exp://localhost:19000/",
    },
    discovery
  );
  const [, setDoneToken] = useRecoilState(tokenAtom);
  //function to get token
  const getToken = async () => {
    if (response?.type === "success") {
      const { code } = response.params;
      const base64 = btoa(`${CLIENT_ID}:`);
      try {
        const data = await axios.post(
          "https://www.reddit.com/api/v1/access_token",
          `grant_type=authorization_code&code=${code}&redirect_uri=exp://localhost:19000/`,
          {
            headers: {
              Authorization: `Basic ${base64}`,
              "content-type": "application/x-www-form-urlencoded",
            },
          }
        );
        const token = data["data"]["access_token"];
        setDoneToken(token);
        setToken(token);
        navigation.navigate("Feed");
      } catch (error) {
        console.log(error);
      }
    }
  };
  useEffect(() => {
    getToken();
  }, [response]);
  return (
    <View style={{ flex: 1, marginTop: 100, alignItems: "center" }}>
      <Image
        source={require("../assets/redditech-logo.png")}
        style={styles.logo}
      />
      {/* <Text style={styles.title}>Welcome to Hcetidder!</Text> */}
      <View style={{ flexGrow: 1 }} />
      <Pressable
        disabled={!request}
        title="Login"
        onPress={() => {
          promptAsync();
        }}
        style={styles.button}>
        <Text style={styles.buttonText}>Log in with your Reddit account</Text>
      </Pressable>

      <View style={{ marginTop: 10, marginBottom: 100, flexDirection: "row" }}>
        <Text style={{ fontSize: 16 }}>New to Reddit? </Text>
        <Pressable style={{ padding: 0 }} onPress={onPressSignup}>
          <Text style={styles.registerText}>Sign up</Text>
        </Pressable>
      </View>
    </View>
  );
}
async function onPressSignup(navigation) {
  Linking.addEventListener("url", handleUrlChange);
  await Linking.openURL("https://www.reddit.com/register/");
  function handleUrlChange(event) {
    const { url } = event;
    // check if the URL matches the registration complete URL
    if (url && url.startsWith("https://www.reddit.com/onboarding")) {
      Linking.removeEventListener("url", handleUrlChange);
      navigation.goBack();
    }
  }
}
const styles = StyleSheet.create({
  logo: {
    width: 250,
    height: 250,
    marginVertical: 50,
  },
  container: {
    padding: 10,
    flex: 1,
  },
  button: {
    paddingHorizontal: 40,
    paddingVertical: 10,
    backgroundColor: "#ff5700",
    borderRadius: 40,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  title: {
    marginBottom: 30,
    fontSize: 24,
    fontWeight: 'bold'
  },
  registerText: {
    fontSize: 16,
    color: "navy",
  },
});
