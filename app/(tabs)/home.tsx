import {View, StyleSheet, TouchableOpacity} from "react-native";
import {Text} from "react-native";
import Header from "@/components/Home/Header";
import Slider from "@/components/Home/Slider";
import PetListByCategory from "@/components/Home/PetListByCategory";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Colors from "../../constants/Colors";

export default function Home(){
    return (
        <View style={{
            paddingTop: 20,
            marginTop:20
        }}>
            <Header/>
            <Slider/>
            <PetListByCategory/>
            <TouchableOpacity style={styles.addNewPetContainer}>
                <MaterialIcons name="pets" size={24} color="black" />
                <Text style={{
                    fontFamily:'outfit-medium',
                    fontSize:18
                }}>Add A New Pet
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    addNewPetContainer:{
        display:'flex',
        flexDirection:'row',
        gap:10,
        alignItems:'center',
        padding:20,
        marginTop:20,
        backgroundColor:Colors.LIGHT_PRIMARY,
        borderWidth:1,
        borderColor:Colors.PRIMARY,
        borderRadius:15,
        borderStyle:'dashed',
        justifyContent:'center'
    }
})