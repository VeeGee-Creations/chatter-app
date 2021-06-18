import React, { useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';

export default function Chat(props) {
    const { background, username } = props.route.params;
    const { navigation } = props;

    useEffect(() => {
        navigation.setOptions({ title: username})
    });

        return (
            <View style={[styles.container, { backgroundColor: background }]}>
                <Text>Welcom to Chat!</Text>
            </View>
        );
    }

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});