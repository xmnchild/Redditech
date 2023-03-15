import { useState } from "react";
import { StyleSheet, Text, View, ImageBackground, ScrollView, Dimensions } from "react-native";
import { Avatar, Header, Button } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import UserPosts from "../components/UserPosts";
import Icon from "react-native-vector-icons/Ionicons";

import { useNavigation } from "@react-navigation/native";
import { useEffect } from "react";
/*--------Recoil---------*/
import { useRecoilState } from "recoil";
const windowHeight = Dimensions.get('window').height;
import { tokenAtom } from "../helpers/UserState";
export default function ProfilePage() {
  const navigation = useNavigation();

  const [doneToken] = useRecoilState(tokenAtom);
  const [result, setResult] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(null);
  const getUser = async () => {
    try {
      const result = await fetch("https://oauth.reddit.com/api/v1/me", {
        method: "GET",
        headers: {
          Authorization: "bearer " + doneToken,
        },
      });
      result.json().then((data) => {
        setResult(data);
        console.log(data.name);
        setHasLoaded(true);
      });
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    
    hasLoaded ?
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ flexGrow: 1 }}
        automaticallyAdjustContentInsets={false}
      >
      
        <View>
        <Header
                    backgroundColor={"black"}
                    placement="left"
                    leftComponent=
                    {<Button
                        type="clear"
                        onPress={() => navigation.goBack()}>
                        <Icon
                            name='chevron-back-outline'
                            size={28}
                            color={"white"}>
                        </Icon>
                    </Button>}
                    leftContainerStyle={{ justifyContent: 'center', flexDirection: "column", alignItems: "center" }}
                    rightComponent=
                    {<Button
                        type="clear"
                        onPress={() => navigation.goBack()}>
                        <Icon
                            name='settings-outline'
                            color={"white"}
                            size={28}>
                        </Icon>
                    </Button>}
                    rightContainerStyle={{ justifyContent: 'center', flexDirection: "column", alignItems: "center" }}
                    containerStyle={{
                        height: (windowHeight / 7),
                        borderColor: 'black',
                        elevation: 2
                    }}
                />
          <ImageBackground
            imageStyle={{ opacity: 1, resizeMode: 'cover' }}
            source={
              result && result["subreddit"]["banner_img"]
                ? { uri: result["subreddit"]["banner_img"].split('?')[0] }
                : require("../assets/img/fakeuser.png")
            }
            resizeMode="cover"
          >
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,1)']}
              style={styles.image}
            >
              <Avatar
                size={64}
                rounded
                source={result ? { uri: result["subreddit"]["icon_img"].split('?')[0] } : null}
              />
              <Text style={styles.username}>{result ? result.name : null}</Text>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.smallText}>followers : {result && result.num_friends} </Text>
                <Text style={styles.smallText}>karma :{result?.total_karma}</Text>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>
        <View>
          <Text style={styles.title}>POSTS</Text>
          <UserPosts token={doneToken} username={result ? result.name : null} />
        </View>
      </ScrollView>
      : <Text>Loading</Text>
  );
}
const styles = StyleSheet.create({
  username: {
    fontSize: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowRadius: 30,
    color: 'white',
  },
  smallText: {
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    tepxtShadowRadius: 1,
  },
  logo: {
    width: 66,
    height: 66,
    marginVertical: 50,
  },
  row: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  container: {
    padding: 20,
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
    fontSize: 15,
  },
  title: {
    marginTop: 30,
    marginBottom: 10,
    marginLeft: 10,
    fontSize: 20,
  },
  registerText: {
    fontSize: 12,
    color: "navy",
  },
  image: {
    paddingTop: 50,
    paddingLeft: 10,
  },
});
