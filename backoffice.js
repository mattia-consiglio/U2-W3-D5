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
const toastContainer = document.getElementById('toastContainer')
let toastId = 0

const toastTemplate = (title, message, type = 'info') => {
	toastId++
	const color = type === 'info' ? 'primary' : type === 'success' ? 'success' : 'danger'
	return `
	<div id="toast-${toastId}" role="alert" aria-live="assertive" aria-atomic="true" class="toast" data-bs-autohide="false">
				<div class="toast-header">
					<i class="bi bi-square-fill text-${color} pe-2"></i>
					<strong class="me-auto">${title}</strong>
					<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
				</div>
				<div class="toast-body">
					${message}
				</div>
			</div>
	`
}

const showToast = (title, message, type = 'info') => {
	toastContainer.insertAdjacentHTML('beforeEnd', toastTemplate(title, message, type))
	const toastElement = document.getElementById('toast-' + toastId)
	const toast = new bootstrap.Toast(toastElement, {
		autohide: true,
		delay: 3000,
	})
	toast.show()
	toastElement.addEventListener(
		'hidden.bs.toast',
		() => {
			toastElement.remove()
		},
		{ once: true }
	)
}

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

const displayResult = (data, method) => {
	if (typeof data !== 'string') {
		if (data.error) {
			showToast('Errore', data.message, 'danger')
		} else {
			if (method === 'POST') {
				showToast('Prodotto aggiunto', 'Prodotto aggiunto con successo', 'success')
			}
			if (method === 'PUT') {
				showToast('Prodotto modificato', 'Prodotto modificato con successo', 'success')
			}
			if (method === 'DELETE') {
				showToast('Prodotto eliminato', 'Prodotto eliminato con successo', 'success')
			}
			new API('GET', displayProducts)
			resetForm()
		}
	}
}

const deleteProduct = id => {
	if (confirm('Vuoi davvero cancellare il prodotto?')) {
		new API('DELETE', displayResult, id)
	}
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

const displayProducts = (data, method = null) => {
	console.log(data)
	if (method === 'GET') {
		products.length = 0
		products.push(...data)
	}
	const prodctsUl = document.getElementById('products')
	prodctsUl.innerHTML = ''
	data.forEach(product => {
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
	if (
		titleInput.value === '' ||
		descriptionInput.value === '' ||
		brandInput.value === '' ||
		priceInput.value === '' ||
		imageUrlInput.value === '' ||
		priceInput.value < 0
	) {
		showToast('Errore', 'Compila tutti i campi', 'danger')
		return
	}
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
