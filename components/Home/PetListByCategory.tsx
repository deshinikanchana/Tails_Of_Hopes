import {View, Text, FlatList} from "react-native";
import Category from "../../components/Home/Category";
import {collection, getDoc, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../config/FirebaseConfig";
import {useEffect, useState} from "react";
import PetListItem from "../../components/Home/PetListItem";
import Colors from "../../constants/Colors";

export default function PetListByCategory(){

    const [petList,setPetList] = useState([]);
    const [loader,setLoader] = useState(false);

    useEffect(()=>{
        GetPetList('Cat');
    },[])

    const GetPetList=async  (category)=>{
        setLoader(true);
        setPetList([]);
        const q=query(collection(db,'Pets'),where('category','==', category))
        const querySnapShots = await getDocs(q);

        querySnapShots.forEach((doc)=>{
            setPetList(petList=>[...petList,doc.data()]);
        })
        setLoader(false);
    }

    return (
        <View>
            <Category category={(value)=>GetPetList(value)}/>
            <FlatList
            data={petList}
            style={{marginTop:10}}
            horizontal={true}
            refreshing={loader}
            onRefresh={()=>GetPetList('Cat')}
            renderItem={({item,index})=>(
                <PetListItem pet={item}/>
            )}></FlatList>
        </View>
    )
}