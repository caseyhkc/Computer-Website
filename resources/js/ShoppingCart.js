
var shoppingCart = new Vue(
{
	el: "#shoppingCart",
	data: 
	{	
		productList: data,
		cartList: [],
		searchType: "",
		searchName: "",
		searchBrand: "",
		total_price: 0.00,
		aboutProduct: { name: "", img: "/img/placeholder.png", price: 0.00, imgDetail: "/img/placeholder.png"}
	},
	methods:
	{
		addToCart(index)
		{

			var obj = {};
			Object.assign(obj,this.productList[index])
			var	matchingIndex = this.cartList.findIndex(x => x.id == obj.id)

			if( matchingIndex == -1)
			{	
				if(obj.qty <= 0)
				{
					SwalError('Unable to add.', 'Item exceeds quantity left in stock.');
				}
				else
				{
					obj.qty = 1;
					this.cartList.push(obj);
					this.total_price += this.productList[index].price;
				}
			}
			else
			{
				if(obj.qty <= this.cartList[matchingIndex].qty)
				{
					SwalError('Unable to add.', 'Item exceeds quantity left in stock.');
				}
				else
				{
					this.cartList[matchingIndex].qty += 1;
					this.total_price += this.productList[index].price;
				}
			}
			
			
		},

		removeFromCart(index)
		{
			var obj = this.cartList[index];

			obj.qty -= 1;

			this.total_price -= this.cartList[index].price;

			if(obj.qty <= 0)
			{
				this.cartList.splice(index, 1);
			}

		},

		search()
		{

			var url = "/Product/search?type=" + this.searchType + "&brand="+ this.searchBrand + "&name=" + this.searchName;
			jsonAjax(url, "GET", "", function(response) {shoppingCart.productList = response;}, alertError);
		},

		about(index)
		{
			this.aboutProduct = this.productList[index];
			toggleOverlay("#about-product-overlay");
		},

		formatPrice(value) 
		{
	       return val = (value).toFixed(2);	
	    },

	    clear()
	    {
	    	this.searchName = "";
	    	this.searchType = "";
	    	this.searchBrand = "";
	    	this.search();
	    },

	    recalculate()
	    {
	    	var total = 0;

	    	for(var i = 0; i < this.cartList.length; i++)
	    	{
	    		total += this.cartList[i].price * this.cartList[i].qty;
	    	}

	    	this.total_price = total;
	    }
	}
})

var orderDetail = new Vue(
{
	el: "#place-order",
	data: 
	{
		orderDetail: 
		{
			name: "",
			email: "",
			contact: "",
			address: ""
		},
		error: {},
	},
	methods:
	{
		handleSubmit(event)
		{	
			if(shoppingCart.cartList.length <= 0)
			{
				SwalError("Cart is empty. Unable to place order.", "");
				return 0;
			}
			var obj = {};
			Object.assign(obj, this.orderDetail);
			obj.cart = shoppingCart.cartList;
			obj.total_price = shoppingCart.formatPrice(shoppingCart.total_price);
			obj.searchName = shoppingCart.searchName;
			obj.searchType = shoppingCart.searchType;
			obj.searchBrand = shoppingCart.searchBrand;

			jsonAjax("/Order/PlaceOrder", "POST", JSON.stringify(obj) ,function(response)
				{
					if(response.Status == "Success")
					{
						location.replace(response.Link);
						return 0;
					}

					if(response.Status == "Quantity Error")
					{
						toggleOverlay("#place-order-overlay");
						shoppingCart.productList = response.Data;
						var data = response.Message;
						var txt ="";
						
						for(var i = 0; i < data.length; i++)
						{
							var	matchingIndex = shoppingCart.cartList.findIndex(x => x.id == data[i].id);

							var counter = i +1;
							if(data[i].qty <= 0)
							{
								txt += "<p>" + counter+ ". " + shoppingCart.cartList[matchingIndex].name + " <i class='fas fa-arrow-right'></i> 0(Removed)</p>"; 
								shoppingCart.cartList.splice(matchingIndex, 1);
							}
							else
							{
								shoppingCart.cartList[matchingIndex].qty = data[i].qty;
								txt += "<p>" + counter + ". " + shoppingCart.cartList[matchingIndex].name + " <i class='fas fa-arrow-right'></i> " + data[i].qty + "</p>"; 
							}
						}

						Swal.fire(
						{
							title: "Apologies, we are running out of stock for item(s) ordered.",
							html: '<p>Cart is automatically refreshed, changes are as follow:<p>' + txt,
						});
						shoppingCart.recalculate();
						return 0;
					}	

					if(response.Status == "Validation Error")
					{
						SwalError("Validation Error", '');
						orderDetail.error = response.Message;
						return 0;
					}

					if(response.Status == "Database Error")
					{
						SwalError("Database Error", "");
						return 0;
					}

				}, alertError);
		}
	}

})