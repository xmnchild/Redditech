import { StatusBar } from 'expo-status-bar';
import { View, Dimensions, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import FilterDropdown from "./FilterDropdown";
import Navbar from './Header';
import PostFeed from './PostFeed';
import * as React from "react";
import { useState, useEffect } from 'react';

/*--------Recoil---------*/
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export function formatTime(timestamp) {

    // Convert Unix timestamp to human-readable date
    const postDate = new Date(timestamp * 1000);
    const currentDate = new Date();

    const years = currentDate.getFullYear() - postDate.getFullYear();
    const months = currentDate.getMonth() - postDate.getMonth();
    const days = currentDate.getDate() - postDate.getDate();
    const hours = currentDate.getHours() - postDate.getHours();
    const minutes = currentDate.getMinutes() - postDate.getMinutes();

    if (years > 0) {
        return (`${years} y ago`);
    }
    if (months > 0) {
        return (`${months} mo ago`);

    }

    if (days > 0) {
        return (`${days} mo ago`);
    }

    if (hours > 0) {
        return (`${hours} h ago`);

    }

    else {
        return (`${minutes} mn ago`)
    }
}

function Feed() {
    const [result, setResult] = React.useState([]);
    const [doneToken] = useRecoilState(tokenAtom);
    const [filter, setFilter] = React.useState('new');
    const [hasLoaded, setHasLoaded] = React.useState(null);
    const [searchResult, setSearchResult] = useState([]);

    const handleSearchResult = (data) => {
        setSearchResult(data);
    };

    const getFeed = async () => {
        setResult([]); // reset the result state
        fetch('https://oauth.reddit.com/subreddits/mine/subscriber?limit=5', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + doneToken,
            }
        })
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                throw new Error("false");
            })
            .then(data => {
                const subreddits = data.data.children;
                //let results = []
                console.log(filter);
                subreddits.forEach(subreddit => {
                    let subredditName = subreddit.data.display_name_prefixed;
                    console.log(subredditName);
                    fetch(`https://oauth.reddit.com/${subredditName}/${filter}?limit=5`, {
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + doneToken,
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            data.data.children.forEach(
                                child => {
                                    setResult(result => [...result, child]);
                                }
                            );
                        })
                        .catch(error => console.error(error));
                });
                setHasLoaded(true);
                //console.log('end');
            })
            .catch(error => console.error(error));

    };

    React.useEffect(() => {
        getFeed();
    }, [filter]);




    return (
        hasLoaded ?
            <View style={{ height: windowHeight }}>
                <StatusBar style='auto' />
                <View style={{ zIndex: 9999 }}>
                    <Navbar onSearchResult={handleSearchResult} />
                </View>
                <FilterDropdown setFilter={setFilter} />
                <ScrollView style={{ backgroundColor: "#F5F5F8" }}>
                    <View>
                        {result ? result.map((child, index) => {
                            return (
                                <PostFeed
                                    subreddit={child.data.subreddit_name_prefixed}
                                    postheading={child.data.title}
                                    postcontent={child.data.selftext}
                                    subredditusername={child.data.author}
                                    time={formatTime(child.data.created)}
                                    key={index}
                                    id={child.data.id}
                                    folded={true}
                                    ups={child.data.ups}
                                    downs={child.data.downs}
                                    num_comments={child.data.num_comments}
                                  postData={child.data}
                                />);
                        }) : <Text>Loading...</Text>}
                    </View>
                </ScrollView>
            </View>
            : <Text>Loading...</Text>
    );






}

export default Feed;
