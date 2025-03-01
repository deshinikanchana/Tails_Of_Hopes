import {View, Text, FlatList} from "react-native";
import Shared from '../../Shared/Shared'
import {useUser} from "@clerk/clerk-expo";
import {useEffect, useState} from "react";
import {collection, getDocs, query, where} from "@firebase/firestore";
import {db} from "../../config/FirebaseConfig";
import PetListItem from "../../components/Home/PetListItem";

export default function Favourite() {

    const {user} = useUser();
    const [favIds, setFavIds] = useState([]);
    const [favPetList, setFavPetList] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        user&&GetFavPetIds()
    },[user])
    const GetFavPetIds =async()=>{
        setLoader(true);
       const result = await Shared.GetFevList(user);
       setFavIds(result?.favourites);
       GetFavPetList(result?.favourites);
       setLoader(false);
    }

    const GetFavPetList = async(favId_)=>{
        setLoader(true);
        setFavPetList([])
        const q =query(collection(db,'Pets'),where('id','in',favId_));
        const querySnapShots = await getDocs(q);

        querySnapShots.forEach(doc=>{
            console.log(doc.data())
            setFavPetList(prev=>[...prev,doc.data()])
        })
        setLoader(false);
    }

    return (
        <View style={{
            padding:20,
            marginTop:20,
        }}>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:30
            }}>Favourites</Text>
            <FlatList
            data={favPetList}
            numColumns={2}
            onRefresh={GetFavPetIds}
            refreshing={loader}
            renderItem={({item,index})=>(
                <View>
                    <PetListItem pet={item}/>
                </View>
            )}>

            </FlatList>

        </View>
    )
}