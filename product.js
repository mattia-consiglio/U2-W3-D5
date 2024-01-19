const image = document.getElementById('image')
const title = document.getElementById('title')
const price = document.getElementById('price')
const description = document.getElementById('description')
const brand = document.getElementById('brand')
const id = document.getElementById('id')

const fillPage = data => {
	console.log(data)
	image.src = data.imageUrl
	image.alt = data.name
	title.innerText = data.name
	price.innerText = data.price
	description.innerText = data.description
	brand.innerText = data.brand
	id.innerText = data._id
	hidePreloader()
}

new API('GET', fillPage, new URLSearchParams(window.location.search).get('id'))
