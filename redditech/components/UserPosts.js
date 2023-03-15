import { Text, View } from 'react-native';
import PostFeed from './PostFeed';
import { useState, useEffect } from 'react';
import { formatTime } from './Feed';
/*--------Recoil---------*/
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";

export default function UserPosts({ token, username }) {
    const [result, setResult] = useState(null);
    const [doneToken] = useRecoilState(tokenAtom);
    const getUserPosts = async () => {
        try {
            fetch("https://oauth.reddit.com/user/" + username + "/submitted", {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + doneToken,
                },
            })
                .then((result) => result.json())
                .then((data) => {
                    setResult(data.data.children);
                });
        } catch (error) {
            console.error(error);
        }
    };
    useEffect(() => {
        getUserPosts();
    }, []);
    return (
        <View style={{ flexGrow: 1 }}>
            {result ? result.map((child, index) => {
                return (
                    <PostFeed
                        subreddit={child.data.subreddit_name_prefixed}
                        postheading={child.data.title}
                        postcontent={child.data.selftext}
                        subredditusername={child.data.author}
                        time={formatTime(child.data.created)}
                        id={child.data.id}
                        folded={true}
                    />);
            }) : <Text>Loading...</Text>}
        </View>
    );
}
