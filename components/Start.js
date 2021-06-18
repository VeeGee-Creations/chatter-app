import React from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground, TextInput, TouchableOpacity } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            background: '',
        };
    }

    render() {
        const { navigation } = this.props;
        const { username, background } = this.state;
        const colors = ['#090C08', '#474056', '#8A95A5', '#B9C6AE']

        // Verify username and color selected 
        const signInCheck = () => username.length > 0 && background.length > 0;

        // Navigate to chat and pass props
        const startChat = () => navigation.navigate('Chat', { username, background});

        return (
            <View style={styles.container}>
                <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.image}>
                    <Text style={styles.title}>Chatter</Text>
                    <View style={styles.signIn}>
                        <TextInput
                            style={styles.textInput}
                            value={username}
                            onChangeText={(username) => this.setState({username})}
                            placeholder={'Your Name'}
                            placeholderTextColor={'#75708350'}
                        />
                        <Text style={styles.chooseColor}>Choose Background Color</Text>
                        <View style={styles.colorContainer}>
                            <View style={[styles.chooseColor, styles.colorChoice, background === colors[0] ? styles.selected: null]}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({background: colors[0]})} style={[styles.colorTouch, styles.color1]}></TouchableOpacity>
                            </View>
                            <View style={[styles.chooseColor, styles.colorChoice, background === colors[1] ? styles.selected: null]}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({background: colors[1]})} style={[styles.colorTouch, styles.color2]}></TouchableOpacity>
                            </View>
                            <View style={[styles.chooseColor, styles.colorChoice, background === colors[2] ? styles.selected: null]}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({background: colors[2]})} style={[styles.colorTouch, styles.color3]}></TouchableOpacity>
                            </View>
                            <View style={[styles.chooseColor, styles.colorChoice, background === colors[3] ? styles.selected: null]}>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.setState({background: colors[3]})} style={[styles.colorTouch, styles.color4]}></TouchableOpacity>
                            </View>
                        </View>
                        <Pressable style={styles.startButton} onPress={() => startChat()} disabled={!signInCheck()}>
                            <Text style={styles.startButtonText}>Start Chatting</Text>
                        </Pressable>
                    </View>
                </ImageBackground>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: '100%',
        resizeMode: 'cover',
        alignItems: 'center',
    },
    title: {
        // position: 'absolute',
        // top: 110,
        flex: 66,
        flexDirection: 'column',
        top: 110,
        fontSize: 45,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    signIn: {
        flex: 44,
        // justifyContent: 'center',
        alignItems: 'center',
        bottom: 25,
        width: '88%',
        backgroundColor: '#FFFFFF',
    },
    textInput: {
        // position: 'absolute',
        marginTop: 20,
        width: '88%',
        height: 50,
        // flex: 33,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        color: '#757083',
        fontSize: 16,
        fontWeight: 'normal',
    },
    chooseColor: {
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#757083',
        marginTop: 30,
        marginLeft: 22
    },
    colorChoice: {
        marginTop: 10,
        height: 60,
        width: 60,
        borderRadius: 60/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorContainer: {
        flex:1,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },
    colorTouch: {
        height: 50,
        width: 50,
        borderRadius: 50/2
    },
    color1: {
        backgroundColor: '#090C08',
    },
    color2:{
        backgroundColor: '#474056',
    },
    color3:{
        backgroundColor: '#8A95A5',
    },
    color4:{
        backgroundColor: '#B9C6AE',
    },
    selected: {
        borderColor: 'gray',
        borderWidth: 3,
    },
    startButton: {
        backgroundColor: '#757083',
        width: '88%',
        height: 60,
        marginBottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50/12,
    },
    startButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
});