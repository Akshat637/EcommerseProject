const cart_items = document.querySelector('#cart .cart-items');
let total_cart_price = document.querySelector('#total-value').innerText;


const parentContainer = document.getElementById('EcommerceContainer');
parentContainer.addEventListener('click', (e) => {

    if (e.target.className == 'shop-item-button') {
        const id = e.target.parentNode.parentNode.id
        const name = document.querySelector(`#${id} h3`).innerText;
        // const img_src = document.querySelector(`#${id} img`).src;
        // const price = e.target.parentNode.firstElementChild.firstElementChild.innerText;
        // let total_cart_price = document.querySelector('#total-value').innerText;
        // if (document.querySelector(`#in-cart-${id}`)) {
        //     alert('This item is already added to the cart');
        //     return
        // }
        //     document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) + 1
        //     const cart_item = document.createElement('div');
        //     cart_item.classList.add('cart-row');
        //     cart_item.setAttribute('id', `in-cart-${id}`);
        //     total_cart_price = parseFloat(total_cart_price) + parseFloat(price)
        //     total_cart_price = total_cart_price.toFixed(2)
        //     document.querySelector('#total-value').innerText = `${total_cart_price}`;
        //     cart_item.innerHTML = `
        //     <span class='cart-item cart-column'>
        //     <img class='cart-img' src="${img_src}" alt="">
        //         <span>${name}</span>
        // </span>
        // <span class='cart-price cart-column'>${price}</span>
        // <span class='cart-quantity cart-column'>
        //     <input type="text" value="1">
        //     <button>REMOVE</button>
        // </span>`
        //     cart_items.appendChild(cart_item)

        const container = document.getElementById('container');
        const notification = document.createElement('div');
        notification.classList.add('notification');
        notification.innerHTML = `<h4>Your Product : <span>${name}</span> is added to the cart<h4>`;
        container.appendChild(notification);
        setTimeout(() => {
            notification.remove();
        }, 2500)
    }
    if (e.target.className == 'cart-btn-bottom' || e.target.className == 'cart-bottom' || e.target.className == 'cart-holder') {
        const cartContainer = document.getElementById('cart-items');
        total_cart_price.innerHTML = '';
        cartContainer.innerHTML = '';

        getCartDetails();
    }
    if (e.target.className == 'cancel') {
        document.querySelector('#cart').style = "display:none;"
    }
    if (e.target.className == 'purchase-btn') {
        if (parseInt(document.getElementById('total-value').innerText) === 0) {
            alert('You have Nothing in Cart , Add some products to purchase !');
            
        }
        else {

            axios.post('http://localhost:3000/create-order',) //{ productId: productId })

                .then(res => {
                    console.log(res);
                    if (res.status == 200) {

                        notifyUsers(res.data.message)
                        const cart_items = document.querySelector('#cart .cart-items');


                    } else {
                        throw new Error(res.data.message)
                    }

                })
                .catch(err => {
                    console.log(err);
                })
            alert('Thanks for the purchase')
        }

    }

    // if (e.target.innerText == 'REMOVE') {
    //     axios.post('http://localhost:3000/cart-delete-item', { 'productId': productId })
    //     .then(res => {
    //         console.log('res')
    //         if (res.status == 200) {
    //             cartRemove(productId)
    //             notifyUsers(res.data.message);
    //         }
    //         })
    //         .catch(err =>{
    //             console.log(err);
    //         })

//         let total_cart_price = document.querySelector('#total-value').innerText;
//         total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${e.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2);
//         document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
//         document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
//         e.target.parentNode.parentNode.remove()
    // }
//     cartRemove(productId)

})

window.addEventListener('DOMContentLoaded', () => {
    // ee.preventDefault();
    axios.get(`http://localhost:3000/products?page=1`).then((data) => {
        console.log(data);
        if (data.request.status === 200) {
            const products = data.data.products;
            const parentSection = document.getElementById('products');
            products.forEach(product => {
                const productHtml = `
                <div>
                <h4>${product.title}</h4>
                    <img src = ${product.imageUrl}>
                    <span>$<span>${product.price}</span></span>
                    <button onclick = 'addToCart(${product.id})'>Add To Cart </button>
                    </div>`

                parentSection.innerHTML += productHtml;
            })
        }
    })
})

