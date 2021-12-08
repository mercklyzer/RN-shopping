import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "../constants/Colors";
import { useDispatch } from "react-redux";
import * as authActions from '../store/actions/auth'

const StartupScreen = (props) => {
    const dispatch = useDispatch()



    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem('userData')
            const transformedData = JSON.parse(userData)
            if(!userData){
                props.navigation.navigate('Auth')
                return
            }

            const {token, userId, expiryDate} = transformedData
            const expirationDate = new Date(expiryDate)
    
            if(expirationDate <= new Date() || !token || !userId){
                props.navigation.navigate('Auth')
                return
            }

            props.navigation.navigate('Shop')
            dispatch(authActions.authenticate(userId, token))
        }



        tryLogin()
    }, [dispatch])

    return (
        <View style={styles.screen}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen