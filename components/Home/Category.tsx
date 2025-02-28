import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from "react-native";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "../../config/FirebaseConfig";
import {useEffect, useState} from "react";
import Colors from '../../constants/Colors'

export default function Category({category}){
    const [categoryList,setCategoryList]=useState([]);
    const [selectedCategory,setSelectedCategory]=useState("Cat");

    useEffect(() => {
        GetCategories();
    }, []);

    const GetCategories=async ()=>{
        setCategoryList([]);
        const snapshot = await getDocs(collection(db,"Category"));
        snapshot.forEach((doc)=>{
            setCategoryList(categoryList=>[...categoryList,doc.data()]);
        })
    }

    return (
        <View style={{
            marginTop:20
        }}>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:20
            }}>Category</Text>

            <FlatList
            data={categoryList}
            numColumns={4}
            renderItem={({item,index})=>(
                <TouchableOpacity
                    onPress={()=> {
                        setSelectedCategory(item.name);
                        category(item.name);
                    }}
                    style={{
                    flex:1,
                    marginTop:10
                }}>
                    <View style={[styles.container,selectedCategory==item.name&&styles.selectedCategoryContainer]}>
                        <Image source={{uri:item?.imageUrl}}
                        style={{
                            width:'80%',
                            height:50,
                            borderRadius:15,
                            objectFit:'cover'
                        }}/>
                    </View>
                    <Text
                    style={{
                        textAlign:'center',
                        fontFamily:'outfit',
                        marginTop:5
                    }}>{item?.name}</Text>
                </TouchableOpacity>
                )}>
            </FlatList>
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        alignItems:"center",
        backgroundColor:Colors.LIGHT_PRIMARY,
        borderRadius:15,
        padding:5,
        margin:10
    },
    selectedCategoryContainer:{
        backgroundColor:Colors.SECONDARY,
    }
})