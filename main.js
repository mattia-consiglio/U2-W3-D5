const products = []
const prodctsRow = document.getElementById('products')

const displayProducts = (data, method = null) => {
	console.log(data)
	prodctsRow.innerHTML = ''
	if (method === 'GET') {
		products.length = 0
		products.push(...data)
	}
	if (products.length === 0) {
		prodctsRow.innerHTML = `<h1>Nessun prodotto presente</h1>`
		return
	}
	data.forEach(product => {
		const card = document.createElement('div')
		card.classList.add('col')
		card.innerHTML = `
				<div class="card h-100">
					<div class="card-image p-2">
						<img src="${product.imageUrl}" alt="${product.name}" class="img-fluid">
					</div>
					<div class="card-body flex-grow-1">
							<h3 class="card-title">${product.name}</h3>
							<p class="card-text fw-bold fs-4 text-primary">€ ${product.price}</p>
							<p class="card-text">${product.description}</p>
					</div>
				
					<div class="card-footer">
						<div class="row">
							<div class="col-12 col-lg-6 pe-1"><a href="/product.html?id=${product._id}" class="btn btn-primary w-100 ">Dettagli</a></div>
							<div class="col-12 col-lg-6 ps-1"><a href="##" class="btn btn-success w-100 ">Acquista</a></div>
						</div>
					</div>

				</div>
			`
		prodctsRow.appendChild(card)
	})
	hidePreloader()
}

new API('GET', displayProducts)
