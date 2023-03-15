import {Text,View,Dimensions} from 'react-native';
import Icon from "react-native-vector-icons/Ionicons";

const windowWidth = Dimensions.get('window').width;

const FooterPost = () => {
    return (
        <View style={{
            justifyContent: "space-around", flexDirection: "row", width: windowWidth, paddingLeft: 15,
            paddingRight: 10,
            paddingBottom: 10
        }}>
            <View style={{}}>
                <View style={{
                    flexDirection: "row", paddingLeft: 10
                }}>
                    <Icon name='arrow-up-outline'
                        size={20}></Icon>
                    <Text style={{ fontSize: 14 }}>3.6k</Text>
                    <Icon name='arrow-down-outline'
                        size={20}></Icon>
                </View>
            </View>
            <View style={{
                paddingLeft: 15,
                paddingRight: 10,
                paddingBottom: 10,
                width: windowWidth,
                justifyContent: "flex-start",
                alignItems: "flex-start",
                flexDirection: "row"
            }}>
                <View style={{ paddingLeft: 120 }}>
                    <View style={{
                        justifyContent: "space-between", flexDirection: "row", alignContent: "space-around"
                    }}>
                        <Icon name='mail-outline'
                            size={20}></Icon>
                        <Text style={{ fontSize: 14, paddingLeft: 5 }}>200</Text>
                    </View>
                </View>
                <View style={{ paddingLeft: 120 }}>
                    <View style={{
                        justifyContent: "space-between", flexDirection: "row", alignContent: "space-around"
                    }}>
                        <Icon name='share-outline'
                            size={20}></Icon>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default FooterPost;