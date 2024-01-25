const getItem = (spec) => {
  const item = {
    name: '',
    price: 0,
    quantity: 0,
    getPrice() {
      return this.price * this.quantity;
    },
  };
  return { ...item, ...spec };
};

const getItemIndex = (items, name) => {
  for (let i = 0; i !== items.length; i += 1) {
    if (items[i].name === name) {
      return i;
    }
  }
  return -1;
};

const DISCOUNTCODE = 'code50off';

const getDiscount = (code) => {
  const discounts = { [DISCOUNTCODE]: 0.5 }; // code: .5

  const k = discounts?.[code];
  if (k === undefined) {
    return 0;
  }
  return k;
};

const shoppingCart = {
  items: [],
  total: 0,
  code: '',
  addItem(item) {
    if (item.price > 0 || Number.isInteger(item.quantity) === true) {
      this.items.push(item);
      this.total += item.getPrice();
    }
  },
  removeItem(item) {
    const i = getItemIndex(this.items, item.name);
    if (i !== -1) {
      const [rmItem] = this.items.splice(i, 1);
      this.total -= rmItem.getPrice();
    }
  },
  updateQuantity(item) {
    const i = getItemIndex(this.items, item.name);
    if (i !== -1) {
      const oldItem = this.items[i];
      const updItem = { ...oldItem, ...item };
      this.total -= oldItem.getPrice();
      this.total += updItem.getPrice();
      this.items[i] = updItem;
    } else {
      this.addItem(item);
    }
  },
  calculateTotal() {
    this.total = this.items.reduce((sum, item) => sum + item.getPrice(), 0);
    this.applyDiscount(this.code);
    return this.total;
  },
  clearCart() {
    this.items = [];
    this.total = 0;
  },
  applyDiscount(code) {
    const discount = getDiscount(code) * this.total;
    this.total -= discount;
  },
};

// test

const goods = [
  ['aaa', 100, 1],
  ['aab', 2, 200],
  ['aac', 50, 1],
  ['aad', 10, 10],
  ['aae', 0.123, 3],
];

for (const [name, price, quantity] of goods) {
  shoppingCart.addItem(getItem({ name, price, quantity }));
}
console.log(shoppingCart.calculateTotal());

shoppingCart.removeItem({
  name: 'aac',
});
console.log(shoppingCart.calculateTotal());

shoppingCart.updateQuantity({ name: 'aab', quantity: 10 });
console.log(shoppingCart.calculateTotal());

shoppingCart.code = DISCOUNTCODE;
console.log(shoppingCart.calculateTotal());
