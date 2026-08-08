export function getUserCartKey() {
    const token = localStorage.getItem("token");
    if (!token) return "cart_guest";

    try {
        const parts = token.split(".");
        if (parts.length === 3) {
            const payloadBase64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(payloadBase64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            const parsed = JSON.parse(jsonPayload);
            const userIdentifier = parsed.email || parsed.id || parsed._id || parsed.sub;
            if (userIdentifier) {
                return `cart_${userIdentifier}`;
            }
        }
    } catch (e) {
        console.error("Error parsing token for cart key:", e);
    }

    return "cart_guest";
}

export function getCart() {
    const key = getUserCartKey();
    let cartString = localStorage.getItem(key);

    // Fallback/migration from legacy global "cart" key
    if (cartString == null && key !== "cart" && localStorage.getItem("cart") != null) {
        cartString = localStorage.getItem("cart");
        localStorage.setItem(key, cartString);
        localStorage.removeItem("cart");
    }

    if (cartString == null) {
        localStorage.setItem(key, "[]");
        return [];
    }

    try {
        const cart = JSON.parse(cartString);
        return Array.isArray(cart) ? cart : [];
    } catch (err) {
        console.error("Error parsing cart from localStorage:", err);
        localStorage.setItem(key, "[]");
        return [];
    }
}

export function addToCart(product, qty) {
    const cart = getCart();

    const existingProductIndex = cart.findIndex(
        (item) => item.product.productId == product.productId
    );

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
        });
    }

    if (existingProductIndex != -1) {
        cart[existingProductIndex].qty += qty;
        if (cart[existingProductIndex].qty < 1) {
            cart.splice(existingProductIndex, 1);
        }
    }

    const key = getUserCartKey();
    localStorage.setItem(key, JSON.stringify(cart));
}

export function getTotal(cart) {
    let total = 0;
    cart.forEach((item) => {
        total += item.product.price * item.qty;
    });
    return total;
}

export function clearCart() {
    const key = getUserCartKey();
    localStorage.removeItem(key);
}