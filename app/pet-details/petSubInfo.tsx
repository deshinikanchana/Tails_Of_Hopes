import {View,Text,Image} from "react-native";
import PetSubInfoCard from "../../components/PetDetails/PetSubInfoCard";

export default function PetSubInfo({pet}){
    return(
        <View style={{
            paddingHorizontal: 20,
        }}>
            <View style={{
                display:'flex',
                flexDirection:'row',
            }}>
               <PetSubInfoCard icon={require('../../assets/images/age.png')}
               title={'Age'}
               value={`${pet?.age} Yrs`}/>
                <PetSubInfoCard icon={require('../../assets/images/sex.png')}
                title={'Gender'}
                value={pet?.sex}/>
            </View>

            <View style={{
                display:'flex',
                flexDirection:'row'
            }}>
                <PetSubInfoCard icon={require('../../assets/images/weight.png')}
                                title={'Weight'}
                                value={`${pet?.weight} Kg`}/>
                <PetSubInfoCard icon={require('../../assets/images/breed.png')}
                                title={'Breed'}
                                value={`${pet?.breed}`}/>
            </View>
        </View>
    )
}