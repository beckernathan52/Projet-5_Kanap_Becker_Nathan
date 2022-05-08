// Importation de la fonction Call API via l'ID du produit
import {fetchProduct} from "./function.js"

// Récupération de l'ID sur l'url
const getProductId = (paramId) => new URL(document.location).searchParams.get(paramId)
// Récupération de l'Id du produit
const productId = getProductId("id")

// Affichage des informations du produit
const displayProductsInfos = async() => {
    // Récupération des éléments du DOM
    const imgContainer = document.querySelector(".item__img")
    const productName = document.getElementById("title")
    const productPrice = document.getElementById("price")
    const productDescription = document.getElementById("description")
    const color = document.getElementById("colors")

    // Si le serveur réponds
    try {
        // Récupération des informations du produit via son ID
        const product = await fetchProduct (productId)
        console.log(product)

        // Traitement des informations du produit contenu dans le tableau
        productName.innerHTML = product.name
        productPrice.innerHTML = product.price
        productDescription.innerHTML = product.description
        imgContainer.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`

        // Traitement des options de couleurs 
        product.colors.forEach(colorArticle => {
            // Crée un nouvel élément
            const colorOption = document.createElement("option")
            // Séléctionne les éléments
            colorOption.value = colorArticle
            // Ajoute l'élément
            colorOption.innerHTML = colorArticle
            // Place l'élément à l'intérieur du container
            color.appendChild(colorOption)
        });
    // Affiche un message d'erreur si le serveur ne répond pas
    } catch (error){
        alert('Une erreur est survenue')
        console.log(error)
    }
}
displayProductsInfos()

// Vérifie si la quantité choisie est conforme
function checkQuantityChoice (productChoice) {
    if (productChoice.quantity <= 0 || productChoice.quantity > 100){
        // Envoi un message d'erreur si la quantité est inférieur ou égale à 0 ou supérieur à 100
        return alert("Veuillez choisir une quantité comprise entre 1 et 100.")
    } 
    return true
}
// Vérifie si une option de couleur à été choisi
function checkColorChoice (productChoice) {
    if (productChoice.color == "") {
        // Envoi un message d'erreur si la couleur n'a pas été séléctionné
        return alert("Veuillez choisir une couleur")
    } 
    return true
}

// Vérification des informations avant l'ajout au panier
function checkBeforeAddToCart () {
    // Récupération des éléments du DOM
    const productQuantity = document.getElementById("quantity")
    const productColor = document.getElementById("colors")
    
    // Sauvegarde des choix de l'utilisateur dans un objet pour l'envoyer dans le localStorage
    const productChoice = {
        id: productId,
        quantity: parseInt(productQuantity.value, 10),
        color: productColor.value,
    }

    const quantityValid = checkQuantityChoice(productChoice)
    const colorValid = checkColorChoice(productChoice)
    // Si la couleur et une quantité sont choisies 
    if (quantityValid && colorValid) {
        return productChoice  
    } else {
        return
    }
}

// Fonction d'ajout au panier
function addToCart (productChoice) {
    // Vérifie si le produit n'est pas déjà présent dans le localStorage ou crée un tableau vide
    let productLocalStorage = JSON.parse(localStorage.getItem("productsInCart")) || []
    
    // Vérifie la présence d'un produit ayant la même ID et couleur dans le localStorage
    const productFound = productLocalStorage.find((item) =>          
        productChoice.id == item.id &&
        productChoice.color == item.color
    )
    // console.log(productFound)

    // Si le produit n'existe pas dans le localStorage, ajoute le produit
    if (!productLocalStorage.length || !productFound) {
        productLocalStorage.push(productChoice)
        localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
        alert("Votre produit a été ajouté au panier. ")
    } else {
        // Si un doublon est présent, incrémenter la quantité du produit   
        productFound.quantity += productChoice.quantity   
        // Enregistre les modifications dans le localStorage
        localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
        alert("Votre produit a été ajouté au panier. ")
    }
}

// Séléction du bouton "Ajouter au panier"
const buttonAddCart = document.getElementById("addToCart")
// Au clique sur le bouton, exécute la fonction de vérification du panier
buttonAddCart.addEventListener('click', function (e){
    e.preventDefault()
    // Résultat de la fonction
    const userChoice = checkBeforeAddToCart ()
    // Si l'ensemble des conditions sont remplies, ajoute le produit au panier
    if (userChoice !== undefined) {
        addToCart(userChoice)
    }
})