import {View, Text, Animated, ScrollView, TouchableOpacity, StyleSheet} from "react-native";
import {useLocalSearchParams, useNavigation, useRouter} from "expo-router";
import {useEffect} from "react";
import PetInfo from "../../components/PetDetails/petInfo";
import PetSubInfo from "../../app/pet-details/petSubInfo";
import AboutPet from "../../components/PetDetails/AboutPet";
import OwnerInfo from "../../components/PetDetails/OwnerInfo";
import Colors from "../../constants/Colors";
import {useUser} from "@clerk/clerk-expo";
import {db} from "../../config/FirebaseConfig";
import {collection, doc, getDocs, query, setDoc, where} from "@firebase/firestore";

export default function PetDetails(){
    const pet =useLocalSearchParams();
    const navigation = useNavigation();
    const {user} = useUser();
    const router = useRouter();

    useEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle:' '
        })
    },[navigation])


    const InitiateChat=async ()=>{
        if (!pet?.email || !pet?.userName || !user?.primaryEmailAddress?.emailAddress) {
            console.error("Incomplete data for chat initiation");
            return;
        }else{
            const docId1 = user?.primaryEmailAddress?.emailAddress+'_'+pet.email;
            const docId2 = pet.email+'_'+user?.primaryEmailAddress?.emailAddress;


            const q=query(collection(db,'Chat'),where('id','in',[docId1,docId2]));
            const querySnapShots = await getDocs(q);

            querySnapShots.forEach(doc=>{
                console.log(doc.data())
                router.push({
                    pathname:'/Chat',
                    params:{id:doc.id}
                })
            })

            if (querySnapShots.docs?.length==0){
                await setDoc(doc(db,'Chat',docId1),{
                    id:docId1,
                    users:[
                        {
                            email:user?.primaryEmailAddress?.emailAddress,
                            imageUrl:user?.imageUrl,
                            name:user?.fullName,
                        },
                        {
                            email:pet?.email,
                            imageUrl:pet?.userImage,
                            name:pet?.userName,

                        }
                    ],
                    userIds:[user?.primaryEmailAddress?.emailAddress,pet?.email]
                })
                router.push({
                    pathname:'/Chat',
                    params:{id:docId1}
                })
            }
        }
    }

    return (
        <View>
            <ScrollView>
                <PetInfo pet={pet} />
                <PetSubInfo pet={pet} />
                <AboutPet pet={pet} />
                <OwnerInfo pet={pet} />
                <View style={{
                    height:70
                }}>
                </View>
                <View style={styles.bottomContainer}>
                    <TouchableOpacity onPress={InitiateChat} style={styles.adoptBtn}>
                        <Text style={{
                            fontFamily:'outfit-medium',
                            fontSize:20,
                            textAlign:'center'
                        }}>Adopt Me</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    adoptBtn: {
        padding:15,
        backgroundColor:Colors.PRIMARY,
    },
    bottomContainer:{
        position:"absolute",
        width:"100%",
        bottom:0,

    }
})