class API {
	constructor(_method = 'GET', _callback, _id = '', _body = null) {
		this.method = _method
		this.callback = _callback
		this.id = _id
		this.body = _body
		this.request()
	}

	async request() {
		const options = {
			method: this.method,
			headers: {
				'Authorization':
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWFhMmU0NzE4N2U1YzAwMTgxNGM1ZWYiLCJpYXQiOjE3MDU2NTE3ODMsImV4cCI6MTcwNjg2MTM4M30.pkleiUx2AUFMgYWSAz04y5FpjTZAJFSFA5tVXIOuqQ0',
			},
		}
		if (this.body) {
			this.body = JSON.stringify(this.body)
			console.log(this.body)
			options.body = this.body
			options.headers['Content-Type'] = 'application/json'
		}

		this.myUrl = 'https://striveschool-api.herokuapp.com/api/product/'
		if (this.id !== '') {
			this.myUrl += `${this.id}`
		}

		return fetch(this.myUrl, options)
			.then(response => {
				if (!response.ok) {
					throw Error(response.statusText)
				}
				return response.json()
			})
			.then(data => {
				this.callback(data, this.method)
			})
			.catch(err => {
				console.log(err)
			})
	}
}

const hidePreloader = () => {
	const preloader = document.getElementById('preloader')
	preloader.style.setProperty('display', 'none', 'important')
}

const search = document.getElementById('search')

search.addEventListener('keyup', e => {
	const searchValue = search.value.trim().toLowerCase()
	if (searchValue === '') {
		displayProducts(products)
		return
	}
	const filteredProducts = products.filter(product => {
		return product.name.toLowerCase().includes(searchValue)
	})
	displayProducts(filteredProducts)
})

search.addEventListener('input', () => {
	if (search.value.trim() === '') {
		displayProducts(products)
	}
})
