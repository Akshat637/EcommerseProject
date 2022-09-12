const Product = require('../models/product');
const Cart = require('../models/cart');
const Order = require('../models/order');



// OLD CODE ----------------------------->
// exports.getProducts = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.json({products, success: true})
//       // res.render('shop/product-list', {
//       //   prods: products,
//       //   pageTitle: 'All Products',
//       //   path: '/products'
//       // });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };


// NEW CODE ------------------------>

exports.getProducts = (req, res, next) => {
  // Product.findAll({limit:2})
  const page = req.query.page;
  let totalItems;
  Product.count()
    .then((numProducts) => {
      totalItems = numProducts;
      console.log(totalItems);
      return Product.findAll({ offset: (page - 1) * 4, limit: 4 })
    })

    .then(products => {
      console.log(products)
      res.json({
        products, success: true,
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: 2 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        PreviousPage: page - 1,
        lastPage: Math.ceil(totalItems / 2)
      })
      //   res.render('shop/product-list', {
      //     prods: products,
      //     pageTitle: 'All Products',
      //     path: '/products'
      //   });
    })
    .catch(err => console.log(err));
};


exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  // Product.findAll({ where: { id: prodId } })
  //   .then(products => {
  //     res.render('shop/product-detail', {
  //       product: products[0],
  //       pageTitle: products[0].title,
  //       path: '/products'
  //     });
  //   })
  //   .catch(err => console.log(err));
  Product.findByPk(prodId)
    .then(product => {
      res.render('shop/product-detail', {
        product: product,
        pageTitle: product.title,
        path: '/products'
      });
    })
    .catch(err => console.log(err));
};

exports.getIndex = (req, res, next) => {
  const page = +req.query.page || 1;   //why we write || 1
  let totalItems;
  Product.count()
    .then((numProducts) => {
      totalItems = numProducts;
      console.log(totalItems);
      return Product.findAll({ offset: (page - 1) * 2, limit: 4 })
    })
    .then(products => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        currentPage: page,
        hasNextPage: 2 * page < totalItems,
        hasPreviousPage: page > 1,
        nextPage: page + 1,
        PreviousPage: page - 1,
        lastPage: Math.ceil(totalItems / 2)
      });
    })
    .catch(err => {
      console.log(err);
    });
}

// exports.getIndex = (req, res, next) => {
//   Product.findAll()
//     .then(products => {
//       res.render('shop/index', {
//         prods: products,
//         pageTitle: 'Shop',
//         path: '/'
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

exports.getCart = (req, res, next) => {
  req.user
    .getCart()
    .then(cart => {
      return cart
        .getProducts()
        .then(products => {
          res.status(200).json({
            success: true,
            products: products
          })
          // res.render('shop/cart', {
          //   path: '/cart',
          //   pageTitle: 'Your Cart',
          //   products: products
          // });
        })
        .catch(err => { res.status(500).json({ success: false, message: err }) });
    })
    .catch(err => res.status(500).json({ success: false, message: err }));
};

exports.postCart = (req, res, next) => {

  if (!req.body.productId) {
    return res.status(400).json({ success: false, message: 'product id is missing' })
  }
  const prodId = req.body.productId;
  let fetchedCart;
  let newQuantity = 1;
  req.user
    .getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      let product;

      if (product) {
        const oldQuantity = product.cartItem.quantity;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(prodId);
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { quantity: newQuantity }
      });
    })
    .then(() => {
      // res.redirect('/cart');
      res.status(200).json({ success: true, message: 'Successfuly added to the Product' })
    })
    .catch(err => {
      res.status(500).json({ success: false, message: 'Error Occured' })
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  if (!req.body.productId) {
    return res.status(400).json({ success: false, message: 'product id is missing' })
  }
  const prodId = req.body.productId;
  req.user
    .getCart()
    .then(cart => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then(products => {
      const product = products[0];
       product.cartItem.destroy();
       res.status(200).json({success: true, message: 'Succesfully Deleted'})
    })
    // .then(result => {
    //   // res.redirect('/cart');
    //   res.status(200).json({success : true});
    // })
    // res.status(500).json({success: false, message: "EROOR"})
    // .catch(err => console.log(err));
};
exports.postOrder = (req, res, next) => {
  let fetchCart;
  req.user
    .getCart()
    .then(cart => {
      fetchCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      return req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity };
            return product;
          }));
        })
        .catch(err => {
          console.log(err);
        })
        .then(result => {
          return fetchCart.setProducts(null);

        })
        .then(result => {
          // res.redirect('/orders');
          res.status(200).json({message: 'order placed'})
        })
    })
    .catch(err => {
      res.status(500).json({message: "Error Occured"})
      // console.log(err);
    })
}

exports.getOrders = (req, res, next) => {
  req.user
    .getOrders({include: ['products']})
    .then(orders => {
      res.status(200).json({
        success: true,
        orders: orders
      })
      // res.render('shop/orders', {
      //   path: '/orders',
      //   pageTitle: 'Your Orders',
      //   orders: orders
      // })

    });
};


