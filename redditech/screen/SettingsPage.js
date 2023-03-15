import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  FlatList,
  Platform,
  StatusBar,
  Linking,
} from "react-native";
import { Block, theme } from "galio-framework";
import { useRecoilState } from "recoil";
import { tokenAtom, settingsAtom } from "../helpers/UserState";
import axios from "axios";

export default function Settings({ navigation }) {
  const [state, setState] = useState({});
  const [doneToken] = useRecoilState(tokenAtom);
  const [settings] = useRecoilState(settingsAtom);

  const toggleSwitch = (switchNumber) =>
    setState({ ...state, [switchNumber]: !state[switchNumber] });

  const renderItem = ({ item }) => {
    const { navigate } = navigation;

    switch (item.type) {
      case "switch":
        return (
          <Block row middle space="between" style={styles.rows}>
            <Text size={14}>{item.title}</Text>
            <Switch
              onValueChange={() => toggleSwitch(item.id)}
              ios_backgroundColor={theme.COLORS.SWITCH_OFF}
              thumbColor={
                Platform.OS === "android" ? theme.COLORS.SWITCH_OFF : null
              }
              trackColor={{
                false: theme.COLORS.SWITCH_OFF,
                true: theme.COLORS.SWITCH_ON,
              }}
              value={state[item.id]}
            />
          </Block>
        );
      case "button":
        return (
          <Block>
            <TouchableOpacity
              onPress={async () =>
                await Linking.openURL("https://www.redditinc.com")
              }>
              <Text style={{ marginTop: 5, color: "black" }}>{item.title}</Text>
            </TouchableOpacity>
          </Block>
        );
      case "buttonProfile":
        return (
          <Block>
            <TouchableOpacity onPress={() => navigate("Profile")}>
              <Text style={{ marginTop: 5, color: "black" }}>{item.title}</Text>
            </TouchableOpacity>
          </Block>
        );
      default:
        break;
    }
  };

  const about = [{ title: "About", id: "About", type: "button" }];

  const privacy = [{ title: "Profile", id: "Profile", type: "buttonProfile" }];

  const [privateFeeds, setPrivateFeeds] = useState(
    settings ? settings.private_feeds : false
  );
  const [autoPlay, setAutoPlay] = useState(
    settings ? settings.video_autoplay : false
  );
  const [over18, setOver18] = useState(settings ? settings.over_18 : false);
  const [publicVotes, setPublicVotes] = useState(
    settings ? settings.public_votes : false
  );
  const [linkFair, setLinkFair] = useState(
    settings ? settings.show_link_flair : false
  );
  const [topKarma, setTopKarma] = useState(
    settings ? settings.top_karma_subreddits : false
  );

  const toggleSwitch1 = () =>
    setPrivateFeeds((previousState) => !previousState);
  const toggleSwitch2 = () => setAutoPlay((previousState) => !previousState);
  const toggleSwitch3 = () => setOver18((previousState) => !previousState);
  const toggleSwitch4 = () => setPublicVotes((previousState) => !previousState);
  const toggleSwitch5 = () => setLinkFair((previousState) => !previousState);
  const toggleSwitch6 = () => setTopKarma((previousState) => !previousState);

  useEffect(() => {
    if (settings) {
      setPrivateFeeds(settings.private_feeds);
      setAutoPlay(settings.video_autoplay);
      setOver18(settings.over_18);
      setPublicVotes(settings.public_votes);
      setLinkFair(settings.show_link_flair);
      setTopKarma(settings.top_karma_subreddits);
    }
  }, [settings]);

  const updateSettings = async () => {
    try {
      const response = await axios.patch(
        "https://oauth.reddit.com/api/v1/me/prefs",
        JSON.stringify({
          private_feeds: privateFeeds,
          video_autoplay: autoPlay,
          over_18: over18,
          public_votes: publicVotes,
          show_link_flair: linkFair,
          top_karma_subreddits: topKarma,
        }),
        {
          headers: {
            Authorization: "bearer " + doneToken,
            Accept: "application/json",
            "Content-Type": "application/json",
            "User-Agent": "Redditech/1.0.0",
          },
        }
      );
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    if (
      settings.private_feeds != privateFeeds ||
      settings.video_autoplay != autoPlay ||
      settings.over_18 != over18 ||
      settings.public_votes != publicVotes ||
      settings.show_link_flair != linkFair ||
      settings.top_karma_subreddits != topKarma
    ) {
      updateSettings();
    }
  }, [privateFeeds, autoPlay, over18, publicVotes, linkFair, topKarma]);

  return (
    <View style={style.view}>
      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          marginBottom: 10,
          marginTop: 10,
          color: "#ff5700",
        }}>
        {" "}
        PRIVACY{" "}
      </Text>
      <View style={style.card}>
        <View style={style.params}>
          <FlatList
            data={privacy}
            keyExtractor={(item, index) => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          marginBottom: 10,
          marginTop: 10,
          color: "#ff5700",
        }}>
        {" "}
        VIEW OPTIONS{" "}
      </Text>
      <View style={style.card}>
        <View style={style.params}>
          <Text style={{ color: "black" }}>Private Feeds</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={privateFeeds ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch1}
            value={privateFeeds}
          />
        </View>
        <View style={style.params}>
          <Text style={{ marginTop: 5, color: "black" }}>Auto Play</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={autoPlay ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch2}
            value={autoPlay}
          />
        </View>
        <View style={style.params}>
          <Text style={{ marginTop: 5, color: "black" }}>
            Show NSFW cotent (I'm over 18)
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={over18 ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch3}
            value={over18}
          />
        </View>
      </View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          marginBottom: 10,
          marginTop: 10,
          color: "#ff5700",
        }}>
        {" "}
        ADVANCED{" "}
      </Text>
      <View style={style.card}>
        <View style={style.params}>
          <Text style={{ marginTop: 5, color: "black" }}>
            Saved image attribution
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={publicVotes ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch4}
            value={publicVotes}
          />
        </View>
        <View style={style.params}>
          <Text style={{ marginTop: 5, color: "black" }}>Open web</Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={linkFair ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch5}
            value={linkFair}
          />
        </View>
        <View style={style.params}>
          <Text style={{ marginTop: 5, color: "black" }}>
            Top Karma Subreddit
          </Text>
          <Switch
            trackColor={{ false: "#767577", true: "#ba7f61" }}
            thumbColor={topKarma ? "#ff5700" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch5}
            value={topKarma}
          />
        </View>
      </View>
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 15,
          marginBottom: 10,
          marginTop: 10,
          color: "#ff5700",
        }}>
        {" "}
        OTHER INFORMATION{" "}
      </Text>
      <View style={style.card}>
        <View style={style.params}>
          <FlatList
            data={about}
            keyExtractor={(item, index) => item.id}
            renderItem={renderItem}
          />
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  settings: {
    paddingVertical: theme.SIZES.BASE / 3,
  },
  title: {
    paddingTop: theme.SIZES.BASE,
    paddingBottom: theme.SIZES.BASE / 2,
  },
});

const style = StyleSheet.create({
  view: {
    marginTop: 5,
  },
  card: {
    backgroundColor: "white",
  },
  params: {
    margin: 10,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
