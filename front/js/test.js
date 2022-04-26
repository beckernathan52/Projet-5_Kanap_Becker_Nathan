// 
// Suppression d'un produit
// 
// function deleteProduct () {
//     // Séléction du bouton "Supprimer"
//     const buttonDelete = document.getElementsByClassName('deleteItem')
//     // console.log(buttonDelete)

//     Array.from(buttonDelete).forEach(button => {
//         button.addEventListener("click", function(event){
//             // Séléction de l'article où l'événement a eu lieu
//             const articleTarget = event.target.closest("article")
//             // Récupération de l'Id et de la couleur du produit
//             const articleId = articleTarget.dataset.id
//             const articleColor = articleTarget.dataset.color
//             // Produit trouvé ayant le même Id et couleur
//             const productFound = productLocalStorage.find((item) => item.id === articleId && item.color === articleColor)
//             console.log(productFound,"productFound")
//             // Supprime le produit séléctionné



//             if (productFound != articleTarget) {
//                 localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))

//             } else {
//                 productLocalStorage.splice(productFound,1)
//                 console.log(productLocalStorage,"après")
//                 // localStorage.setItem("productsInCart", JSON.stringify(productLocalStorage))
//                 // location.reload()
//             }
//         })
//     })
// }
// deleteProduct ()
