import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat, Bubble } from 'react-native-gifted-chat';

export default function Chat(props) {
    const [messages, setMessages] = useState([]);

    const { background, username } = props.route.params;
    const { navigation } = props;

    useEffect(() => {
        // display username in title
        navigation.setOptions({ title: username});

        // set initial messages
        setMessages([
            {
                _id: 1,
                text: 'Hello developer',
                createdAt: new Date(),
                user: {
                    _id: 2,
                    name: 'React Native',
                    avatar: 'https://placeimg.com/140/140/any',
                },
            },
            {
                _id: 2,
                text: `${username} has entered chat.`,
                createdAt: new Date(),
                system: true,
            },
        ]);
    }, []);

    // update messeges on send
    const onSend = (newMessages) => {
        setMessages(
            GiftedChat.append([...messages], newMessages),
        );
    };

    // change chat bubble color
    const renderBubble = (props) => {
        return (
            <Bubble
                {...props}
                wrapperStyle={{
                    right: {
                        backgroundColor: '#800080'
                    }
                }}
            />
        )
    };

        return (
            <View style={[styles.container, {backgroundColor: background}]}>
                <GiftedChat
                    renderBubble={renderBubble}
                    messages={messages}
                    onSend={(messages) => onSend(messages)}
                    user={{
                        _id: 1,
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