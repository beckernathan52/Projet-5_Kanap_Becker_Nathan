// Récupération de l'ID sur l'url
const getProductId = (paramId) => new URL(document.location).searchParams.get(paramId)

// Fonction Call API via l'ID du produit
import {fetchProduct} from "./function.js"

// Affichage des infos produits
const affichageInfosProduits = async() => {
    // Récupération de l'Id du produit
    const productId = getProductId("id")
    
    // Récupération des éléments du DOM
    const imgContainer = document.querySelector(".item__img")
    const productName = document.getElementById("title")
    const productPrice = document.getElementById("price")
    const productDescription = document.getElementById("description")
    const color = document.getElementById("colors")

    // Si le serveur réponds
    try {
        const product = await fetchProduct (productId)
        console.log(product)

        const productImg = document.createElement("img")
        productImg.src = product.imageUrl
        imgContainer.innerHTML = ''
        imgContainer.appendChild(productImg)

        // Traitement des informations du produit contenu dans le tableau
        // productImg.src = product.imageUrl
        productName.innerHTML = product.name
        productPrice.innerHTML = product.price
        productDescription.innerHTML = product.description

        imgContainer.innerHTML = 
            `<img src="${product.imageUrl}" alt="${product.altTxt}">`

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
// affichageInfosProduits()

// Vérification des informations avant l'ajout au panier
function verificationDuPanier () {
    // Récupération des éléments du DOM
    const productQuantity = document.getElementById("quantity")
    const productColor = document.getElementById("colors")
    const idProduct = getProductId("id")
    // console.log(productId)

    // Récupération des choix de l'utilisateur
    const colorChoice = productColor.value
    const quantityChoice = parseInt(productQuantity.value, 10)

    // Vérification des conditions d'envoi au panier
    // Envoi un message d'erreur si la quantité est inférieur ou égale à 0 ou supérieur à 100
    if (quantityChoice <= 0 || quantityChoice > 100){
        return alert("Veuillez choisir une quantité")
    
    // Envoi un message d'erreur si la couleur n'a pas été séléctionné
    } else if (colorChoice == ""){
        alert("Veuillez choisir une couleur")
        return
    }

    // Sauvegarde des choix de l'utilisateur pour l'envoyer dans le localStorage
    const productChoice = {
        id: idProduct,
        quantity: quantityChoice,
        color: colorChoice,
    }
    console.log(productChoice, "choix quantité et couleur utilisateur")

    //
    // LocalStorage
    // 

    // Vérifie si le produit n'est pas déjà présent dans le localStorage ou crée un tableau vide
    let productLocalStorage = JSON.parse(localStorage.getItem("productsInCart")) || []

    console.log(productLocalStorage, "tableau produit dans le local storage")
    // console.log(localStorage, "local Storage")
    
    // Vérifie la présence d'un produit ayant la même ID et couleur dans le localStorage
    const productFound = productLocalStorage.find((item) =>          
        productChoice.id == item.id &&
        productChoice.color == item.color
    )
    // console.log(productFound, "ici")
    // console.log("Vérification doublon")

    // Si le produit n'existe pas dans le localStorage, ajoute le produit
    if (!productLocalStorage.length || !productFound) {
        productLocalStorage.push(productChoice)
        localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
        
        // console.log("crée un nouvel objet")
    } else {
        // Si un doublon est présent, incrémenter la quantité du produit
        productFound.quantity =         // la quantité du produit présent dans le localStorage est égale à
        productFound.quantity +         // la quantité du produit dans le localStorage +
        productChoice.quantity           // la quantité voulue par l'utilisateur
        localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))

        // console.log("doublon présent, augmente la quantité")
    }
}


// Séléction du bouton "Ajouter au panier"
const buttonAddCart = document.getElementById("addToCart")
// Au click sur le bouton, exécute la fonction de vérification du panier
buttonAddCart.addEventListener('click', function (){
    verificationDuPanier ()
})
affichageInfosProduits ()

