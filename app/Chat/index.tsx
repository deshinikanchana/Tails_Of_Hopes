import { useLocalSearchParams, useNavigation } from "expo-router";
import { db } from "../../config/FirebaseConfig";
import {doc, getDoc, collection, query, orderBy, onSnapshot, addDoc} from "@firebase/firestore";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import moment from "moment";
import Colors from "../../constants/Colors";

export default function ChatScreen() {
    const params = useLocalSearchParams();
    const { user } = useUser();
    const navigation = useNavigation();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    // Set chat title based on other user
    useEffect(() => {
        GetUserDetails();
        const unsubscribe = setupMessageListener();
        return unsubscribe; // Clean up on unmount
    }, []);

    const GetUserDetails = async () => {
        const docRef = doc(db, 'Chat', params?.id);
        const docSnaps = await getDoc(docRef);
        const result = docSnaps.data();
        const otherUsers = result?.users.filter(item => item.email !== user?.primaryEmailAddress?.emailAddress);

        if (otherUsers?.[0]) {
            navigation.setOptions({
                headerTitle: otherUsers[0].name,
            });
        }
    };

    // Setup Firestore listener for real-time message updates
    const setupMessageListener = () => {
        const messagesRef = collection(db, 'Chat', params?.id, 'messages');
        const q = query(messagesRef, orderBy('createdAt', 'asc'));

        const unsubscribe = onSnapshot(q, snapshot => {
            const fetchedMessages = snapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    _id: doc.id,
                    text: data.text,
                    createdAt: data.createdAt?.toDate(),
                    user: data.user,
                };
            });

            setMessages(fetchedMessages);
        });

        return unsubscribe;
    };

    // Send a new message
    const onSendMessage = async () => {
        if (newMessage.trim()) {
            const message = {
                text: newMessage,
                createdAt: new Date(),
                user: {
                    _id: user?.primaryEmailAddress?.emailAddress, // Use email as user ID
                    name: user?.fullName,
                },
            };

            await addDoc(collection(db,'Chat',params?.id,'messages'),newMessage[0]);

            setNewMessage('');
        }
    };

    const formatTime = (createdAt) => {
        return moment(createdAt).fromNow();
    };
    // Render message item
    const renderMessage = ({ item }) => {
        return (
            <View style={styles.messageContainer}>
                <Text style={styles.messageSender}>{item.user.name}</Text>
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>{formatTime(item.createdAt)}</Text>
            </View>
        );
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                data={messages}
                renderItem={renderMessage}
                keyExtractor={(item) => item._id}
                inverted
                contentContainerStyle={styles.messagesContainer}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Type a message..."
                    style={styles.input}
                />
                <TouchableOpacity onPress={onSendMessage} style={styles.sendButton}>
                    <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

// Styling
const styles = StyleSheet.create({
    messagesContainer: {
        paddingBottom: 10,
        paddingTop: 10,
    },
    messageContainer: {
        padding: 10,
        marginBottom: 10,
        backgroundColor: Colors.SECONDARY,
        borderRadius: 15,
        marginHorizontal:20,
        maxWidth: '80%', // Set a max width, adjust as needed
        alignSelf: 'flex-start',
    },
    messageSender: {
        fontFamily:'outfit-bold',
        fontSize: 16,
    },
    messageText: {
        fontFamily:'outfit',
        fontSize: 15,
    },
    messageTime:{
        fontFamily:'outfit',
        fontSize:12,
    },
    inputContainer: {
        flexDirection: 'row',
        padding: 10,
        borderTopWidth: 1,
        borderColor: Colors.GRAY,
        backgroundColor: Colors.WHITE,
    },
    input: {
        flex: 1,
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.GRAY,
        borderRadius: 5,
        fontFamily:'outfit',
    },
    sendButton: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.SECONDARY,
        marginLeft: 10,
        padding: 10,
        borderRadius: 5,
    },
    sendButtonText: {
        color: Colors.WHITE,
        fontSize: 16,
    },
});
