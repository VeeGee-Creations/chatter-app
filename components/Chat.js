import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, LogBox, AsyncStorage } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, Time, InputToolbar } from 'react-native-gifted-chat';
import firebase from 'firebase';
import 'firebase/firestore';
import { v4 as uuid } from 'uuid';
import NetInfo from '@react-native-community/netinfo';

import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [uid, setUid] = useState('');
    const [connectStat, setConnectStat] = useState(false);
    
    const { background, user } = props.route.params;
    const { navigation } = props;
    const leftBubble = '#B266B2';
    const rightBubble = '#800080';
    const firebaseConfig = {
        apiKey: "AIzaSyCG-9X8Hk8NjSaGummw3CHUWGuqh0grAzk",
        authDomain: "chatter-93fe6.firebaseapp.com",
        projectId: "chatter-93fe6",
        storageBucket: "chatter-93fe6.appspot.com",
        messagingSenderId: "288386549979"
    };
    
    // ignore firebase timeout warning in react native
    LogBox.ignoreLogs(['Setting a timer']);

    if(!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
    }
    
    const referenceChatMessages = firebase.firestore().collection('messages');

    useEffect(() => {
        // display username in title
        navigation.setOptions({ title: user});

        // get messages from firestore if online
        checkConnection();

        //get messages from local storage
        const getMessages = async () => {
            let messages;
            try {
                messages = await AsyncStorage.getItem('messages') || [];
                setMessages(JSON.parse(messages));
            } catch(error) {
                console.error(error.message);
            }
        };
        if(connectStat === false ) getMessages();

        const authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
            // anon signin
            if (!user) {
                firebase.auth().signInAnonymously();
            }
            setUid(user.uid);
            setMessages([]);
            
            // get messages
            const unsubscribe = referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(onCollectionUpdate);
            unsubscribe();
        })

        // announce arrival
        referenceChatMessages.add({
            _id: uuid(),
            text: `${user} has entered chat.`,
            createdAt: new Date(),
            system: true,
        });

        //get messages
        const unsubscribe = referenceChatMessages
            .orderBy('createdAt', 'desc')
            .onSnapshot(onCollectionUpdate);

        // unmount cleanup
        return () => {
            // announce departure
            referenceChatMessages.add({
                _id: uuid(),
                text: `${user} has left chat.`,
                createdAt: new Date(),
                system: true,
            });
            authUnsubscribe();
            unsubscribe();
        }
    }, []);

    //check connection status
    const checkConnection = () => {
        NetInfo.fetch().then(connection => {
            setConnectStat(connection.isConnected);
        });
    };

    //get messages from local storage
    const getMessages = async () => {
        let messages;
        try {
            messages = await AsyncStorage.getItem('messages') || [];
            setMessages(JSON.parse(messages));
        } catch(error) {
            console.error(error.message);
        }
    };

    //save messages to local storage
    const saveMessages = async (messages) => {
        try {
            await AsyncStorage.setItem('messages', JSON.stringify(messages));
        } catch(error) {
            console.error(error.message);
        }
    };

    const onCollectionUpdate = (querySnapshot) => {
        const messages = [];
        //go through each document
        querySnapshot.forEach((doc) => {
            //get the QueryDocumentSnapshot's data
            let data = doc.data();

            // push system messages
            
            if(data.system){
                messages.push({
                    _id: data._id,
                    text: data.text,
                    createdAt: data.createdAt.toDate(),
                    system: data.system,
                });
            } else { // push messages
                messages.push({
                    _id: data._id,
                    createdAt: data.createdAt.toDate(),
                    text: data.text,
                    user: {
                        _id: data.user._id,
                        name: data.user.name,
                        avatar: data.user.avatar
                    },
                    location: data.location || null,
                    image: data.image || null
                });
            }
        });
        saveMessages(messages);
        getMessages();
    }

    // update messeges on send
    const onSend = (newMessage) => {
        referenceChatMessages.add(newMessage[0]);
    };

    // change chat bubble color
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    left: {
                        backgroundColor: leftBubble
                    },
                    right: {
                        backgroundColor: rightBubble
                    }
                }}
            />
        )
    };

    //set text color by background contrast
    const getContrastYIQ = (hexcolor) => {
        hexcolor = hexcolor.replace('#', '');
        const r = parseInt(hexcolor.substr(0, 2), 16);
        const g = parseInt(hexcolor.substr(2, 2), 16);
        const b = parseInt(hexcolor.substr(4, 2), 16);
        const yiq = ((r * 299) + (g * 587) + (b * 114))/1000;
        return (yiq >= 128) ? 'black' : 'white';
    };

    // change system message color
    const renderSystemMessage = (props) => {
        return (
            <SystemMessage
                {...props}
                textStyle={{
                    color: getContrastYIQ(background)
                }}
            />
        )
    };

    // change date color
    const renderDay = (props) => {
        return (
            <Day
                {...props}
                textStyle={{
                    color: getContrastYIQ(background)
                }}
            />
        )
    };

    // change time color
    const renderTime = (props) => {
        return (
            <Time
                {...props}
                timeTextStyle={{
                    left: {
                        color: getContrastYIQ(leftBubble)
                    },
                    right: {
                        color: getContrastYIQ(rightBubble)
                    }
                }}
            />
        );
    };

    // render actions button
    const renderCustomActions = (props) => {
        return <CustomActions {...props} />;
    };

    //render map location
    const renderCustomView = (props) => {
        const { currentMessage } = props;
        if (currentMessage.location) {
            return (
                <MapView
                    style={{
                        width: 150,
                        height: 100,
                        borderRadius: 13,
                        margin: 3
                    }}
                    region={{
                        latitude: currentMessage.location.latitude,
                        longitude: currentMessage.location.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                />
            );
        }
        return null;
    }

    // only render toolbar if online
    const renderInputToolbar = (props) => {
        if (connectStat === false) return;

        return(<InputToolbar {...props} />);
    }

        return (
            <View style={[styles.container, {backgroundColor: background}]}>
                <GiftedChat
                    renderCustomView={renderCustomView}
                    renderActions={renderCustomActions}
                    renderBubble={renderBubble}
                    renderSystemMessage={renderSystemMessage}
                    renderDay={renderDay}
                    renderTime={renderTime}
                    renderInputToolbar={renderInputToolbar}
                    messages={messages}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: uid,
                        name: user,
                        avatar: `https://ui-avatars.com/api/?name=${user.replace(/\s/g, '+')}`
                    }}
                />
                { Platform.OS == 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
            </View>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});