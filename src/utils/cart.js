export function getCart() {

    const cartString = localStorage.getItem("cart")

    if (cartString == null) {
        localStorage.setItem("cart", "[]")
        return []
    }

    try {
        const cart = JSON.parse(cartString)
        return Array.isArray(cart) ? cart : []
    } catch (err) {
        console.error("Error parsing cart from localStorage:", err)
        localStorage.setItem("cart", "[]")
        return []
    }

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