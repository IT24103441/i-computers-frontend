const sampleCart = [

    {
        product: {
            productId: "123456",
            name: "Apple iPhone 14 Pro Max",
            image: "https://m.media-amazon.com/images/I/61jLiKJb9LL._AC_UY218_.jpg",
            price: 109900,
            labelledPrice: 129900
        },
        qty: 1
    },
    {
        product: {
            productId: "123456",
            name: "Apple iPhone 14 Pro Max",
            image: "https://m.media-amazon.com/images/I/61jLiKJb9LL._AC_UY218_.jpg",
            price: 109900,
            labelledPrice: 129900
        },
        qty: 2
    }
]

export function getCart() {

    const cartString = localStorage.getItem("cart")

    if (cartString == null) {
        localStorage.setItem("cart", "[]")
        return []
    }

    const cart = JSON.parse(cartString)

    return cart

}

export function addToCart(product, qty) {

    const cart = getCart()

    const existingProductIndex = cart.findIndex(

        (item) => {
            const result = item.product.productId == product.productId

            return result
        }

    )


    //-1

    if (existingProductIndex == -1 && qty > 0) {

        cart.push({
            product: {
                productId: product.productId,
                name: product.name,
                image: product.images?.[0] || product.image || "",
                price: product.price,
                labelledPrice: product.labelledPrice ?? product.labeledPrice
            },
            qty: qty
        })

    }

    if (existingProductIndex != -1) {

        cart[existingProductIndex].qty += qty // -2

        if (cart[existingProductIndex].qty < 1) {

            cart.splice(existingProductIndex, 1)

        }

    }

    const cartString = JSON.stringify(cart)
    localStorage.setItem("cart", cartString)
}


export function getTotal(cart) {

    let total = 0

    cart.forEach((item) => {

        total += item.product.price * item.qty
    })

    return total

}