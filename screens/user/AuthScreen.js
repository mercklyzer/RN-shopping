import React, { useCallback, useEffect, useReducer, useState } from "react"
import { StyleSheet, ScrollView, View, KeyboardAvoidingView, Button, ActivityIndicator, Alert } from "react-native"
import {LinearGradient} from 'expo-linear-gradient'
import Input from '../../components/UI/Input'
import Card from "../../components/UI/Card"
import Colors from "../../constants/Colors"

import * as authActions from '../../store/actions/auth'
import { useDispatch } from "react-redux"

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if(action.type == FORM_INPUT_UPDATE){
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }

        let updatedFormIsValid = true
        for(const key in updatedValidities){
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }

        return {
            formIsValid: updatedFormIsValid,
            inputValidities: updatedValidities,
            inputValues: updatedValues,
        }
    }
    return state
}

const AuthScreen = props => {
    const [isSignUp, setIsSignUp] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

    const dispatch = useDispatch()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        },
        inputValidities: {
            email: false,
            password: false,
        },
        formIsValid: false
    })

    useEffect(() => {
        if(error){
            Alert.alert('Error Occurred!', error, [{text: 'Okay'}])
        }
    }, [error])

    const authHandler = async () => {
        setError(null)
        setIsLoading(true)
        try{
            if(isSignUp){
                await dispatch(authActions.signup(formState.inputValues.email, formState.inputValues.password))
            }
            else{
                await dispatch(authActions.login(formState.inputValues.email, formState.inputValues.password))
            }
        }
        catch(err){
            setError(err.message)
            setIsLoading(false)
        }
        props.navigation.navigate('Shop')
    }

    const inputChangeHandler = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
          dispatchFormState({
            type: FORM_INPUT_UPDATE,
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
          });
        },
        [dispatchFormState]
      );

    

    return (
        <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <Card style={styles.authContainer}>
                    <ScrollView>
                        <Input 
                            id='email'
                            label='Email'
                            keyboardType='email-address'
                            required
                            email
                            autoCapitalize="none"
                            errorText="Please enter a valid email address."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <Input 
                            id='password'
                            label='Password'
                            keyboardType='default'
                            secureTextEntry
                            minLength={5}
                            required
                            autoCapitalize="none"
                            errorText="Please enter a valid password."
                            onInputChange={inputChangeHandler}
                            initialValue=''
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading? <ActivityIndicator size='small' color={Colors.primary}/>  :
                            <Button 
                                title={isSignUp? 'Sign Up' : 'Login'}
                                color={Colors.primary}
                                onPress={authHandler}
                            />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button 
                                title={`Switch to ${isSignUp? 'Login' : 'Sign Up'}`}
                                color={Colors.accent}
                                onPress={() => {
                                    setIsSignUp(prevState => !prevState)
                                }}
                            />
                        </View>
                    </ScrollView>
                </Card>
            </LinearGradient>
        </KeyboardAvoidingView>
    )
}


AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Authenticate'
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
    },
    gradient:{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        maxHeight: 400,
        padding: 20
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen