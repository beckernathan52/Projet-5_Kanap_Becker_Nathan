// Importation de la fonction Call API via l'ID du produit
import {fetchProduct} from "./function.js"

// Récupération des données du localStorage
let productLocalStorage = JSON.parse(localStorage.getItem("productsInCart"))

// Affichage du panier vide
function displayCartIsEmpty () {
    if(productLocalStorage === null || productLocalStorage == 0) {
        document.getElementById("cart__items").innerHTML =
        `<div>
            <p> Votre panier est vide, veuillez choisir un article. </p>
        </div>`
        // Remise à 0 du prix total du panier
        document.getElementById("totalPrice").innerHTML = ""
    }    
}
displayCartIsEmpty()

// Affichage des produits dans le panier
const displayProductsInCart = async function () {
    // Pour chaque produit présent dans le localStorage, créer un article
    const promises = productLocalStorage.map(async product => {
        // Récupère via l'ID, les informations de chaque produit du panier
        const myProduct = await fetchProduct(product.id)
        // Affichage d'un article
        document.getElementById('cart__items').innerHTML += 
        `
            <article class="cart__item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                <img src="${myProduct.imageUrl}" alt="${myProduct.alt}">
                </div>
                <div class="cart__item__content">
                <div class="cart__item__content__description">
                    <h2>${myProduct.name}</h2>
                    <p>${product.color}</p>
                    <p>${myProduct.price} €</p>
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
    await Promise.all(promises) 
}
await displayProductsInCart()

// Gestion de modification et mise à jour des quantités
function updateQuantity () {
    // Séléction de l'input de quantité
    const inputQuantity = document.getElementsByClassName('itemQuantity')
    // console.log(productLocalStorage,"avant")

    // Pour chaque input, écoute si une quantité est modifiée
    Array.from(inputQuantity).forEach(input => { 
        input.addEventListener("change", function(event){
            // Séléction de l'article où il y a eu modification de quantité
            const articleTarget = event.target.closest("article")
            // Récupération de l'Id et de la couleur du produit
            const articleId = articleTarget.dataset.id
            const articleColor = articleTarget.dataset.color
            // Quantité choisi dans l'input
            const newQuantity = input.valueAsNumber

            // Produit trouvé ayant le même Id et couleur 
            const productFound = productLocalStorage.find((item) => item.id === articleId && item.color === articleColor)
            
            if (productFound.quantity != newQuantity) {
                // Remplace la quantité du produit trouvé par la quantité saisie
                productFound.quantity = newQuantity
                // console.log(productLocalStorage,"après")
            }
            // Enregistre les modifications dans le localStorage
            localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
            
            totalCartQuantity()
            totalCartPrice()
        })
    })
}
updateQuantity()

// Suppression d'un produit
function deleteProduct () {
    // Séléction du bouton "Supprimer"
    const buttonDelete = document.getElementsByClassName('deleteItem')

    Array.from(buttonDelete).forEach(button => {
        button.addEventListener("click", function(event){
            // Séléction de l'article où l'événement a eu lieu
            const articleTarget = event.target.closest("article")
            // Récupération de l'Id et de la couleur du produit
            const articleId = articleTarget.dataset.id
            const articleColor = articleTarget.dataset.color
            // Filtre le panier pour garder les produits différents de celui qu'on veut supprimer
            productLocalStorage = productLocalStorage.filter(product => product.id !== articleId || product.color !== articleColor)
            // Mets à jour le localStorage
            localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
            // Supprime le produit séléctionné de l'aperçu de la page
            articleTarget.parentElement.removeChild(articleTarget)

            totalCartPrice()
            totalCartQuantity()
            displayCartIsEmpty()
        })
    })
}   
deleteProduct ()

// Calcul de la quantité totale d'articles dans le panier
function totalCartQuantity () {
    // Séléction des conteneurs
    const quantityArticle = document.getElementById("totalQuantity")
    let totalArticle = 0 
    // Additionne la quantité de chaque produit dans le panier
    productLocalStorage.forEach(product => {
        totalArticle += product.quantity
    })
    // Affichage de la quantité totale d'articles
    quantityArticle.innerHTML = `${totalArticle}`
}
totalCartQuantity()

// Calcul du prix total du panier
function totalCartPrice () {
    // Défini un prix de base
    let priceIndex = 0
    // Séléction du conteneur
    const priceContainer = document.getElementById("totalPrice")

    productLocalStorage.forEach(async product => {
        // Récupère les informations du produit via son ID
        const myProduct = await fetchProduct(product.id)
        // Prix du produit * quantité du produit
        priceIndex += myProduct.price * product.quantity
        // Affichage du prix total
        priceContainer.innerHTML = `${priceIndex}`
    }) 
}
totalCartPrice()

// Vérification du prénom
function isFirstNameValid (contact) {
    document.getElementById("firstNameErrorMsg").innerHTML = ""
      if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.firstName)) {
          return true
      } else {
          document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez saisir un prénom valide."
      }
}
// Vérification du nom
function isLastNameValid (contact) {
    document.getElementById("lastNameErrorMsg").innerHTML = ""
    if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.lastName)) {
        return true
    } else {
        document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez saisir un nom valide."
    }
}
// Vérification de l'adresse
function isAdressValid (contact) {
    document.getElementById("addressErrorMsg").innerHTML = ""
    if (/^[A-Za-z0-9\s]{3,100}$/.test(contact.address)) {
        return true
    } else {
        document.getElementById("addressErrorMsg").innerHTML = "Veuillez saisir une adresse valide."
    }
}
// Vérification de la ville
function isCityValid (contact) {
    document.getElementById("cityErrorMsg").innerHTML = ""
    if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.city)) {
        return true
    } else {
        document.getElementById("cityErrorMsg").innerHTML = "Veuillez saisir un nom de ville valide."
    }
}
// Vérification de l'email
function isEmailValid (contact) {
    document.getElementById("emailErrorMsg").innerHTML = ""
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email)) {
        return true
    } else {
        document.getElementById("emailErrorMsg").innerHTML = "Veuillez saisir une adresse email valide."
    }
}
// Vérification de l'ensemble des champs du formulaire
function formCheck () {
    // Création d'un objet pour toutes les informations du formulaire
    const contact = {
        firstName: document.getElementById("firstName").value,
        lastName: document.getElementById("lastName").value,
        address: document.getElementById("address").value,
        city: document.getElementById("city").value,
        email: document.getElementById("email").value,
    }
    const firstNameValid = isFirstNameValid(contact)
    const lastNameValid = isLastNameValid(contact)
    const adressValid = isAdressValid(contact)
    const cityValid =  isCityValid(contact)
    const emailValid =  isEmailValid(contact)

    // Si le panier est vide
    if (productLocalStorage === null || productLocalStorage == 0){
        alert("Votre panier est vide, veuillez choisir un article.")
    } else if ( 
        firstNameValid &&
        lastNameValid &&
        adressValid &&
        cityValid &&
        emailValid
    ) {
        return contact
    } else {
        alert("Une erreur est survenue! Veuillez vérifier les informations saisies.")
        return
    }
}

// Validation de la commande
async function validOrder (contact) {
    // Récupération des Id de chaque produit présent dans le panier
    const productsId = productLocalStorage.map(product => product.id)

    // Création d'un objet pour stocker la commande et les informations du client
    const orderInit = {products:productsId, contact}
    console.log(orderInit,"Panier et infos client")

    // Envoi une requête à l'API
    const response = await fetch("http://localhost:3000/api/products/order", {
        method: "POST",
        body: JSON.stringify(orderInit),
        headers: {"Content-Type": "application/json"}
    })
    // Récupération du numéro de commande
    const order = await response.json()        
    // Vide le localStorage
    localStorage.clear()
    alert("Votre commande a bien été validée")
    // Redirige sur la page de confirmation
    document.location.href = `confirmation.html?id=${order.orderId}`
}

// Séléction du boutton "Commander"
const orderButton = document.getElementById("order")
// Event listenner au clique sur le bouton de commande
orderButton.addEventListener('click', function (e){
    e.preventDefault()
    // Résultat de la fonction
    const contact = formCheck()
    // Si l'ensemble des conditions sont remplies, valide la commande
    if (contact !== undefined) {
        validOrder(contact)
    }
})