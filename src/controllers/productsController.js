const { response } = require('express');
const db = require('../database/models');



const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	// Root - Show all products
	index: (req, res) => {
		// Do the magic

		db.Product.findAll()
		.then(products =>{
			return res.render('products', {
			products,
			toThousand
		})
		}).catch(error => console.log(error))

		
	},

	// Detail - Detail from one product
	detail: (req, res) => {
		// Do the magic


		db.Product.findByPk(req.params.id)
		.then(product =>{
			return res.render('detail', {
			...product.dataValues,
			toThousand
		})
		}).catch(error => console.log(error))
		

	},

	// Create - Form to create
	create: (req, res) => {
		// Do the magic
		db.Category.findAll()
		.then(categories => {
			return res.render('product-create-form',{
				categories

			})
		}).catch(error => console.log(error))
		

	},

	// Create -  Method to store
	store: (req, res) => {
		// Do the magic,creando un producto
		const { name, price, description, discount,categoryId} = req.body;
        db.Product.create({
			name: name.trim(),
			price,
			discount: discount || 0,
			categoryId,
			description: description.trim(),
			image: null
		})
        .then(product =>{
			return res.redirect('/products')
		})
		.catch(error => console.log(error))
		

		
		
	},

	// Update - Form to edit
	edit: (req, res) => {
		// Do the magic
		const categories = db.Category.findAll()
		const product = db.Product.findByPk(req.params.id)
        
		//traer objetos en paralelos
		Promise.all([categories,product])

		.then(([categories,product]) =>{
			return res.render('product-edit-form', {
				categories,
			...product.dataValues
		})
		})
		.catch(error => console.log(error))

		
	},
	// Update - Method to update
	update: (req, res) => {
		// Do the magic
		const { name, price, description, discount, categoryId } = req.body;
        db.Product.update(
			{
				name: name.trim(),
			price,
			discount,
			categoryId,
			description: description.trim(),
			image: null

		},
		{  
			where : {
				id : req.params.id
			}

		}
		).then(response => {
			console.log(response);
			return res.redirect('/products/detail/' + req.params.id);
		}).catch(error => console.log(error));
		
	},

	// Delete - Delete one product from DB
	destroy: (req, res) => {
		// Do the magic
		db.product.destroy({
			where: {
				id: req.params.id
			}
		}).then(response => {
			console.log(response)
			return res.redirect('/products')
		})
		.catch(error => console.log(error));
		
		
		
	}
};

module.exports = controller;