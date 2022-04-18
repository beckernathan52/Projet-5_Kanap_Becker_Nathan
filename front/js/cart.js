async function fetchProduct (productId) {
    const response = await fetch(`http://localhost:3000/api/products/${productId}`)
    const product = await response.json()
    return product
}



// Récupération des données du localStorage
let productLocalStorage = JSON.parse(localStorage.getItem("productsInCart"))
// console.log(productLocalStorage, "Tableau des produits présent dans le localStorage")

const promise1 = Promise.resolve(productLocalStorage).then(value => value)
let arrayToDisplay = []
promise1.then((value) => {
    arrayToDisplay = value
});
console.log(promise1)



// Affichage des produits dans le panier
const displayProductsInCart = async function () {
    // Si le panier est vide
    if(productLocalStorage === null && productLocalStorage == 0) {
        console.log("Panier vide")
        document.getElementById("cart__items").innerHTML =
        `<div>
            <p> Votre panier est vide </p>
        </div>`

    // Si le panier contient des articles
    } else {
        // Séléction du container
        const containerArticle = document.getElementById('cart__items')
        // console.log("Le panier contient des articles")
        
        // Pour chaque produit présent dans le localStorage, créer un article
        arrayToDisplay.forEach(product => {
          containerArticle.innerHTML += fetchProduct 
          `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                  <img src="${product.image}" alt="${product.alt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${product.color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
            </article>
          `
        })
    }
}

// pour chaque article dans le panier, je veux récupérer les informations nécessaires a l'affichage du produit(image, titre) Call API


displayProductsInCart()
