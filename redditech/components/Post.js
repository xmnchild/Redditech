import {StyleSheet,Text,View,ScrollView,Dimensions,} from "react-native";
import { Avatar, Header } from "@rneui/themed";
import Icon from "react-native-vector-icons/Ionicons";
import { Button } from "@rneui/base";
import { useNavigation, useRoute } from "@react-navigation/native";
import PostFeed from "./PostFeed";
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";
import { useEffect, useState } from "react";
import * as React from "react";
import { formatTime } from './Feed';

const windowHeight = Dimensions.get('window').height;
const Post = (props) => {
    const route = useRoute();
    const navigation = useNavigation();
    const [doneToken] = useRecoilState(tokenAtom);
    const [result, setResult] = useState();
    const { id, subreddit } = route.params;
    const [icon, setIcon] = useState();

    const getIcon = async () => {
        try {
            console.log('sub: ' + props.subreddit);
            const result = await fetch("https://www.reddit.com/" + subreddit + "/about.json", {
                method: "GET",
            });
            result.json().then((data) => {
                setIcon(data.data.community_icon.split('?')[0]);
            });
        } catch (error) {
            console.error(error);
        }
    };
    const getContent = async () => {
        fetch(`https://oauth.reddit.com/comments/${id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + doneToken,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("Reponse not 200");
            })
            .then(data => {
                setResult(data);
                console.log(id);
            })
            .catch(error => {
                console.log(error);
            });
    };
    useEffect(() => {
        getIcon();
        getContent();
    }, []);
    return (
        <View style={{ backgroundColor: "#ffff", height: windowHeight }}>
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
                centerComponent={<View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Avatar
                        size={32}
                        rounded
                        source={icon ? { uri: icon } : require("../assets/img/default_subreddit.png")}
                    />
                    <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: 14, color: 'white' }}>
                        {subreddit}
                    </Text>
                </View>}
                centerContainerStyle={{ alignItems: "center", justifyContent: "space-around", flexDirection: "column" }}
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
                    height: (windowHeight / 8),
                    borderColor: 'black',
                    elevation: 2
                }}
            />
            <ScrollView style={{ backgroundColor: "#F5F5F8" }}>
                {result ? result[0].data.children.map((child, index) => {
                    return (
                        <PostFeed
                            subredditusername={child.data.author}
                            postheading={child.data.title}
                            postcontent={child.data.selftext}
                            time={formatTime(child.data.created)}
                            key={index}
                            folded={false}
                            media={child.data.media_metadata}
                            ups={child.data.ups}
                            downs={child.data.downs}
                            num_comments={child.data.num_comments}
                          postData={child.data}
                        />);
                }) : <Text>Loading...</Text>}

                <View>
                    {result ? result[1].data.children.map((child, index) => {
                        return (
                            <PostFeed
                                subredditusername={child.data.author}
                                postheading={child.data.title}
                                postcontent={child.data.body}
                                time={formatTime(child.data.created)}
                                key={index}
                                id={child.data.id}
                                folded={false}
                                media={child.data.media_metadata}
                                ups={child.data.ups}
                                downs={child.data.downs}
                              postData={child.data}
                            />);
                    }) : <Text>Loading...</Text>}
                </View>
            </ScrollView>
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
    justifyContent: "center",
    paddingLeft: 10,
    paddingBottom: 5,
  },
  postheading: {
    fontWeight: "bold",
    fontSize: 20,
  },
  textpostcontainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
  },
});

export default Post;