const pagination_btn = document.querySelector('.pagination');
pagination_btn.addEventListener('click', (e) => {

    if (e.target.id == "?page=1" || e.target.id == "?page=2" || e.target.id == "?page=3") {
        axios.get(`http://localhost:3000/products/${e.target.id}`).then((data) => {
            console.log(data.data);
            const products = data.data.products;
            const parentSection = document.getElementById('products');
            parentSection.innerHTML = ' '

            products.forEach(product => {
                const productHtml = `
                <div id='album1'>
                    <div class="image-container">
                    <h4>${product.title}</h4>
                        <img class="prod-images"  src=${product.imageUrl}> </img>
                    </div>
                    <div class="prod-details">
                    <span>$<span>${product.price}</span></span>
                        <button class="shop-item-button" onClick="addToCart(${product.id})"  type='button'>ADD TO CART</button>.
                    </div>
                </div>
                `
                parentSection.innerHTML = parentSection.innerHTML + productHtml;
            });
        })
    }
})

function addToCart(productId) {
    axios.post('http://localhost:3000/cart', { productId: productId })
        .then((res) => {
            if (res.status === 200) {
                notifyUsers(res.data.message);
            } else {
                throw new Error(res.data.message);
            }
        })
        .catch((errMsg) => {
            console.log(errMsg);
            notifyUsers(errMsg)
        })
}


function getCartDetails() {

    axios.get('http://localhost:3000/cart')
        .then(res => {
            if (res.status === 200) {
                let total_cart_price = document.querySelector('#total-value').innerText = 0;

                res.data.products.forEach(product => {
                    const cartContainer = document.getElementById('cart-items');
                    //  total_cart_price = document.querySelector('#total-value').innerText;
                    total_cart_price = parseFloat(total_cart_price) + parseFloat(product.price)
                    total_cart_price = total_cart_price.toFixed(2)
                    console.log(total_cart_price)
                    document.querySelector('#total-value').innerText = `${total_cart_price}`

                    cartContainer.innerHTML += `<li>  ${product.title} - <img class='cart-img' src="${product.imageUrl}" alt=""> - ${product.cartItem.quantity} - ${product.price}
                    <button onclick="cartRemove(${product.id})"  >REMOVE</button>`
                })
                document.querySelector('#cart').style = "display:block;"
            } else {
                throw new Error('something went wrong')
            }


            // console.log(res);
        })
        .catch(err => {
            notifyUsers(err);
        })
}


function notifyUsers(message) {
    const container = document.getElementById('container');
    const notification = document.createElement('div');
    notification.classList.add('notification');
    notification.innerHTML = `<h4>${message}<h4>`;
    container.appendChild(notification);
    setTimeout(() => {
        notification.remove();
    }, 2500)
}




// const purchaseButton = document.getElementById('purchase_btn');
// purchaseButton.addEventListener('click', (productId) => {




//     axios.post('http://localhost:3000/create-order', { productId: productId })

//         .then(res => {
//             console.log(res);
//             if (res.status == 200) {

//                 notifyUsers(res.data.message)

//             } else {
//                 throw new Error(res.data.message)
//             }

//         })
//         .catch(err => {
//             console.log(err);
//         })

// })


// let cartRemove = document.getElementById('_id');
// cartRemove.addEventListener('click', (productId) => {
//     axios.delete('http://localhost:3000/cart', { productId: productId })
//         .then(res => {
//             console.log(res)
//         })
//         .catch(err => {
//             console.log("Error Something went Wrong")
//         })
// })

function cartRemove(productId) {
    axios.post('http://localhost:3000/cart-delete-item', { productId: productId })
        .then(res => {
            // console.log('res')
            if (res.status === 200) {

                let total_cart_price = document.querySelector('#total-value').innerText;
                total_cart_price = parseFloat(total_cart_price).toFixed(2) - parseFloat(document.querySelector(`#${productId.target.parentNode.parentNode.id} .cart-price`).innerText).toFixed(2);
                document.querySelector('.cart-number').innerText = parseInt(document.querySelector('.cart-number').innerText) - 1
                document.querySelector('#total-value').innerText = `${total_cart_price.toFixed(2)}`
                productId.target.parentNode.parentNode.remove()
            }
        })
        .catch(err => {
            console.log(err)
        })
}

