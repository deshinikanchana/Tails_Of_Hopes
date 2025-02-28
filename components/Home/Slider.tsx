import {View, FlatList, Image, StyleSheet, Dimensions} from "react-native";
import {collection, getDocs} from "@firebase/firestore";
import {db} from "../../config/FirebaseConfig";
import {useEffect, useState} from "react";

export default function Slider() {

    const[sliderList, setSliderList] = useState([]);

    useEffect(()=>{
            GetSliders()
    },[])
    const GetSliders= async()=>{
        setSliderList([]);
        const snapShot = await getDocs(collection(db,"Sliders"));
        snapShot.forEach((doc)=>{
            console.log(doc.data());
            setSliderList(sliderList=>[...sliderList,doc.data()]);
        })
    }
    return (
        <View
        style={{
            marginTop:15
        }}>
            <FlatList
            data={sliderList}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({item,index})=>(
                <View>
                    <Image source={{uri:item?.imageUrl}}
                           style={styles?.sliderImage}/>
                </View>
            )}/>
        </View>
    )
}

const styles = StyleSheet.create({
    sliderImage:{
        width:Dimensions.get("screen").width*0.9,
        height:170,
        borderRadius:15,
        marginRight:15
    }
})