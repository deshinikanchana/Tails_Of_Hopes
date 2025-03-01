import {View, Text, Pressable} from "react-native";
import Colors from "../../constants/Colors";
import {useState} from "react";

export default function AboutPet({pet}){
    const [readMore, setReadMore] = useState(true);
    return (
        <View style={{
            padding:20,
        }}>
            <Text numberOfLines={readMore?3:20} style={{
                fontFamily:'outfit-medium',
                fontSize:20
            }}>About {pet?.name}</Text>

            <Text style={{
                fontFamily:'outfit',
                fontSize:14,
            }}>{pet?.about}</Text>
            <Pressable onPress={() => setReadMore(false)}>
            {readMore && <Text style={{
                fontFamily:'outfit-medium',
                fontSize:14,
                color:Colors.SECONDARY
            }}>Read More</Text>}
            </Pressable>
        </View>
    )
}