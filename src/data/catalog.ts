import type { Category, Product } from '@/types/catalog'

export const categories: Category[] = [
  {
    slug: 'clothing',
    name: 'Clothing',
    description: 'Easy, well-cut everyday pieces in natural fabrics.',
    highlights: ['Pre-washed for a soft hand-feel', 'Machine washable at 30°C', 'Cut to a true-to-size fit'],
  },
  {
    slug: 'beauty',
    name: 'Beauty',
    description: 'Skincare, colour and haircare that earn a place in your routine.',
    highlights: ['Dermatologist tested', 'Cruelty-free formulas', 'Free from parabens and sulphates'],
  },
  {
    slug: 'electronics',
    name: 'Electronics',
    description: 'Dependable gadgets and accessories for work, travel and home.',
    highlights: ['12-month manufacturer warranty', 'Includes cable and quick-start guide', 'Tested before dispatch'],
  },
  {
    slug: 'home-living',
    name: 'Home & Living',
    description: 'Calm, considered pieces for every room.',
    highlights: ['Made from durable, natural materials', 'Easy to clean and care for', 'Packed to arrive safely'],
  },
  {
    slug: 'accessories',
    name: 'Accessories',
    description: 'Bags, eyewear, watches and the small things that finish a look.',
    highlights: ['Hardwearing materials', 'Designed to age well', 'Gift-ready packaging'],
  },
]

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

