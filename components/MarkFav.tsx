import {View, Text, Pressable} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import {useEffect, useState} from "react";
import Shared from '../Shared/Shared'
import {useUser} from "@clerk/clerk-expo";

export default function MarkFav({pet}){
    const {user} = useUser();
    const [favList, setFavList] = useState([]);
    useEffect(()=>{
        user&&GetFav()
    },[user])

    const GetFav=async ()=>{
        const result = await Shared.GetFevList(user);
        console.log(result)
        setFavList(result?.favourites?result?.favourites:[])
    }

    const AddToFav=async ()=>{
        const favResult =favList;
        favResult.push(pet.id);
        await Shared.UpdateFav(user,favResult);
        GetFav()
    }

    const RemoveFromFav=async ()=>{
        const favResult =favList.filter(item=>item!==pet.id);
        await Shared.UpdateFav(user,favResult);
        GetFav()
    }
    return (
        <View>
            {favList?.includes(pet.id)?<Pressable onPress={()=>RemoveFromFav()}>
            <AntDesign name="heart" size={30} color="red" />
        </Pressable>:
            <Pressable onPress={()=>AddToFav()}>
                <AntDesign name="hearto" size={30} color="black" />
            </Pressable>}
        </View>
    )
}