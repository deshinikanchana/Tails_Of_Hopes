import { Stack } from "expo-router";
import {useFonts} from "expo-font";
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo'
import {TokenCache} from "@clerk/clerk-expo/dist/cache";
import * as SecureStore from 'expo-secure-store'
import { Platform } from 'react-native'


const createTokenCache = (): TokenCache => {
    return {
        getToken: async (key: string) => {
            try {
                const item = await SecureStore.getItemAsync(key)
                if (item) {
                    console.log(`${key} was used 🔐 \n`)
                } else {
                    console.log('No values stored under key: ' + key)
                }
                return item
            } catch (error) {
                console.error('secure store get item error: ', error)
                await SecureStore.deleteItemAsync(key)
                return null
            }
        },
        saveToken: (key: string, token: string) => {
            return SecureStore.setItemAsync(key, token)
        },
    }
}

// SecureStore is not supported on the web
export const tokenCache = Platform.OS !== 'web' ? createTokenCache() : undefined

export default function RootLayout() {

    useFonts({
        'outfit': require('../assets/fonts/Outfit-Regular.ttf'),
        'outfit-medium': require('../assets/fonts/Outfit-Medium.ttf'),
        'outfit-bold': require('../assets/fonts/Outfit-Bold.ttf')
    })
    const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

    if (!publishableKey) {
        throw new Error(
            'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
        )
    }

    return(
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <Stack>
        <Stack.Screen name="index"/>
          <Stack.Screen name="(tabs)" options={{headerShown: false}}/>
          <Stack.Screen name="login/index"
          options={{headerShown: false}}/>
      </Stack>
      </ClerkProvider>
  )
}
