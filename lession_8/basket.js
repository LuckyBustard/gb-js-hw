const basketTooltip = document.querySelector('.header .basket')

class BasketLine
{
    id
    name
    price
    count = 1
    
    constructor (id, name, price)
    {
        this.id = parseInt(id, 10)
        this.name = name
        this.price = parseFloat(price)
    }
    
    addProductCount()
    {
        this.count += 1
    }
    
    renderLine()
    {
        const element =  document.createElement('div')
        element.classList.add('basketRow')
        element.innerHTML = `
            <div>${this.name}</div>
            <div>${this.count}</div>
            <div>${this.price.toFixed(2)}</div>
            <div>${parseFloat(this.price * this.count).toFixed(2)}</div>
        `
        
        return element
    }
    
    getCount()
    {
        return this.count
    }
    
    getTotalPrice()
    {
        return parseFloat(this.price * this.count)
    }
    
    getProductLine()
    {
        return {
            id: this.id,
            name: this.name,
            price: this.price,
            count: this.count,
        }
    }
}

class Basket
{
    basket = {}
    basketTooltipBody
    tooltipCount
    basketTooltip
    basketTooltipTotalCount
    
    constructor (basketTooltipBody, basketTooltip)
    {
        this.basketTooltipBody = basketTooltipBody
        this.tooltipCount = basketTooltip.querySelector('span')
        this.basketTooltipTotalCount = basketTooltipBody.querySelector('.basketTotalValue')
        this.basketTooltip = basketTooltip
    
        this.toggleBasketTooltip = this.toggleBasketTooltip.bind(this)
        this.updateCount = this.updateCount.bind(this)
        basketTooltip.addEventListener('click', this.toggleBasketTooltip)
        this.updateCount()
    }
    
    addProduct(id, name, price)
    {
        if (this.basket[id]) {
            this.basket[id].addProductCount()
        } else {
            this.basket[id] = new BasketLine(id, name, price)
        }
    }
    
    clearRenderedBasketItems()
    {
        this.basketTooltipBody.querySelectorAll('.basketRow:not(.basketHeader)').forEach((node) => {
            node.parentNode.removeChild(node)
        })
    }
    
    toggleBasketTooltip(event)
    {
        event.stopPropagation()
        event.preventDefault()
    
        this.basketTooltipBody.classList.toggle('hidden')
    }
    
    updateCount()
    {
        this.tooltipCount.innerText = Object.values(this.basket).reduce((carry, item) => {
            return carry + item.getCount()
        }, 0)
    }
    
    updateTotalPrice()
    {
        this.basketTooltipTotalCount.innerText = Object.values(this.basket).reduce((carry, item) => {
            return parseFloat(item.getTotalPrice() + carry)
        }, 0.00).toFixed(2)
    }
    
    render()
    {
        this.updateCount()
        this.updateTotalPrice()
        const basketElementHead = this.basketTooltipBody.querySelector('.basketTotal')
        this.clearRenderedBasketItems()
        Object.values(this.basket).map((lineItem) => {
            return lineItem.renderLine()
        }).forEach((renderedItem) => {
            basketElementHead.parentNode.insertBefore(renderedItem, basketElementHead)
        })
    }
}

const basket = new Basket(basketTooltip, document.querySelector('.cartIconWrap'))

document.querySelector('.featured')
    .addEventListener('click', function (event) {
        event.stopPropagation()
        event.preventDefault()
        let featuredItem = event.target
        while (!featuredItem.classList.contains('featuredItem')) {
           featuredItem = featuredItem.parentNode
        }
    
        const data = featuredItem.dataset
        basket.addProduct(data.id, data.name, data.price)
        basket.render()
    })
