import React from 'react'
import IndividualProduct from './IndividualProduct'

export default function Products({products,addToCart}){

    // console.log(products);
    
    return products.map((individualProduct)=>(
        <IndividualProduct key = {individualProduct.ID} individualProduct={individualProduct}
           addToCart={addToCart}
        />
    ))
}