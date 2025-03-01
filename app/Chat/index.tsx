import {useLocalSearchParams, useNavigation} from "expo-router";
import {db} from "../../config/FirebaseConfig";
import {doc, getDoc} from "@firebase/firestore";
import {useEffect, useState} from "react";
import {useUser} from "@clerk/clerk-expo";
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen(){
    const params = useLocalSearchParams();
    console.log(params)
    const {user} = useUser();
    const navigation = useNavigation();
    const [messages, setMessages] = useState([])

    useEffect(() => {
       GetUserDetails();
    },[])

    const GetUserDetails=async()=>{
        const docRef = doc(db,'Chat',params?.id)
        const docSnaps = await getDoc(docRef);

        const result = docSnaps.data();
        console.log(result)
        const otherUsers = result?.users.filter(item=>item.email!=user?.primaryEmailAddress?.emailAddress)
        console.log(otherUsers)
        navigation.setOptions({
            headerTitle:otherUsers[0].name,
        })
    }

    const onSend=(message)=>{

    }

    return (
        <GiftedChat
            messages={messages}
            onSend={messages => onSend(messages)}
            user={{
                _id: 1,
            }}
        />
        // <View>
        //     <Text>Hello</Text>
        // </View>
    )
}