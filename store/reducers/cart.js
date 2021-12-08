import { ADD_TO_CART, DELETE_FROM_CART } from "../actions/cart";
import CartItem from '../../models/cart-item'
import { ADD_ORDER } from "../actions/orders";
import { DELETE_PRODUCT } from "../actions/products";

const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch(action.type){
        case ADD_TO_CART:
            const addedProduct = action.product
            const prodPrice = addedProduct.price
            const prodTitle = addedProduct.title

            let updatedOrNewCartItem

            if(state.items[addedProduct.id]){
                updatedOrNewCartItem = new CartItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                )
            }
            else{
                updatedOrNewCartItem = new CartItem(
                    1, prodPrice, prodTitle, prodPrice
                )
            }
            return {
                ...state,
                items: {...state.items, [addedProduct.id]:updatedOrNewCartItem},
                totalAmount: state.totalAmount + prodPrice
            }
        case DELETE_FROM_CART:
            const selectedCartItem = state.items[action.pid]
            const currentQuantity = selectedCartItem.quantity

            let updatedCartItems

            if(currentQuantity > 1){
                const updatedCartItem = new CartItem(
                    currentQuantity - 1,
                    selectedCartItem.productPrice,
                    selectedCartItem.productTitle,
                    selectedCartItem.sum - selectedCartItem.productPrice
                )
                updatedCartItems = {...state.items, [action.pid]:updatedCartItem}
            }
            else{
                updatedCartItems = {...state.items}
                delete updatedCartItems[action.pid]
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: Math.abs(state.totalAmount - selectedCartItem.productPrice)
            }
        case ADD_ORDER:
            return initialState
        case DELETE_PRODUCT:
            if(!state.items[action.productId]){
                return state
            }
            const updatedItems = {...state.items}
            const itemTotal = state.items[action.productId].sum
            delete updatedItems[action.productId]

            return {
                ...state,
                items: updatedItems,
                totalAmount: state.totalAmount - itemTotal

            }
    }
    return state;
}
