// screen to view orders
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Platform, StyleSheet, Text, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import {HeaderButtons, Item} from 'react-navigation-header-buttons'
import HeaderButton from '../../components/UI/HeaderButton'
import OrderItem from '../../components/shop/OrderItem'
import * as ordersActions from '../../store/actions/orders'
import Colors from '../../constants/Colors'

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const dispatch = useDispatch()
    const orders = useSelector(state => state.orders.orders)
    
    useEffect(() => {
        setIsLoading(true)
        dispatch(ordersActions.fetchOrders())
        .then(() => {
            setIsLoading(false)
        })
    }, [dispatch])
    
    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary}/>
        </View>
    }
    
    if(orders.length === 0){
        return <View style={{flex: 1, justifyContent:'center', alignItems: 'center'}}>
            <Text>No orders found.</Text>
        </View>
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => <OrderItem items={itemData.item.items} amount={itemData.item.totalAmount} date={itemData.item.readableDate}/>}
        />
    )
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

OrdersScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'Your Orders',
        headerLeft: () => {
            return (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='Menu' 
                        iconName={Platform.OS === 'android'? 'md-menu' : 'ios-menu'}
                        onPress={() => {
                            navData.navigation.toggleDrawer()
                        }}
                    />
                </HeaderButtons>
            )
        }
    }
}

export default OrdersScreen