import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView, LogBox } from 'react-native';
import { GiftedChat, Bubble, SystemMessage, Day, Time } from 'react-native-gifted-chat';
import firebase from 'firebase';
import 'firebase/firestore';


export default function Chat(props) {
    const [messages, setMessages] = useState([]);
    const [uid, setUid] = useState('');
    
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
            _id: new Date(),
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
                _id: new Date(),
                text: `${user} has left chat.`,
                createdAt: new Date(),
                system: true,
            });
            authUnsubscribe();
            unsubscribe();
        }
    }, []);

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
                });
            }
        });
        setMessages(messages);
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

        return (
            <View style={[styles.container, {backgroundColor: background}]}>
                <GiftedChat
                    renderBubble={renderBubble}
                    renderSystemMessage={renderSystemMessage}
                    renderDay={renderDay}
                    renderTime={renderTime}
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