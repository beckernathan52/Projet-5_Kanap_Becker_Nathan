// Fonction Call API via l'ID du produit
import {fetchProduct} from "./function.js"

// Récupération des données du localStorage
let productLocalStorage = JSON.parse(localStorage.getItem("productsInCart"))

// 
// Affichage des produits dans le panier
// 
const displayProductsInCart = async function () {
    // Si le panier est vide
    if(productLocalStorage === null || productLocalStorage == 0) {
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
        const promises = productLocalStorage.map(async product => {
          const myProduct = await fetchProduct(product.id)
          // console.log(myProduct)
          containerArticle.innerHTML += 
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
}
await displayProductsInCart()


// 
// Gestion de modification et mise à jour des quantités
// 
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
            // Remplace la quantité du produit trouvé par la quantité saisie
            if (productFound.quantity != newQuantity) {
                productFound.quantity = newQuantity
                // console.log(productLocalStorage,"après")
            }
            localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
            
            totalQuantity()
            totalPrice()
        })
    })
}
updateQuantity()

// 
// Suppression d'un produit
// 
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
            
            location.reload()
        })
    })
}
deleteProduct ()
////////////////////////////////////////////////////////////////////////////
///////////////// Affichage quantité totale et prix total //////////////////
////////////////////////////////////////////////////////////////////////////
// 
// Quantité Total
// 
function totalQuantity () {
    // Séléction des conteneurs
    const quantityArticle = document.getElementById("totalQuantity")
    let totalArticle = 0 

    productLocalStorage.forEach(product => {
        const quantityProduct = product.quantity
        totalArticle += quantityProduct
    })

    quantityArticle.innerHTML = `${totalArticle}`
}
totalQuantity()

// 
// Prix Total
// 
function totalPrice () {
    // Défini un prix de base
    let priceIndex = 0
    // Séléction du conteneur
    const priceContainer = document.getElementById("totalPrice")

    productLocalStorage.forEach(async product => {
        const myProduct = await fetchProduct(product.id)
        // Prix du produit * quantité du produit
        priceIndex += myProduct.price * product.quantity
        // Affichage du prix total
        priceContainer.innerHTML = `${priceIndex}`
    }) 
}
totalPrice()

////////////////////////////////////////////////////////////////////////////
//////////////////////////////// Formulaire ////////////////////////////////
////////////////////////////////////////////////////////////////////////////


function formOrder () {
    // Création d'un objet pour toutes les informations du formulaire
    const contact = {
      firstName: document.getElementById("firstName").value,
      lastName: document.getElementById("lastName").value,
      address: document.getElementById("address").value,
      city: document.getElementById("city").value,
      email: document.getElementById("email").value,
    }
    // 
    // Vérification du prénom
    // 
    function checkFirstName () {
      document.getElementById("firstNameErrorMsg").innerHTML = ""
      if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.firstName)) {
        return true
      } else {
          document.getElementById("firstNameErrorMsg").innerHTML = "Veuillez saisir un prénom valide"
      }
    }
    // 
    // Vérification du nom
    // 
    function checkLastName () {
      document.getElementById("lastNameErrorMsg").innerHTML = ""
      if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.lastName)) {
        return true
      } else {
          document.getElementById("lastNameErrorMsg").innerHTML = "Veuillez saisir un nom valide"
      }
    }

    // 
    // Vérification de l'adresse
    // 
    function checkAdress () {
      document.getElementById("addressErrorMsg").innerHTML = ""
      if (/^[A-Za-z0-9\s]{3,100}$/.test(contact.address)) {
        return true
      } else {
          document.getElementById("addressErrorMsg").innerHTML = "Veuillez saisir une adresse valide"
      }
    }
    // 
    // Vérification de la ville
    // 
    function checkCity () {
      document.getElementById("cityErrorMsg").innerHTML = ""
      if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.city)) {
        console.log("ici")
        return true
      } else {
          document.getElementById("cityErrorMsg").innerHTML = "Veuillez saisir un nom de ville valide"
      }
    }

    // 
    // Vérification de l'email
    // 
    function checkEmail () {
      document.getElementById("emailErrorMsg").innerHTML = ""
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email)) {
        console.log("ici")
        return true
      } else {
          document.getElementById("emailErrorMsg").innerHTML = "Veuillez saisir une adresse email valide"
      }
    }
    // 
    // Vérification de la ville
    // 
    function checkCity () {
      document.getElementById("cityErrorMsg").innerHTML = ""
      if (/^([A-Za-z]{3,20})?([-]{0,1})?([A-Za-z]{3,20})$/.test(contact.city)) {
        console.log("ici")
        return true
      } else {
          document.getElementById("cityErrorMsg").innerHTML = "Veuillez saisir un nom de ville valide"
      }
    }

    // 
    // Vérification de l'email
    // 
    function checkEmail () {
      document.getElementById("emailErrorMsg").innerHTML = ""
      if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(contact.email)) {
        console.log("ici")
        return true
      } else {
          document.getElementById("emailErrorMsg").innerHTML = "Veuillez saisir une adresse email valide"
      }
    }
    //
    // Vérification du de l'ensemble des champs du formulaire 
    //
    function formCheck () {
      if(
          checkFirstName(),
          checkLastName(),
          checkAdress(),
          checkCity(),
          checkEmail()
      ) {
          return true
      } else {
          alert("Une erreur est survenue! Veuillez vérifier les informations saisies.")
      }
    }
    formCheck()
}



// Séléction du boutton "Commander"
const orderButton = document.getElementById("order")
// Event listenner sur le bouton
orderButton.addEventListener('click', function (e){
    e.preventDefault()
    formOrder()
})