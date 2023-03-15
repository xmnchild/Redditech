import {StyleSheet,Text,View,TouchableHighlight,TouchableWithoutFeedback,Image, Video,} from "react-native";
import { Divider } from "@rneui/themed";
import { Avatar } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";

/*-------Recoil-------*/
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";

const PostFeed = (props) => {
  const [token, setToken] = useRecoilState(tokenAtom);
  const [icon, setIcon] = React.useState(null);
  const [media, setMedia] = React.useState(props.media);
  const [postData, setPostData] = React.useState(props.postData);
  const navigation = useNavigation();

  const getIcon = async () => {
    try {
      if (props.subreddit) {
        const result = await fetch(
          "https://www.reddit.com/" + props.subreddit + "/about.json",
          {
            method: "GET",
          }
        );
        result.json().then((data) => {
          setIcon(data.data.community_icon.split("?")[0]);
        });
      } else {
        const result = await fetch(
          "https://www.reddit.com/user/" +
            props.subredditusername +
            "/about.json",
          {
            method: "GET",
          }
        );
        result.json().then((data) => {
          setIcon(data.data.icon_img.split("?")[0]);
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    getIcon();
  }, []);

  React.useEffect(() => {
    //console.log("token", token);
  }, [token]);

  let title;
  if (props.postheading) {
    title = (
      <View style={styles.postheadingcontainer}>
        <Text style={styles.postheading}>{props.postheading}</Text>
      </View>
    );
  } else {
    title = null;
  }

  return (
    <View style={{ backgroundColor: "#ffff" }}>
      <TouchableHighlight
        activeOpacity={0.6}
        underlayColor="#DDDDDD"
        onPress={() =>
          navigation.navigate("Post", {
            id: props.id,
            subreddit: props.subreddit,
          })
        }>
        <View>
          <View style={styles.topfeedcontainer}>
            <TouchableWithoutFeedback
              onPress={() =>
                navigation.navigate("Subreddit", { subreddit: props.subreddit })
              }>
              <Avatar
                size={32}
                rounded
                source={
                  icon
                    ? { uri: icon }
                    : require("../assets/img/default_subreddit.png")
                }
              />
            </TouchableWithoutFeedback>
            <View style={styles.userpostcontainer}>
              <TouchableWithoutFeedback
                onPress={() =>
                  navigation.navigate("Subreddit", {
                    subreddit: props.subreddit,
                  })
                }>
                <Text>{props.subreddit ?? "u/" + props.subredditusername}</Text>
              </TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => alert("User!")}>
                <Text>
                  {props.subreddit
                    ? "u/" + props.subredditusername + " - "
                    : ""}{" "}
                  {props.time}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </View>
          {title}
          <View style={styles.textpostcontainer}>
            <Text numberOfLines={props.folded ? 3 : 0} ellipsizeMode={"tail"}>
              {props.postcontent}
            </Text>
          </View>
          <View style={styles.textpostcontainer}>
            {postData?.thumbnail &&
              postData?.thumbnail !== "self" &&
              postData?.thumbnail !== "default" && (
                <Image
                  source={{ uri: postData.thumbnail }}
                  style={{ width: 360, height: 200 }}
                />
              )}
            {postData?.secure_media && postData?.secure_media.reddit_video && (
              <Video
                source={{
                  uri: postData.secure_media.reddit_video.fallback_url,
                }}
                style={{ width: 360, height: 200 }}
              />
            )}
          </View>
                      <View style={{ flexDirection: "row", justifyContent: "space-evenly", flexGrow: 1 }}>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon
                                name="arrow-up-outline"
                                size={20}
                            />
                            <Text style={{ fontSize: 17, color: "#949494" }}>
                                {props.ups}
                            </Text>
                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Icon
                                name="arrow-down-outline"
                                size={20}
                            />
                            <Text style={{ fontSize: 17, color: "#949494" }}>
                                {props.downs}
                            </Text>

                        </View>
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                            <Text style={{ fontSize: 17, color: "#949494" }}>
                                {props.num_comments}<Icon name='mail-outline' size={20}></Icon></Text>
                        </View>
                    </View>
        </View>
      </TouchableHighlight>
      <Divider width={10} color="#F5F5F8" />
    </View>
  );
};
const styles = StyleSheet.create({
  topfeedcontainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    padding: 20,
  },
  userpostcontainer: {
    flexDirection: "column",
    justifyContent: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },
  postheadingcontainer: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 10,
    paddingBottom: 5,
    textAlign: "left",
  },
  postheading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  textpostcontainer: {
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
});
export default PostFeed;
