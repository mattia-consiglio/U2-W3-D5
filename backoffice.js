let urlParms = new URLSearchParams(window.location.search)
let id = urlParms.get('id')
const titleInput = document.getElementById('title')
const descriptionInput = document.getElementById('description')
const brandInput = document.getElementById('brand')
const priceInput = document.getElementById('price')
const imageUrlInput = document.getElementById('imageUrl')
const addEditBtn = document.getElementById('addEditBtn')
const resetBtn = document.getElementById('resetBtn')
const deleteBtn = document.getElementById('deleteBtn')
const addBtn = document.getElementById('addBtn')
const previewImg = document.getElementById('previewImg')
const bsCollapse = new bootstrap.Collapse('#collapse', { toggle: false })
const products = []
let currId = ''
let action = 'add'

const updatePreviewImg = () => {
	previewImg.src = imageUrlInput.value
}

const fillForm = data => {
	titleInput.value = data.name
	descriptionInput.value = data.description
	brandInput.value = data.brand
	priceInput.value = data.price
	imageUrlInput.value = data.imageUrl
	addEditBtn.innerHTML = '<i class="bi bi-pencil"></i> Modifica'
	deleteBtn.style.display = 'inline'
	currId = data._id
	action = 'edit'
	bsCollapse.show()
	updatePreviewImg()
}

const resetForm = () => {
	titleInput.value = ''
	descriptionInput.value = ''
	brandInput.value = ''
	priceInput.value = ''
	imageUrlInput.value = ''
	action = 'add'
	currId = ''
	updatePreviewImg()
}

const deleteProduct = id => {
	if (confirm('Vuoi davvero cancellare il prodotto?')) {
		new API('DELETE', displayResult, id)
		new API('GET', displayProducts)
	}
}

const displayResult = data => {
	if (typeof data !== 'string') {
		if (data.error) {
			alert(data.message)
		} else {
			alert('Operazione eseguita con successo')
		}
	}
	resetForm()
	new API('GET', displayProducts)
}

resetBtn.addEventListener('click', e => {
	e.preventDefault()

	if (
		titleInput.value !== '' ||
		descriptionInput.value !== '' ||
		brandInput.value !== '' ||
		priceInput.value !== '' ||
		imageUrlInput.value !== ''
	) {
		if (confirm('Vuoi svuotare il form?')) {
			resetForm()
		}
	}
})

const getProduct = id => {
	return products.filter(products => products._id === id)[0]
}

const displayProducts = data => {
	console.log('displayProducts')
	const prodctsUl = document.getElementById('products')
	prodctsUl.innerHTML = ''
	products.length = 0

	products.push(...data)
	products.forEach(product => {
		const li = document.createElement('li')
		li.classList.add('list-group-item')
		li.innerHTML = `
	<div class="row align-items-center">
								<div class="col-6 col-lg-1">
									<img src="${product.imageUrl}" alt="${product.name}" class="img-fluid">
								</div>
								<div class="col-6 col-lg-9">
									<h5 class="mb-0">${product.name}</h5>
									<p class="mb-0">Brand: ${product.brand}</p>
									<p class="mb-0">Prezzo: €${product.price}</p>
									<p class="mb-0">ID: ${product._id}</p>
								</div>
								<div class="col-12 col-lg-2 mt-3 mt-lg-0">
									<button type="button" class="btn btn-primary w-100 mb-2" id="editBtn" onclick="fillForm(getProduct('${product._id}'))"><i class="bi bi-pencil"></i> Modifica</button>
									<button type="button" class="btn btn-danger w-100 mb-2" id="deleteBtn" onclick="deleteProduct('${product._id}')"><i class="bi bi-trash"></i> Elimina</button>
								</div>
							</div>
	`
		prodctsUl.appendChild(li)
	})
	hidePreloader()
}

addEditBtn.addEventListener('click', e => {
	e.preventDefault()
	const body = {
		name: titleInput.value.trim(),
		description: descriptionInput.value.trim(),
		brand: brandInput.value.trim(),
		price: parseFloat(priceInput.value),
		imageUrl: imageUrlInput.value.trim(),
	}
	if (action === 'add') {
		new API('POST', displayResult, '', body)
	} else {
		new API('PUT', displayResult, currId, body)
	}
})

deleteBtn.addEventListener('click', e => {
	e.preventDefault()
	deleteProduct(currId)
})

addBtn.addEventListener('click', e => {
	resetForm()
	addEditBtn.innerHTML = '<i class="bi bi-plus"></i> Aggiungi'
	deleteBtn.style.display = 'none'
	bsCollapse.show()
})

imageUrlInput.addEventListener('change', e => {
	updatePreviewImg()
})

if (id) {
	new API('GET', fillForm, id)
} else {
	addEditBtn.innerHTML = '<i class="bi bi-plus"></i> Aggiungi'
	deleteBtn.style.display = 'none'
}

new API('GET', displayProducts)
