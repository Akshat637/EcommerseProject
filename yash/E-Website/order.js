document.addEventListener('DOMContentLoaded', () =>{

    axios.get('http://localhost:3000/orders')
        .then(response => {
            console.log(response)
            if(response.status === 200){
                response.data.orders.forEach(product => {
                    console.log('yhi')
                    const cartContainer = document.getElementById('orders-content');
                    cartContainer.innerHTML += `<li> orderId = ${product.id} </li>`
                    for(let i=0; i< product.products.length; i++){
                        cartContainer.innerHTML += `<li> title = ${product.products[i].title}  OrderId = ${product.id}  userId = ${product.userId}  price = ${product.products[i].price}   <img width="100px" src=${product.products[i].imageUrl}> </img></li>`
                    }
                })
            }
            else{
                throw new Error('it is not working')
            }
        })
        .catch(error => {
            console.log('Error: something went wrong')
        })
})