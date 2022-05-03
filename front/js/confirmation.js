// Récupération du numéro de commande sur l'URL
const getOrderId = (paramId) => new URL(document.location).searchParams.get(paramId)

const orderId = getOrderId("id")
// console.log(orderId)

// Affichage du numéro de commande
document.getElementById("orderId").innerHTML = orderId