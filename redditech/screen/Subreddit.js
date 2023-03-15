import { StatusBar } from 'expo-status-bar';
import { View, Dimensions, Text, ImageBackground, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Avatar, Header, Button } from "@rneui/themed";
import { LinearGradient } from 'expo-linear-gradient';
import PostFeed from '../components/PostFeed';
import Icon from "react-native-vector-icons/Ionicons";
import { Divider } from 'react-native-elements';
import { formatTime } from '../components/Feed';
import { Alert } from 'react-native'
import { useNavigation, useRoute } from "@react-navigation/native";
import * as React from "react";
/*--------Recoil---------*/
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";
const windowHeight = Dimensions.get('window').height;
function Feed() {
    const [result, setResult] = React.useState([]);
    const [info, setInfo] = React.useState();
    const [doneToken] = useRecoilState(tokenAtom);
    const [filter, setFilter] = React.useState('hot');
    const [hasLoaded, setHasLoaded] = React.useState(null);
    const [last, setLast] = React.useState();
    const [isLoading, setIsLoading] = React.useState();
    const route = useRoute();
    const navigation = useNavigation();
    const { subreddit } = route.params;
    console.log(subreddit);
    const getInfo = async () => {
        console.log("subreddit vasy frr")

        console.log(subreddit)
        fetch(`https://www.reddit.com/${subreddit}/about.json`, {
            method: 'GET',
        })
            .then(response => {
                console.log(response.status);
                return response.json();
            })
            .then(data => {
                setInfo(data.data);
                console.log(data);

                // Check if user is subscribed
                fetch(`https://oauth.reddit.com/${subreddit}/about.json`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${doneToken}`,
                    },
                })
                    .then(response => {
                        if (response.status === 200) {
                            return response.json();
                        } else {
                            throw new Error('Failed to get subscription status');
                        }
                    })
                    .then(data => {
                        setInfo(info => ({
                            ...info,
                            user_is_subscribed: data.data.user_is_subscriber
                        }));
                    })
                    .catch(error => {
                        console.error(error);
                    });
            })
            .catch(error => console.error(error));
        ;
    };
    const getFeed = async () => {
        console.log("sub: " + subreddit);
        fetch(`https://oauth.reddit.com/${subreddit}/${filter}?after=${last}&limit=5`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + doneToken,
            }
        })
            .then(response => response.json())
            .then(data => {
                data.data.children.forEach((child) => {
                    setResult(result => [...result, child]);
                });
                //setResult(data.data.children);
                var lastChild = data.data.children[data.data.children.length - 1];
                setLast(lastChild.kind + '_' + lastChild.data.id);
                console.log("last: " + last);
                console.log(data.data.children[data.data.children.length - 1]);
                setHasLoaded(true);
                setIsLoading(false);
            })
            .catch(error => console.error(error));
    };
    const subscribeToSubreddit = () => {
        Alert.alert(
            `Subscribe to ${subreddit}`,
            'Are you sure you want to subscribe to this subreddit?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Subscribe',
                    onPress: () => {
                        fetch(`https://oauth.reddit.com/api/subscribe?action=sub&sr_name=${subreddit}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${doneToken}`,
                            }
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    Alert.alert(
                                        'Success',
                                        `You are now subscribed to ${subreddit}`,
                                        [
                                            {
                                                text: 'OK'
                                            }
                                        ]
                                    );
                                    setInfo(info => ({
                                        ...info,
                                        user_is_subscribed: true

                                    }));
                                } else {
                                    throw new Error('Failed to subscribe');
                                }
                            })
                            .catch(error => {
                                Alert.alert(
                                    'Error',
                                    'Failed to subscribe',
                                    [
                                        {
                                            text: 'OK'
                                        }
                                    ]
                                );
                                console.error(error);
                            });
                    }
                }
            ]
        );
    };
    const unsubscribeFromSubreddit = () => {
        Alert.alert(
            `Unsubscribe from ${info.title}`,
            'Are you sure you want to unsubscribe from this subreddit?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Unsubscribe',
                    onPress: () => {
                        fetch(`https://oauth.reddit.com/api/subscribe?action=unsub&sr_name=${subreddit}`, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${doneToken}`,
                            },
                        })
                            .then(response => {
                                if (response.status === 200) {
                                    Alert.alert(
                                        'Success',
                                        `You are now unsubscribed to ${info.title}`,
                                        [
                                            {
                                                text: 'OK'
                                            }
                                        ]
                                    );
                                    setInfo(info => ({
                                        ...info,
                                        user_is_subscribed: false

                                    }));
                                } else {
                                    throw new Error('Failed to unsubscribe from subreddit');
                                }
                            })
                            .catch(error => {
                                console.error(error);
                            });
                    }
                }
            ]
        );
    };
    React.useEffect(() => {
        getFeed();
        getInfo();
    }, [filter]);
    return (
        hasLoaded ?
            <View style={{ height: windowHeight }}>
                <StatusBar style='auto' />
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
                        <Text style={{ marginLeft: 10, fontWeight: '500', fontSize: 16, color: 'white' }}>
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
                        height: (windowHeight / 7),
                        borderColor: 'black',
                        elevation: 2
                    }}
                />
                <ScrollView
                    style={{ backgroundColor: "#F5F5F8" }}
                    onScroll={({ nativeEvent }) => {
                        const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
                        const isEndReached = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50;
                        if (isEndReached && !isLoading) {
                            setIsLoading(true);
                            getFeed();
                        }
                    }}
                >
                    <View>
                        <ImageBackground
                            imageStyle={{ opacity: 1, resizeMode: 'cover', height: '60%' }}
                            source={
                                info && info['banner_background_image']
                                    ? { uri: info['banner_background_image'].split('?')[0] }
                                    : require("../assets/img/black-layout.png")
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
                                    source={info ? { uri: info.community_icon.split('?')[0] } : null}
                                    avatarStyle={{ borderWidth: 5, borderColor: 'white', position: 'absolute', zIndex: 1000 }}
                                />
                                <View style={{ backgroundColor: 'white', padding: 10, zIndex: 1000 }}>
                                    <Text style={styles.username}>{info && info.title}</Text>
                                    <Text style={styles.smallText}>{info ? info.display_name_prefixed : null}</Text>
                                    <Divider width={15} color="white"></Divider>
                                    <Text style={styles.smallText}>{info && info.subscribers} members</Text>
                                    <Text style={styles.smallText}>{info && info.public_description}</Text>
                                </View>
                                <View style={{ backgroundColor: 'white', justifyContent: 'center', alignItems: "center" }}>
                                    <Button
                                        title={info.user_is_subscribed ? 'Joined' : 'Subscribe'}
                                        buttonStyle={{
                                            backgroundColor: info.user_is_subscribed ? '#000000' : '#FF4500',
                                            borderRadius: 30,
                                            width: '100%',
                                            marginBottom: 10
                                        }}
                                        titleStyle={{ fontWeight: 'bold', fontSize: 15, color: info.user_is_subscribed ? '#FF4500' : '#FFFFFF' }}
                                        onPress={info.user_is_subscribed ? unsubscribeFromSubreddit : subscribeToSubreddit}

                                    />
                                </View>
                                <Divider width={2} color="#F5F5F8"></Divider>

                            </LinearGradient>
                        </ImageBackground>
                    </View>
                    <View>

                        {result ? result.map((child, index) => {
                            return (
                                <PostFeed
                                    subreddit={child.data.subreddit_name_prefixed}
                                    postheading={child.data.title}
                                    postcontent={child.data.selftext}
                                    time={formatTime(child.data.created)}
                                    key={index}
                                    id={child.data.id}
                                    folded={true}
                                />);
                        }) : <Text>Loading...</Text>}
                    </View>
                </ScrollView>
            </View>
            : <Text>Loading...</Text>
    );
}
const styles = StyleSheet.create({
    username: {
        fontSize: 20,
        color: 'black',
        fontWeight: "500"
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
    },
});

export default Feed;
