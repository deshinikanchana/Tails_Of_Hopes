import {View, Text, Image, Pressable} from "react-native";
import React, {useCallback, useEffect} from 'react';
import Colors from '../../constants/Colors'
import * as WebBrowser from 'expo-web-browser'
import * as AuthSession from 'expo-auth-session'
import {useClerk, useOAuth, useSSO} from '@clerk/clerk-expo'
import Linking from 'expo-linking'
import home from '../(tabs)/home'

export const useWarmUpBrowser = () => {
    useEffect(() => {
        // Preloads the browser for Android devices to reduce authentication load time
        // See: https://docs.expo.dev/guides/authentication/#improving-user-experience
        void WebBrowser.warmUpAsync()
        return () => {
            // Cleanup: closes browser when component unmounts
            void WebBrowser.coolDownAsync()
        }
    }, [])
}

// Handle any pending authentication sessions
WebBrowser.maybeCompleteAuthSession()

export default function LoginScreen(){
    useWarmUpBrowser()
    const { signOut, session } = useClerk();

    const { startSSOFlow } = useSSO()

    const onPress = useCallback(async () => {
        try {

            if (session) {
                console.log('Session already exists', session);
                await signOut(); // Sign out the user if a session already exists
            }

            // Start the authentication process by calling `startSSOFlow()`
            const { createdSessionId, setActive, signIn, signUp } = await startSSOFlow({
                strategy: 'oauth_google',
                // Defaults to current path
                redirectUrl: AuthSession.makeRedirectUri({
                    path: '/(tabs)/home',
                }),
            })

            // If sign in was successful, set the active session
            if (createdSessionId) {

            } else {
                // If there is no `createdSessionId`,
                // there are missing requirements, such as MFA
                // Use the `signIn` or `signUp` returned from `startSSOFlow`
                // to handle next steps
            }
        } catch (err) {
            // See https://clerk.com/docs/custom-flows/error-handling
            // for more info on error handling
            console.log(JSON.stringify(err, null, 2))
        }
    }, [session,signOut])



    return (
        <View style={{
            backgroundColor:Colors.WHITE,
            height:'100%',
        }}>
            <Image source={require('../../assets/images/Adopt_me_1.jpeg')}
            style={{
                width: '100%;',
                height:500,
            }}
            />
            <View style={{
                padding:20,
                display:'flex',
                alignItems:'center'
            }}>
                <Text style={{
                    fontFamily:'outfit-bold',
                    fontSize:30,
                    textAlign:'center'
                }}>Ready To Make A New Friend ?</Text>
                <Text style={{
                    fontFamily:'outfit',
                    fontSize:18,
                    textAlign:'center',
                    color:Colors.GRAY
                }}>Let's Adopt The Pet Which You Like And Make There Life Happy Again</Text>
                <Pressable
                    onPress={onPress}
                    style={{
                    padding:14,
                    marginTop:100,
                    backgroundColor:Colors.PRIMARY,
                    width:'100%',
                    borderRadius:14
                }}>
                    <Text style={{
                        fontFamily:'outfit-medium',
                        fontSize:20,
                        textAlign:'center'
                    }}>Get Started</Text>
                </Pressable>

            </View>
        </View>
    )
}