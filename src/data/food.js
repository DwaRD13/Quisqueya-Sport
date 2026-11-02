// Stadium food. Prices are SIMULATED from Dominican street references plus a stadium markup:
// - Empanada RD$40–75 on the street (El Día, "El yaniqueque pasó a la categoría de empanada").
// - Presidente medium bottle ~RD$100 at retail (Dominican Today, 2025 price increase).
// No published source lists prices inside LIDOM stadiums. Photos: Wikimedia Commons.
const W = 'https://upload.wikimedia.org/wikipedia/commons/';
export const FOOD_PRICE_NOTE = 'Precio simulado con referencias de precios en RD y sobreprecio de estadio.';

const IMG = {
  empanada: `${W}f/fa/Traditional_fried_beef_empanadas_from_Argentina.jpg`,
  chimi: `${W}7/71/Chimichurri_burger.jpg`,
  picaPollo: `${W}1/18/Pica_pollo.jpg`,
  presidente: `${W}7/70/Presidente_beer.jpg`,
  presidenteBottle: `${W}c/c5/Presidente-Bier.jpg`,
  yaniqueque: `${W}d/d2/Johnnycake%2C_West_Indies_01.jpg`,
  quipe: `${W}7/70/Fried_kibbeh.JPG`,
  mani: `${W}3/36/Roasted_Peanuts_with_shell.jpg`,
  hotDog: `${W}a/ad/Hot_dog_01.jpg`,
};

const FOOD = [
  ['empanada-pollo', 'Empanada de pollo', 100, IMG.empanada, 'Frita al momento, rellena de pollo guisado.'],
  ['empanada-res', 'Empanada de res con queso', 120, IMG.empanada, 'Carne molida guisada con queso de freír.'],
  ['yaniqueque', 'Yaniqueque', 75, IMG.yaniqueque, 'Crujiente, como en Boca Chica.'],
  ['quipe', 'Quipe (2 unidades)', 120, IMG.quipe, 'Trigo y carne de res, frito.'],
  ['chimi', 'Chimi de res', 350, IMG.chimi, 'Pan de agua, carne, repollo, tomate y salsa rosada.'],
  ['pica-pollo', 'Pica pollo con tostones', 450, IMG.picaPollo, '3 piezas de pollo frito con tostones.'],
  ['hot-dog', 'Hot dog del estadio', 250, IMG.hotDog, 'Salchicha, ketchup, mostaza y papitas.'],
  ['mani', 'Maní tostado', 75, IMG.mani, 'La funda clásica de las gradas.'],
  ['presidente-pequena', 'Presidente pequeña', 175, IMG.presidenteBottle, 'Bien fría, vestida de novia.'],
  ['presidente-cubeta', 'Cubeta de 6 Presidente', 950, IMG.presidente, '6 pequeñas en hielo para compartir.'],
  ['combo-empanadas', 'Combo: 2 empanadas + Presidente', 350, IMG.empanada, 'Dos empanadas a elegir y una Presidente pequeña.'],
  ['combo-chimi', 'Combo: chimi + Presidente', 475, IMG.chimi, 'Chimi de res y una Presidente pequeña.'],
].map(([id, name, price, image, description]) => ({
  id: `food-${id}`,
  name,
  team: null,
  category: 'food',
  price,
  image,
  description,
  sizes: [],
  inStock: true,
  simulatedPrice: true,
}));

export default FOOD;
