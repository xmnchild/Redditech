import { Header } from "@rneui/themed";
import { Avatar } from "@rneui/themed";
import { Dimensions } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useState, useEffect } from "react";
import SearchableDropdown from "react-native-searchable-dropdown";
import { TouchableWithoutFeedback, Text } from "react-native";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

/*--------Recoil---------*/
import { useRecoilState } from "recoil";
import { tokenAtom } from "../helpers/UserState";

const Navbar = (props) => {
  const [doneToken] = useRecoilState(tokenAtom);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState("");
  const [subredditNames, setSubredditNames] = useState([]);
  const [isDropdownDisplayed, setIsDropdownDisplayed] = useState(false);
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

  const handleSearch = (query) => {
    if (!query) {
      setSubredditNames([]);
      setIsDropdownDisplayed(false);
    } else {
      fetch(`https://oauth.reddit.com/api/search_subreddits?query=${query}`, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + doneToken,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data["subreddits"]);
          var subredditssearch = data["subreddits"];
          const subredditNames = subredditssearch.map((subreddit) => {
            return {
              id: subreddit.name,
              name: "r/" + subreddit.name,
            };
          });
          console.log(subredditNames);
          setSubredditNames(subredditNames);
          props.onSearchResult(subredditssearch);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => setIsDropdownDisplayed(false)}>
      <Header
        backgroundColor="#ffff"
        placement="left"
        leftComponent={
          <Avatar
            size={32}
            rounded
            source={
              result
                ? { uri: result["subreddit"]["icon_img"].split("?")[0] }
                : require("../assets/img/fakeuser.png")
            }
            onPress={() => {
              navigation.navigate("Profile");
            }}
          />
        }
        leftContainerStyle={{ justifyContent: "center" }}
        centerComponent={
          <SearchableDropdown
            onTextChange={(query) => {
              setSearchQuery(query);
              handleSearch(query);
            }}
            onItemSelect={(item) => {
              navigation.navigate("Subreddit", { subreddit: item.name });
              setIsDropdownDisplayed(false);
            }}
            containerStyle={{
              position: "absolute",
              top: 0,
              backgroundColor: "transparent",
              borderTopWidth: 0,
              borderBottomWidth: 0,
              width: windowHeight / 3,
              zIndex: 9999,
            }}
            textInputStyle={{
              height: 30,
              paddingLeft: 10,
              backgroundColor: "#F5F5F8",
              zIndex: 9999,
            }}
            itemStyle={{
              padding: 10,
              backgroundColor: "#ffffff",
            }}
            itemTextStyle={{
              color: "#222",
              fontWeight: "bold",
            }}
            items={subredditNames}
            placeholder="Search..."
            resetValue={true}
            onDropdownShow={() => setIsDropdownDisplayed(true)}
            onDropdownClose={() => setIsDropdownDisplayed(false)}
          />
        }
        centerContainerStyle={{
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        rightComponent={
          <Icon
            name="settings-outline"
            size={28}
            onPress={() => {
              navigation.navigate("Settings");
            }}
          />
        }
        rightContainerStyle={{
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
        containerStyle={{
          height: windowHeight / 8,
          width: windowWidth,
          bottom: 25,
          justifyContent: "space-evenly",
        }}
      />
    </TouchableWithoutFeedback>
  );
};

export default Navbar;
