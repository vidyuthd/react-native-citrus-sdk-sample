/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableHighlight,
} from 'react-native';
import CitrusSDK from './CitrusSDK'

class citrus_sdk_sample extends Component {
  constructor(props){
    super(props);

    this.state = {
        userLoggedIn : false,
        signInProcess : 'tostart',
        otp : '',
    }
  }

  componentWillMount(){
    CitrusSDK.initializeCitrusClient()
  }

  render() {
    if(!this.state.userLoggedIn && this.state.signInProcess === 'tostart'){
        return (
         <View style={styles.container}>
            <TouchableHighlight
            style={styles.welcome}
            onPress = {() => this.determineUserSignInProcedure()}
            >
                <Text>  LogIn  </Text>
            </TouchableHighlight>
         </View>
        )
    }

    if(!this.state.userLoggedIn && this.state.signInProcess === 'showMOtp'){
        return (
            <View style={styles.container}>
                <TextInput
                onChangeText = {(text) => this.state.otp = text}
                onSubmitEditing = {() => this.signInUser() }
                />
            </View>
        )
    }

    return (
      <View style={styles.container}>
        <Text
         style={styles.instructions}>
          User is signed in
         </Text>
      </View>
    );
  }

  signInUser(){
    CitrusSDK.signInUser(this.state.otp,function(data){
        console.warn(data)
        this.setState({
                                     signInProcess : 'complete',
                                     userLoggedIn : true,
                                });
    }.bind(this),function(data){
        console.warn(data)
    })
  }

  determineUserSignInProcedure(){
     CitrusSDK.isUserSignedIn(function(isUserSignedIn){
            if(!isUserSignedIn){
                console.warn('user is not signed in ')
                CitrusSDK.linkUserExtended(null, function(data){
                    if(data === 'SignInTypeMOtp'){
                        this.setState({
                             signInProcess : 'showMOtp'
                        });
                    }
                    else if(data === 'None'){
                        this.setState({
                             signInProcess : 'complete',
                             userLoggedIn : true,
                        });
                    }
                }.bind(this), function(data){
                    console.warn(data);
                })
            }
        }.bind(this),function(data){
            console.warn("error in linking user : ",data);
        })
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('citrus_sdk_sample', () => citrus_sdk_sample);
