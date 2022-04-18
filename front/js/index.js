// Création d'article
const createArticle = product => {
    // Séléction de container
    const containerArticle = document.getElementById("items")

    // Création d'éléments
    const link = document.createElement("a")
    const article = document.createElement("article")
    const image = document.createElement("img")
    const titleH3 = document.createElement("h3")
    const paragraph = document.createElement("p")
    const splitUrl = product.imageUrl.split("/")[4]
    
    // Action effectuée sur les éléments crées
    link.href = `./product.html?id=${product._id}`
    image.src = `http://localhost:3000/images/${splitUrl}`
    image.alt = product.altTxt
    titleH3.innerHTML = product.name
    paragraph.innerHTML = product.description
    
    // Injection d'éléments dans le DOM
    article.append(image, titleH3, paragraph)
    link.appendChild(article)
    containerArticle.appendChild(link)
}


// Call API
const displayProductsInfos = async function () {
    const response = await fetch('http://localhost:3000/api/products')
    const products = await response.json()

    // console.log(products)
    // Envoi les éléments dans le tableau
    products.forEach(product => {
        createArticle(product)
    });
}

displayProductsInfos()
