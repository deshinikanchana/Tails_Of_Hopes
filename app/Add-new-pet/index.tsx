import {
    View,
    Text,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Pressable,
    ToastAndroid
} from "react-native";
import {useNavigation} from "expo-router";
import {useEffect, useState} from "react";
import Colors from "../../constants/Colors";
import {Picker} from "@react-native-picker/picker";
import {collection, doc, getDocs, setDoc} from "@firebase/firestore";
import {db} from "../../config/FirebaseConfig";
import {useUser} from "@clerk/clerk-expo";

export default function AddNewPet(){
    const {user} = useUser();
    const navigation = useNavigation();
    const [formData,setFormData] = useState(
        {category:'Dog',sex:'Male'}
    );
    const [gender,setGender] = useState();
    const [categoryList,setCategoryList]=useState([]);
    const [selectedCategory,setSelectedCategory]=useState();

    useEffect(()=>{
        navigation.setOptions({
            headerTitle:'Add New Pet'
        })
        GetCategories();
    },[])

    const GetCategories=async ()=>{
        setCategoryList([]);
        const snapshot = await getDocs(collection(db,"Category"));
        snapshot.forEach((doc)=>{
            setCategoryList(categoryList=>[...categoryList,doc.data()]);
        })
    }

    const handleInputChange =(fieldName,fieldValue)=>{
        setFormData(prev=>({
            ...prev,
            [fieldName]:fieldValue
        }));
    }

    const onSubmit =()=>{
       if(Object.keys(formData).length!=9){
           ToastAndroid.show("Enter All Details",ToastAndroid.SHORT);
           return;
       }else {
           saveFormData();
       }
    }

    const saveFormData=async ()=>{
        const docId =Date.now().toString();
        await setDoc(doc(db,'Pets',docId),{
            ...formData,
            userName:user?.fullName,
            email:user?.primaryEmailAddress?.emailAddress,
            userImage:user?.imageUrl,
            id:docId,
        })
        if(saveFormData) {
            ToastAndroid.show("Pet Added Successfully", ToastAndroid.SHORT);
            navigation.goBack();
        }else{
            ToastAndroid.show("Something Wrong", ToastAndroid.SHORT);
        }
    }
    return (
        <ScrollView style={{
            padding:20,
        }}>

            <Text style={{
                fontFamily:'outfit-medium',
                fontSize:20
            }}>Add New Pet For Adoption</Text>
               <Image source={require('../../assets/images/placeholder.png')}
                    style={{
                        width:100,
                        height:100,
                        borderRadius:15,
                        borderWidth:1,
                        borderColor:Colors.GRAY,
                    }}/>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Name *</Text>
                <TextInput style={styles.input} onChangeText={(value=>handleInputChange('name',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Breed *</Text>
                <TextInput style={styles.input} onChangeText={(value=>handleInputChange('breed',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Image (Url) *</Text>
                <TextInput style={styles.input}
                           onChangeText={(value=>handleInputChange('imageUrl',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Pet Category *</Text>
                <Picker
                    selectedValue={selectedCategory}
                    style={styles.input}
                    onValueChange={(itemValue, itemIndex) =>{
                        setSelectedCategory(itemValue)
                        handleInputChange('category',itemValue)
                    }}>
                    {categoryList.map((category,index)=>(
                        <Picker.Item key={index} label={category.name} value={category.name} />
                    ))}
                </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Gender *</Text>
            <Picker
                selectedValue={gender}
                style={styles.input}
                onValueChange={(itemValue, itemIndex) =>{
                    setGender(itemValue)
                    handleInputChange('sex',itemValue)
                }}>
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Female" value="Female" />
            </Picker>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Age (Yrs) *</Text>
                <TextInput style={styles.input}
                           keyboardType="numeric"
                           onChangeText={(value=>handleInputChange('age',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Weight (Kg) *</Text>
                <TextInput style={styles.input}
                           keyboardType='numeric'
                           onChangeText={(value=>handleInputChange('weight',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Address *</Text>
                <TextInput style={styles.input} onChangeText={(value=>handleInputChange('address',value))}/>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>About *</Text>
                <TextInput style={styles.input} numberOfLines={5} multiline={true} onChangeText={(value=>handleInputChange('about',value))}/>
            </View>

            <TouchableOpacity style={styles.button} onPress={onSubmit}>
                <Text style={{
                    fontFamily:'outfit-medium',
                    textAlign:'center'
                }}>Submit</Text>
            </TouchableOpacity>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    inputContainer:{
        marginVertical:5,
    },
    input:{
        padding:10,
        backgroundColor:Colors.WHITE,
        borderRadius:7,
        fontFamily:'outfit',
    },
    label:{
        marginVertical:5,
        fontFamily:'outfit'
    },
    button:{
        padding:15,
        backgroundColor:Colors.PRIMARY,
        borderRadius:7,
        marginVertical:15,
        marginBottom:50
    }
})