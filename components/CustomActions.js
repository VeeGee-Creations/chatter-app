import PropTypes from 'prop-types';
import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            menuOpen: false
        };
    }

    // communication feature menu
    onActionPress = () => {
        this.setState({
            menuOpen: true
        });
        const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
        const cancelButtonIndex = options.length - 1;
        this.context.actionSheet().showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
            },
            async (buttonIndex) => {
                switch (buttonIndex) {
                    case 0:
                        this.pickImage();
                        this.setState({
                            menuOpen: false
                        });
                        return;
                    case 1:
                        this.takePhoto();
                        this.setState({
                            menuOpen: false
                        });
                        return;
                    case 2:
                        this.getLocation();
                        this.setState({
                            menuOpen: false
                        });
                        return;
                    default:
                        return;
                }
            },
        );
    };

    // get gps location
    getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        try{
            if (status === 'granted') {
                let result = await Location.getCurrentPositionAsync({})
                    .catch((error) => console.error(error));
    
                if (result) {
                    this.props.onSend({
                        location: {
                            longitude: result.coords.longitude,
                            latitude: result.coords.latitude,
                        }
                    });
                }
            }
        } catch (error) {console.error(error.message)};
    }

    // choose image from library
    pickImage = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        try{
            if (status === 'granted') {
                let result = await ImagePicker.launchImageLibraryAsync({
                    mediaTypes: ImagePicker.MediaTypeOptions.Images
                }).catch((error) => console.error(error));
    
                if (!result.cancelled) {
                    const imageUrl = await this.uploadImageFetch(result.uri);
                    this.props.onSend({ image: imageUrl });
                }
            }
        } catch(error) {console.error(error.message)};
    }

    // take photo with camera
    takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();

        try {
            if (status === "granted") {
                const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
            }).catch((error) => console.error(error));
    
            if (!result.cancelled) {
                const imageUrl = await this.uploadImageFetch(result.uri);
                this.props.onSend({ image: imageUrl });
            }
        }
        } catch (error) {console.log(error.message);}
    };

    // upload image to storage and return url
    uploadImageFetch = async (uri) => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.onload = function () {
                resolve(xhr.response);
            };

            xhr.onerror = function (error) {
                console.error(error);
                reject(new TypeError("Network request failed"));
            };

            xhr.responseType = "blob";

            xhr.open("GET", uri, true);

            xhr.send(null);
        });

        const imageNameBefore = uri.split("/");
        const imageName = imageNameBefore[imageNameBefore.length - 1];
        const ref = firebase.storage().ref().child(`images/${imageName}`);
        const snapshot = await ref.put(blob);
    
        blob.close();
    
        return await snapshot.ref.getDownloadURL();
    };

    render() {
        return (
            <TouchableOpacity
                style={[styles.container]}
                onPress={this.onActionPress}
                accessible={true}
                accessibilityLabel="Communication Features"
                accessibilityHint="Opens Communication Features Menu"
                accessibilityRole="menu"
                accessibilityState={{expanded: this.state.menuOpen}}
            >
                <View style={[styles.wrapper, this.props.wrapperStyle]}>
                    <Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        width: 26,
        height: 26,
        marginLeft: 10,
        marginBottom: 10,
    },
    wrapper: {
        borderRadius: 13,
        borderColor: '#b2b2b2',
        borderWidth: 2,
        flex: 1,
    },
    iconText: {
        color: '#b2b2b2',
        fontWeight: 'bold',
        fontSize: 16,
        backgroundColor: 'transparent',
        textAlign: 'center',
    },
});

CustomActions.contextTypes = {
    actionSheet: PropTypes.func,
};