const raw: Omit<Product, 'id'>[] = [
  // Clothing
  { name: 'Relaxed Linen Shirt', brand: 'Alder & Co', category: 'clothing', price: 48, rating: 4.6, reviewCount: 128, stock: 24, badge: 'New', description: 'A breathable, softly structured shirt in washed European linen. Wear it buttoned up or open over a tee.' },
  { name: 'Heavyweight Cotton Tee', brand: 'Alder & Co', category: 'clothing', price: 28, rating: 4.8, reviewCount: 412, stock: 60, badge: 'Bestseller', description: 'A dense 220gsm tee that holds its shape wash after wash, with a clean crew neckline.' },
  { name: 'Straight-Leg Denim', brand: 'Northfold', category: 'clothing', price: 79, compareAtPrice: 98, rating: 4.5, reviewCount: 203, stock: 18, badge: 'Sale', description: 'Mid-rise jeans with a roomy straight leg and a little stretch for all-day comfort.' },
  { name: 'Merino Crew Sweater', brand: 'Northfold', category: 'clothing', price: 95, rating: 4.7, reviewCount: 87, stock: 9, description: 'Fine-gauge merino that is warm without bulk. Naturally temperature regulating and odour resistant.' },
  { name: 'Quilted Utility Jacket', brand: 'Fieldwork', category: 'clothing', price: 129, rating: 4.4, reviewCount: 56, stock: 5, description: 'A light quilted jacket with four roomy pockets, ideal for the in-between seasons.' },
  { name: 'Pleated Midi Skirt', brand: 'Alder & Co', category: 'clothing', price: 59, rating: 4.3, reviewCount: 71, stock: 14, description: 'Fluid knife pleats and an elasticated back waist for a flattering, easy fit.' },
  // Beauty
  { name: 'Daily Mineral Sunscreen SPF 40', brand: 'Solenne', category: 'beauty', price: 24, rating: 4.7, reviewCount: 530, stock: 80, badge: 'Bestseller', description: 'A lightweight, non-greasy mineral sunscreen that sits well under makeup and leaves no white cast.' },
  { name: 'Hydrating Face Serum', brand: 'Solenne', category: 'beauty', price: 36, rating: 4.6, reviewCount: 318, stock: 40, description: 'Hyaluronic acid and niacinamide to plump, smooth and even out skin tone.' },
  { name: 'Clay Detox Mask', brand: 'Verde Botanics', category: 'beauty', price: 22, compareAtPrice: 28, rating: 4.4, reviewCount: 142, stock: 33, badge: 'Sale', description: 'A kaolin and green tea mask that draws out impurities without over-drying.' },
  { name: 'Soft Matte Lip Colour', brand: 'Maison Rouge', category: 'beauty', price: 18, rating: 4.5, reviewCount: 260, stock: 70, description: 'A comfortable, velvety matte with rich pigment that lasts through the day.' },
  { name: 'Argan Repair Hair Oil', brand: 'Verde Botanics', category: 'beauty', price: 29, rating: 4.6, reviewCount: 190, stock: 3, description: 'A fast-absorbing oil that tames frizz and adds shine without weighing hair down.' },
  { name: 'Vitamin C Night Cream', brand: 'Solenne', category: 'beauty', price: 42, rating: 4.5, reviewCount: 99, stock: 22, badge: 'New', description: 'A rich overnight cream that brightens and supports skin while you sleep.' },
  // Electronics
  { name: 'Wireless Noise-Cancelling Headphones', brand: 'Auralis', category: 'electronics', price: 189, compareAtPrice: 229, rating: 4.6, reviewCount: 840, stock: 15, badge: 'Sale', description: 'Adaptive noise cancelling, 40-hour battery life and plush memory-foam ear cushions.' },
  { name: 'Compact Bluetooth Speaker', brand: 'Auralis', category: 'electronics', price: 59, rating: 4.5, reviewCount: 612, stock: 44, badge: 'Bestseller', description: 'Surprisingly full sound from a pocketable, splash-proof speaker with 14 hours of playtime.' },
  { name: 'Fast-Charge Power Bank 20,000 mAh', brand: 'Voltix', category: 'electronics', price: 39, rating: 4.7, reviewCount: 455, stock: 52, description: 'Charges a phone up to four times, with 45W USB-C output that also powers most laptops.' },
  { name: 'Low-Profile Mechanical Keyboard', brand: 'Typewell', category: 'electronics', price: 119, rating: 4.6, reviewCount: 133, stock: 12, badge: 'New', description: 'Quiet tactile switches, multi-device Bluetooth and a slim aluminium frame.' },
  { name: 'Smartwatch Fit Series 4', brand: 'Pulsar', category: 'electronics', price: 149, rating: 4.2, reviewCount: 304, stock: 0, description: 'Heart-rate, sleep and workout tracking with a bright AMOLED display and 7-day battery.' },
  { name: 'USB-C Multiport Hub', brand: 'Voltix', category: 'electronics', price: 45, rating: 4.4, reviewCount: 220, stock: 31, description: 'HDMI 4K, SD reader, two USB-A ports and 100W pass-through charging in one small hub.' },
  // Home & Living
  { name: 'Stoneware Dinner Set, 12 Piece', brand: 'Hearth & Hand', category: 'home-living', price: 84, rating: 4.6, reviewCount: 98, stock: 10, description: 'A reactive-glaze stoneware set for four. Dishwasher and microwave safe.' },
  { name: 'Soy Candle, Cedar & Fig', brand: 'Hearth & Hand', category: 'home-living', price: 26, rating: 4.8, reviewCount: 376, stock: 55, badge: 'Bestseller', description: 'Hand-poured soy wax with a warm woody-green scent and a 45-hour burn time.' },
  { name: 'Washed Linen Duvet Cover', brand: 'Slumber Lane', category: 'home-living', price: 110, compareAtPrice: 135, rating: 4.5, reviewCount: 77, stock: 8, badge: 'Sale', description: 'Pre-washed European flax linen that gets softer with every wash. Pillowcases included.' },
  { name: 'Ceramic Table Lamp', brand: 'Lumen Studio', category: 'home-living', price: 68, rating: 4.4, reviewCount: 61, stock: 17, description: 'A sculptural ceramic base with a pleated linen shade for a soft, diffused glow.' },
  { name: 'Woven Storage Basket', brand: 'Hearth & Hand', category: 'home-living', price: 34, rating: 4.5, reviewCount: 143, stock: 28, description: 'Hand-woven seagrass with sturdy handles. Perfect for throws, toys or laundry.' },
  { name: 'Waffle Bath Towel Set', brand: 'Slumber Lane', category: 'home-living', price: 52, rating: 4.7, reviewCount: 205, stock: 36, badge: 'New', description: 'Three quick-drying waffle-weave cotton towels: bath, hand and face.' },
  // Accessories
  { name: 'Leather Card Holder', brand: 'Fieldwork', category: 'accessories', price: 32, rating: 4.6, reviewCount: 288, stock: 40, description: 'Vegetable-tanned leather with room for six cards and folded notes. Develops a patina over time.' },
  { name: 'Canvas Weekender Bag', brand: 'Fieldwork', category: 'accessories', price: 88, rating: 4.5, reviewCount: 94, stock: 11, description: 'Waxed canvas with leather trims, a zip-through main compartment and a detachable strap.' },
  { name: 'Polarised Aviator Sunglasses', brand: 'Coastline', category: 'accessories', price: 54, compareAtPrice: 68, rating: 4.3, reviewCount: 117, stock: 20, badge: 'Sale', description: 'Lightweight metal frames with polarised, UV400 lenses for glare-free clarity.' },
  { name: 'Minimal Steel Watch', brand: 'Pulsar', category: 'accessories', price: 99, rating: 4.6, reviewCount: 162, stock: 14, badge: 'New', description: 'A 38mm brushed steel case, sapphire-coated glass and a quick-release strap.' },
  { name: 'Ribbed Wool Beanie', brand: 'Northfold', category: 'accessories', price: 24, rating: 4.7, reviewCount: 241, stock: 45, description: 'A snug, double-layered beanie in soft lambswool.' },
  { name: 'Everyday Canvas Tote', brand: 'Alder & Co', category: 'accessories', price: 45, rating: 4.5, reviewCount: 178, stock: 26, badge: 'Bestseller', description: 'A roomy organic cotton tote with an inner zip pocket and reinforced handles.' },
]

// Sample prices above are written on a small scale; this converts them to realistic taka amounts.
const toTaka = (value: number) => Math.round((value * 50) / 10) * 10

export const products: Product[] = raw.map((item) => ({
  ...item,
  id: slugify(item.name),
  price: toTaka(item.price),
  compareAtPrice: item.compareAtPrice ? toTaka(item.compareAtPrice) : undefined,
}))
