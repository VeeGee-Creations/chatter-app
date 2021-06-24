import React from 'react';
import { StyleSheet, View, Text, Pressable, ImageBackground, TextInput, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';

export default class Start extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: '',
            background: '',
        };
    }

    render() {
        const { navigation } = this.props;
        const { user, background } = this.state;

        // Verify username and color selected 
        const signInCheck = () => user.length > 0 && background.length > 0;

        // Navigate to chat and pass props
        const startChat = () => navigation.navigate('Chat', { user, background});

        return (
            <View style={styles.container}>

                {/* background image and title */}
                <ImageBackground source={require('../assets/BackgroundImage.png')} style={styles.image} accessible={false}> 
                    <Text
                    accessible={true}
                    accessibilityLabel="Chatter"
                    accessibilityHint="Chatter app title"
                    accessibilityRole="text"
                        style={styles.title}
                    >
                        Chatter
                    </Text>

                    {/* username entry */}
                    <View style={styles.signIn}>
                        <View style={[styles.signInCenterContainer, styles.signInContainers]}>
                            <TextInput
                                style={styles.textInput}
                                value={user}
                                onChangeText={(user) => this.setState({user})}
                                placeholder={'Your Name'}
                                placeholderTextColor={'#75708350'}
                            />
                        </View>

                        {/* background color radio selection */}
                        <View style={styles.signInContainers}>
                            <Text
                                accessible={true}
                                accessibilityLabel="Choose Background Color"
                                accessibilityHint="Background radio button instruction"
                                accessibilityRole="text"
                                style={styles.chooseColor}
                            >
                                Choose Background Color
                            </Text>
                            <View style={styles.colorContainer} accessibilityRole="radiogroup">
                                <View style={[styles.chooseColor, styles.colorChoice, background === styles.color1.backgroundColor ? styles.selected: null]} accessible={false}>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityLabel="Black"
                                        accessibilityHint="Let's you choose a black background"
                                        accessibilityRole="radio"
                                        activeOpacity={1}
                                        onPress={() => this.setState({background: styles.color1.backgroundColor})}
                                        style={[styles.colorTouch, styles.color1]}
                                    />
                                </View>
                                <View style={[styles.chooseColor, styles.colorChoice, background === styles.color2.backgroundColor ? styles.selected: null]} accessible={false}>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityLabel="Purple"
                                        accessibilityHint="Let's you choose a purple background"
                                        accessibilityRole="radio"
                                        activeOpacity={1}
                                        onPress={() => this.setState({background: styles.color2.backgroundColor})}
                                        style={[styles.colorTouch, styles.color2]}
                                    />
                                </View>
                                <View style={[styles.chooseColor, styles.colorChoice, background === styles.color3.backgroundColor ? styles.selected: null]} accessible={false}>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityLabel="Blue"
                                        accessibilityHint="Let's you choose a blue background"
                                        accessibilityRole="radio"
                                        activeOpacity={1}
                                        onPress={() => this.setState({background: styles.color3.backgroundColor})}
                                        style={[styles.colorTouch, styles.color3]}
                                    />
                                </View>
                                <View style={[styles.chooseColor, styles.colorChoice, background === styles.color4.backgroundColor ? styles.selected: null]} accessible={false}>
                                    <TouchableOpacity
                                        accessible={true}
                                        accessibilityLabel="Green"
                                        accessibilityHint="Let's you choose a green background"
                                        accessibilityRole="radio"
                                        activeOpacity={1}
                                        onPress={() => this.setState({background: styles.color4.backgroundColor})}
                                        style={[styles.colorTouch, styles.color4]}
                                    />
                                </View>
                            </View>
                        </View>

                        {/* enter chat button */}
                        <View style={[styles.signInCenterContainer, styles.signInContainers]}>
                            <Pressable
                                accessible={true}
                                accessibilityLabel="Start Chatting"
                                accessibilityHint="Enters chat"
                                accessibilityRole="button"
                                style={styles.startButton}
                                onPress={() => startChat()}
                                disabled={!signInCheck()}
                            >
                                <Text style={styles.startButtonText} accessible={false}>Start Chatting</Text>
                            </Pressable>
                        </View>
                    </View>
                </ImageBackground>
                { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
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
        flex: 56,
        flexDirection: 'column',
        top: 110,
        fontSize: 45,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    signIn: {
        flex: 44,
        alignItems: 'center',
        bottom: 25,
        width: '88%',
        backgroundColor: '#FFFFFF',
    },
    signInContainers: {
        height: '33%',
        width: '88%',
        justifyContent: 'center',
    },
    signInCenterContainer: {
        alignItems: 'center',
    },
    textInput: {
        width: '100%',
        height: 50,
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        color: '#757083',
        fontSize: 16,
        fontWeight: 'normal',
    },
    chooseColor: {
        justifyContent: 'space-between',
        alignSelf: 'flex-start',
        fontSize: 16,
        fontWeight: 'bold',
        color: '#757083',
        
    },
    colorChoice: {
        height: 60,
        width: 60,
        borderRadius: 60/2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    colorContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between'
        
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
        width: '100%',
        height: 60,
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