// This is the homepage of the app -> displays all products
import React, { useCallback, useEffect, useState } from "react";
import { Button, FlatList, Platform, StyleSheet, ActivityIndicator, View, Text } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import ProductItem from "../../components/shop/ProductItem";
import {HeaderButtons, Item} from 'react-navigation-header-buttons'

import * as cartActions from '../../store/actions/cart'
import * as productsActions from '../../store/actions/products'
import HeaderButton from '../../components/UI/HeaderButton'
import Colors from "../../constants/Colors";


const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)
    const [error, setError] = useState()

    // useSelector to get data from store (state.something where something is a key in combineReducers in app.js)
    const products = useSelector(state => state.products.availableProducts)
    const dispatch = useDispatch()

    const loadProducts = useCallback(async () => {
        setError(null)
        setIsRefreshing(true)
        try{
            await dispatch(productsActions.fetchProducts())
        }
        catch(err){
            setError(err.message)
        }
        setIsRefreshing(false)
    }, [dispatch])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts)

        return () => willFocusSub.remove()
    },[loadProducts])

    useEffect(() => {
        setIsLoading(true)
        loadProducts().then(() => setIsLoading(false))
        
    }, [dispatch, loadProducts])

    const selectItemHandler = (id, title) => {
        props.navigation.navigate(
            'ProductDetail', 
            {
                productId:id,
                productTitle: title
            }
        )
    }

    if(isLoading){
        return <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
    }

    if(error){
        console.log(error);
        return <View style={styles.centered}>
            <Text>An error occured.</Text>
            <Button title='Try Again' onPress={loadProducts} color={Colors.primary}/>
        </View>
    }

    if(!isLoading && products.length === 0){
        return <View style={styles.centered}>
            <Text>No products found. Try adding some.</Text>
        </View>
    }

    return (
        <FlatList 
            refreshing={isRefreshing}
            onRefresh={loadProducts}
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={itemData => {
                return (
                <ProductItem 
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {
                        selectItemHandler(itemData.item.id, itemData.item.title)
                    }}
                >
                    <Button
                        color={Colors.primary}
                        title="View Details"
                        onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                    />
                    <Button
                        color={Colors.primary}
                        title="To Cart"
                        onPress={() => dispatch(cartActions.addToCart(itemData.item))}
                    />
                </ProductItem>)
            }}
        />
    )
}

ProductsOverviewScreen.navigationOptions = (navData) => {
    return {
        headerTitle: 'All Products',
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
        },
        headerRight: () => {
            return  (
                <HeaderButtons HeaderButtonComponent={HeaderButton}>
                    <Item 
                        title='cart' 
                        iconName={Platform.OS === 'android'? 'md-cart' : 'ios-cart'}
                        onPress={() => {
                            navData.navigation.navigate('Cart')
                        }}
                    />
                </HeaderButtons>
            )
        }
    }
} 


const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen