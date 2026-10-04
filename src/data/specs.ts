import type { Product } from '@/types/catalog'

type Specs = Product['specs']

export const specsByName: Record<string, Specs> = {
  'Relaxed Linen Shirt': [['Material', '100% European linen'], ['Fit', 'Relaxed'], ['Sizes', 'S to XXL'], ['Care', 'Machine wash cold']],
  'Heavyweight Cotton Tee': [['Material', '100% combed cotton, 220gsm'], ['Fit', 'Regular'], ['Neckline', 'Crew'], ['Care', 'Machine wash at 30°C']],
  'Straight-Leg Denim': [['Material', '98% cotton, 2% elastane'], ['Fit', 'Straight leg, mid rise'], ['Sizes', '28 to 38'], ['Care', 'Wash inside out']],
  'Merino Crew Sweater': [['Material', '100% merino wool'], ['Knit', 'Fine gauge'], ['Fit', 'Regular'], ['Care', 'Hand wash or wool cycle']],
  'Quilted Utility Jacket': [['Shell', 'Recycled polyester'], ['Filling', 'Lightweight polyfill'], ['Pockets', 'Four'], ['Care', 'Machine wash cold']],
  'Pleated Midi Skirt': [['Material', 'Polyester crepe'], ['Length', 'Midi'], ['Waist', 'Elasticated back'], ['Care', 'Machine wash cold']],

  'Daily Mineral Sunscreen SPF 40': [['Size', '50 ml'], ['Protection', 'SPF 40, broad spectrum'], ['Skin type', 'All skin types'], ['Finish', 'Natural, no white cast']],
  'Hydrating Face Serum': [['Size', '30 ml'], ['Key ingredients', 'Hyaluronic acid, niacinamide'], ['Skin type', 'All skin types'], ['Use', 'Morning and night']],
  'Clay Detox Mask': [['Size', '100 ml'], ['Key ingredients', 'Kaolin clay, green tea'], ['Skin type', 'Oily, combination'], ['Use', '1 to 2 times a week']],
  'Soft Matte Lip Colour': [['Finish', 'Soft matte'], ['Weight', '3.5 g'], ['Wear time', 'Up to 8 hours'], ['Formula', 'Cruelty-free']],
  'Argan Repair Hair Oil': [['Size', '100 ml'], ['Key ingredient', 'Argan oil'], ['Hair type', 'All hair types'], ['Use', 'On damp or dry hair']],
  'Vitamin C Night Cream': [['Size', '50 ml'], ['Key ingredients', 'Vitamin C, peptides'], ['Skin type', 'Normal to dry'], ['Use', 'Evening']],

  'Wireless Noise-Cancelling Headphones': [['Battery life', 'Up to 40 hours'], ['Connectivity', 'Bluetooth 5.3'], ['Noise cancelling', 'Adaptive ANC'], ['Charging', 'USB-C'], ['Warranty', '12 months']],
  'Compact Bluetooth Speaker': [['Playtime', 'Up to 14 hours'], ['Water resistance', 'IPX5'], ['Connectivity', 'Bluetooth 5.3'], ['Charging', 'USB-C'], ['Warranty', '12 months']],
  'Fast-Charge Power Bank 20,000 mAh': [['Capacity', '20,000 mAh'], ['Output', '45W USB-C PD'], ['Ports', '2x USB-C, 1x USB-A'], ['Warranty', '12 months']],
  'Low-Profile Mechanical Keyboard': [['Switches', 'Low-profile tactile'], ['Connectivity', 'Bluetooth 5.1 and USB-C'], ['Layout', 'ANSI 75%'], ['Battery', 'Up to 3 months'], ['Warranty', '12 months']],
  'Smartwatch Fit Series 4': [['Display', '1.43 inch AMOLED'], ['Battery', 'Up to 7 days'], ['Water resistance', '5 ATM'], ['Sensors', 'Heart rate, SpO2, sleep'], ['Warranty', '12 months']],
  'USB-C Multiport Hub': [['Ports', 'HDMI 4K, 2x USB-A, SD, USB-C PD'], ['Pass-through charging', 'Up to 100W'], ['Material', 'Aluminium'], ['Warranty', '12 months']],

  'Stoneware Dinner Set, 12 Piece': [['Pieces', '12 (4 dinner, 4 side, 4 bowls)'], ['Material', 'Stoneware'], ['Finish', 'Reactive glaze'], ['Care', 'Dishwasher and microwave safe']],
  'Soy Candle, Cedar & Fig': [['Wax', 'Soy'], ['Burn time', 'About 45 hours'], ['Weight', '220 g'], ['Scent', 'Cedar and fig']],
  'Washed Linen Duvet Cover': [['Material', '100% washed linen'], ['Includes', 'Duvet cover and 2 pillowcases'], ['Sizes', 'Double, King'], ['Care', 'Machine wash at 40°C']],
  'Ceramic Table Lamp': [['Height', '45 cm'], ['Material', 'Ceramic base, linen shade'], ['Bulb', 'E27, up to 40W (not included)'], ['Cable', '1.8 m']],
  'Woven Storage Basket': [['Material', 'Seagrass'], ['Dimensions', '38 x 30 cm'], ['Handles', 'Yes'], ['Care', 'Wipe clean']],
  'Waffle Bath Towel Set': [['Pieces', '3 (bath, hand, face)'], ['Material', '100% cotton waffle'], ['Weight', '380 gsm'], ['Care', 'Machine wash at 40°C']],

  'Leather Card Holder': [['Material', 'Vegetable-tanned leather'], ['Capacity', '6 cards and folded notes'], ['Dimensions', '10 x 7 cm']],
  'Canvas Weekender Bag': [['Material', 'Waxed canvas, leather trims'], ['Capacity', '35 L'], ['Strap', 'Detachable'], ['Closure', 'Zip']],
  'Polarised Aviator Sunglasses': [['Frame', 'Metal'], ['Lenses', 'Polarised, UV400'], ['Fit', 'Medium'], ['Includes', 'Case and cleaning cloth']],
  'Minimal Steel Watch': [['Case', '38 mm brushed steel'], ['Glass', 'Sapphire-coated'], ['Strap', 'Quick-release'], ['Water resistance', '3 ATM']],
  'Ribbed Wool Beanie': [['Material', 'Lambswool'], ['Construction', 'Double-layer rib knit'], ['Fit', 'One size'], ['Care', 'Hand wash']],
  'Everyday Canvas Tote': [['Material', 'Organic cotton canvas'], ['Dimensions', '40 x 38 cm'], ['Pocket', 'Inner zip pocket'], ['Handles', 'Reinforced']],
}
