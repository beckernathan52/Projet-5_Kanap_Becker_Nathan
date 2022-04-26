export async function fetchProduct (productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`)
    const product = await response.json()
    return product
}