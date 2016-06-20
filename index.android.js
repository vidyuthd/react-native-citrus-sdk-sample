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
        balance : 0,
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
          User is signed in, balance is {this.state.balance}
         </Text>
         <TouchableHighlight
         onPress = {() => this.addMoneyToWallet()}
         >
         <Text> Add Money To Wallet- adds 5 Rs </Text>
         </TouchableHighlight>
          <TouchableHighlight
          onPress = {() => this.payUsingWallet()}
          >
          <Text> Pay Using Wallet - pay 5 Rs </Text>
          </TouchableHighlight>
      </View>
    );
  }

  payUsingWallet(){
    CitrusSDK.payUsingWallet(function(data){
                                     this.setState({
                                         balance : data,
                                     })
                                 }.bind(this),function(error){
                                                      console.warn("error is ",error);
                                                  })
  }

  addMoneyToWallet(){
    CitrusSDK.addMoneyToWallet('5',function(data){
        this.setState({
            balance : data,
        })
    }.bind(this),function(error){
        console.warn(error);
    })
  }

  signInUser(){
    CitrusSDK.signInUser(this.state.otp,function(data){
        console.warn(data)
        this.getBalance()
    }.bind(this),function(error){
        console.warn(error)
    })
  }

  getBalance(){
    CitrusSDK.getBalance(function(data){
        this.setState({
            balance: data,
            signInProcess : 'complete',
            userLoggedIn : true,
        })
    }.bind(this),function(error){
        console.log(error)
    })
  }

  determineUserSignInProcedure(){
     CitrusSDK.isUserSignedIn(function(isUserSignedIn){
            if(!isUserSignedIn){
                console.warn('user is not signed in ')
                CitrusSDK.linkUserExtended('9164478258', function(data){
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
            else{
                console.warn('user is signed in ')
                 this.getBalance();
            }
        }.bind(this),function(error){
            console.warn("error in linking user : ",error)
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
