import type { Product } from '@/types/catalog'

type ProductName = Product['name']

const photos: Record<ProductName, string> = {
  'Relaxed Linen Shirt': 'photo-1529139574466-a303027c1d8b',
  'Heavyweight Cotton Tee': 'photo-1521572163474-6864f9cf17ab',
  'Straight-Leg Denim': 'photo-1542272604-787c3835535d',
  'Merino Crew Sweater': 'photo-1598033129183-c4f50c736f10',
  'Quilted Utility Jacket': 'photo-1591047139829-d91aecb6caea',
  'Pleated Midi Skirt': 'photo-1490481651871-ab68de25d43d',

  'Daily Mineral Sunscreen SPF 40': 'photo-1608248543803-ba4f8c70ae0b',
  'Hydrating Face Serum': 'photo-1601049541289-9b1b7bbbfe19',
  'Clay Detox Mask': 'photo-1556229010-6c3f2c9ca5f8',
  'Soft Matte Lip Colour': 'photo-1596462502278-27bfdc403348',
  'Argan Repair Hair Oil': 'photo-1571781926291-c477ebfd024b',
  'Vitamin C Night Cream': 'photo-1522335789203-aabd1fc54bc9',

  'Wireless Noise-Cancelling Headphones': 'photo-1505740420928-5e560c06d30e',
  'Compact Bluetooth Speaker': 'photo-1608043152269-423dbba4e7e1',
  'Fast-Charge Power Bank 20,000 mAh': 'photo-1544244015-0df4b3ffc6b0',
  'Low-Profile Mechanical Keyboard': 'photo-1587829741301-dc798b83add3',
  'Smartwatch Fit Series 4': 'photo-1546868871-7041f2a55e12',
  'USB-C Multiport Hub': 'photo-1592899677977-9c10ca588bbd',

  'Stoneware Dinner Set, 12 Piece': 'photo-1578749556568-bc2c40e68b61',
  'Soy Candle, Cedar & Fig': 'photo-1603006905003-be475563bc59',
  'Washed Linen Duvet Cover': 'photo-1618221195710-dd6b41faaea6',
  'Ceramic Table Lamp': 'photo-1600566753086-00f18fb6b3ea',
  'Woven Storage Basket': 'photo-1600210492486-724fe5c67fb0',
  'Waffle Bath Towel Set': 'photo-1616486338812-3dadae4b4ace',

  'Leather Card Holder': 'photo-1584917865442-de89df76afd3',
  'Canvas Weekender Bag': 'photo-1553062407-98eeb64c6a62',
  'Polarised Aviator Sunglasses': 'photo-1491553895911-0055eca6402d',
  'Minimal Steel Watch': 'photo-1523275335684-37898b6baf30',
  'Ribbed Wool Beanie': 'photo-1551488831-00ddcb6c6bd3',
  'Everyday Canvas Tote': 'photo-1622560480654-d96214fdc887',
}

export const sampleProductImage = (name: ProductName) =>
  `https://images.unsplash.com/${photos[name]}?auto=format&fit=crop&w=900&h=1100&q=82`
