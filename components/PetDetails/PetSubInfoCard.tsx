import {View, Text, Image} from "react-native";
import Colors from "../../constants/Colors";

export default function PetSubInfoCard({icon,title="Default Title",value ="-"}){

    return (
        <View style={{
            display:'flex',
            flexDirection:'row',
            alignItems:'center',
            backgroundColor:Colors.WHITE,
            padding:10,
            margin:5,
            borderRadius:8,
            gap:30,

        }}>
            <Image source={icon}
                   style={{
                       width:40,
                       height:40,
                   }}/>
            <View>
                <Text style={{
                    fontFamily:'outfit',
                    fontSize:16,
                    color:Colors.GRAY,
                    marginBottom:5
                }}>{title}</Text>

                <Text style={{
                    fontFamily:'outfit-medium',
                    fontSize:20
                }}>
                    {value}
                </Text>
            </View>
        </View>
    )
}