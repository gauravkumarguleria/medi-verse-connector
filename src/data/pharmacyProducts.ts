
export interface PharmacyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  discount: number;
  prescription: boolean;
  inStock: boolean;
}

export const pharmacyProducts: PharmacyProduct[] = [
  {
    id: "med-001",
    name: "Pain Relief Tablets",
    description: "Fast-acting pain relief for headaches, muscle aches, and minor arthritis pain.",
    price: 8.99,
    category: "medication",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "med-002",
    name: "Allergy Relief Syrup",
    description: "24-hour relief from seasonal allergies with non-drowsy formula.",
    price: 12.49,
    category: "medication",
    image: "https://images.unsplash.com/photo-1576602976047-174e57a47881?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 10,
    prescription: false,
    inStock: true
  },
  {
    id: "med-003",
    name: "Antibiotic Capsules",
    description: "Broad-spectrum antibiotic for treating bacterial infections.",
    price: 24.99,
    category: "medication",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: true,
    inStock: true
  },
  {
    id: "med-004",
    name: "Blood Pressure Medication",
    description: "Daily medication to help control high blood pressure.",
    price: 32.50,
    category: "medication",
    image: "https://images.unsplash.com/photo-1550572017-9cf266090fcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: true,
    inStock: true
  },
  {
    id: "vit-001",
    name: "Multivitamin Complex",
    description: "Daily multivitamin with essential nutrients for overall health.",
    price: 15.99,
    category: "vitamins",
    image: "https://images.unsplash.com/photo-1577174881658-0f30ed549adc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 5,
    prescription: false,
    inStock: true
  },
  {
    id: "vit-002",
    name: "Vitamin D3 Supplements",
    description: "Supports bone health and immune function.",
    price: 13.49,
    category: "vitamins",
    image: "https://images.unsplash.com/photo-1571781565036-d3f759be73e4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "vit-003",
    name: "Vitamin C with Zinc",
    description: "Supports immune health during cold and flu season.",
    price: 9.99,
    category: "vitamins",
    image: "https://images.unsplash.com/photo-1597762470488-3877b1f538c6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 15,
    prescription: false,
    inStock: true
  },
  {
    id: "equ-001",
    name: "Digital Blood Pressure Monitor",
    description: "Accurate and easy-to-use digital blood pressure monitor for home use.",
    price: 45.99,
    category: "equipment",
    image: "https://images.unsplash.com/photo-1638090083904-c9273eb04af9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "equ-002",
    name: "Glucose Monitoring Kit",
    description: "Complete kit for monitoring blood glucose levels at home.",
    price: 59.99,
    category: "equipment",
    image: "https://images.unsplash.com/photo-1632833239869-a37e3a5806d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 10,
    prescription: false,
    inStock: true
  },
  {
    id: "sup-001",
    name: "Protein Powder",
    description: "High-quality protein supplement for muscle recovery and growth.",
    price: 29.99,
    category: "supplements",
    image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "sup-002",
    name: "Omega-3 Fish Oil",
    description: "Supports heart and brain health with essential fatty acids.",
    price: 19.99,
    category: "supplements",
    image: "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 5,
    prescription: false,
    inStock: true
  },
  {
    id: "per-001",
    name: "Gentle Face Cleanser",
    description: "Dermatologist-recommended face cleanser for sensitive skin.",
    price: 14.99,
    category: "personal care",
    image: "https://images.unsplash.com/photo-1556228842-7cca0536516d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "per-002",
    name: "SPF 50 Sunscreen",
    description: "Broad-spectrum protection against UVA and UVB rays.",
    price: 17.99,
    category: "personal care",
    image: "https://images.unsplash.com/photo-1594046243098-0fceea9d451e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "aid-001",
    name: "First Aid Kit",
    description: "Comprehensive first aid kit for home, office, or travel.",
    price: 22.99,
    category: "first aid",
    image: "https://images.unsplash.com/photo-1603398938378-e54eab446dde?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "aid-002",
    name: "Adhesive Bandages (Variety Pack)",
    description: "Assorted sizes of adhesive bandages for minor cuts and scrapes.",
    price: 6.99,
    category: "first aid",
    image: "https://images.unsplash.com/photo-1584308074647-94d637c41e9e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  },
  {
    id: "baby-001",
    name: "Baby Diaper Rash Cream",
    description: "Gentle, effective cream for treating and preventing diaper rash.",
    price: 8.49,
    category: "baby care",
    image: "https://images.unsplash.com/photo-1594842336999-08ab94f1f2fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    discount: 0,
    prescription: false,
    inStock: true
  }
];
