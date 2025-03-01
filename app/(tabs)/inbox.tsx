import {View, Text, FlatList} from "react-native";
import {db} from "@/config/FirebaseConfig";
import {collection, doc, getDocs, query, where} from "@firebase/firestore";
import {useUser} from "@clerk/clerk-expo";
import {useEffect, useState} from "react";
import UserItem from "../../components/Inbox/UserItem";

export default function Inbox(){
    const {user} = useUser();
    const [userList, setUserList] = useState([]);

    useEffect(() => {
        user&&GetUserList()
    },[user])

    const GetUserList =async ()=>{
        setUserList([])
        const q=query(collection(db,'Chat'),where('userIds','array-contains',user?.primaryEmailAddress?.emailAddress))
        const querySnapShots=await getDocs (q);

        querySnapShots.forEach((doc)=>{
            setUserList(prevList=>[...prevList,doc.data()])
        })
    }

    const MapOtherUserList =async ()=>{
        const list =[]
        userList.forEach(rec=>{
            const otherUser=rec.users?.filter(user=>user?.email!=user?.primaryEmailAddress?.emailAddress)
            const result ={
                docId:rec.id,
                ...otherUser[0]
            }
            list.push(result)
        })
        return list;
    }


    return (
        <View style={{
            padding:20,
            marginTop:20
        }}>
            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:30
            }}>Inbox</Text>

            <FlatList
                data={MapOtherUserList()}
                renderItem={({item,index})=>(
                    <UserItem userInfo={item} key={index}/>
                )}
            />
        </View>
    )
}