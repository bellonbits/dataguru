// Practice data for the DAX lab. Deterministic (seeded) so answers are stable for exercises.
function rng(seed) { let s = seed; return () => (s = (s * 1664525 + 1013904223) % 4294967296) / 4294967296; }

const REGIONS = { West: ['California', 'Oregon', 'Washington'], East: ['New York', 'Maine', 'Florida'], North: ['Minnesota', 'Michigan'], South: ['Texas', 'Georgia'] };
const PRODUCTS = [
  { ProductID: 'P001', ProductName: 'Trail Bike', Category: 'Bikes', Subcategory: 'Mountain', Price: 850 },
  { ProductID: 'P002', ProductName: 'City Bike', Category: 'Bikes', Subcategory: 'Road', Price: 520 },
  { ProductID: 'P003', ProductName: 'Helmet', Category: 'Gear', Subcategory: 'Safety', Price: 60 },
  { ProductID: 'P004', ProductName: 'Gloves', Category: 'Gear', Subcategory: 'Apparel', Price: 25 },
  { ProductID: 'P005', ProductName: 'Water Bottle', Category: 'Accessories', Subcategory: 'Hydration', Price: 12 },
  { ProductID: 'P006', ProductName: 'Bike Lock', Category: 'Accessories', Subcategory: 'Security', Price: 35 },
];

function makeSales() {
  const r = rng(42), rows = [];
  const regionNames = Object.keys(REGIONS);
  for (let i = 0; i < 72; i++) {
    const region = regionNames[Math.floor(r() * regionNames.length)];
    const state = REGIONS[region][Math.floor(r() * REGIONS[region].length)];
    const p = PRODUCTS[Math.floor(r() * PRODUCTS.length)];
    const year = r() < 0.45 ? 2021 : 2022;
    const month = 1 + Math.floor(r() * 12), day = 1 + Math.floor(r() * 27);
    const qty = 1 + Math.floor(r() * 6);
    const pad = n => String(n).padStart(2, '0');
    rows.push({
      Date: `${year}-${pad(month)}-${pad(day)}`, Month: `${year}-${pad(month)}-01`, Year: year,
      Region: region, State: state, Category: p.Category, Subcategory: p.Subcategory, Product: p.ProductName,
      Price: p.Price, Quantity: qty, SalesAmount: p.Price * qty,
    });
  }
  return rows.sort((a, b) => a.Date.localeCompare(b.Date));
}

export const DAX_TABLES = () => ({
  Sales: { cols: ['Date', 'Month', 'Year', 'Region', 'State', 'Category', 'Subcategory', 'Product', 'Price', 'Quantity', 'SalesAmount'], rows: makeSales() },
  Products: { cols: ['ProductID', 'ProductName', 'Category', 'Subcategory', 'Price'], rows: PRODUCTS.map(p => ({ ...p })) },
  Customers: {
    cols: ['CustomerName', 'Age', 'Gender', 'City'],
    rows: [['Ava Stone', 24, 'Female', 'Austin'], ['Ben Ortiz', 41, 'Male', 'Boston'], ['Chloe Kim', 33, 'Female', 'Seattle'], ['Dev Patel', 52, 'Male', 'Denver'], ['Ella Ross', 29, 'Female', 'Miami'], ['Finn Cole', 17, 'Male', 'Austin'], ['Gia Bell', 61, 'Female', 'Boston'], ['Hugo Lane', 38, 'Male', 'Seattle']]
      .map(([CustomerName, Age, Gender, City]) => ({ CustomerName, Age, Gender, City })),
  },
  Employees: {
    cols: ['Name', 'Age', 'Salary', 'Department', 'HireDate'],
    rows: [['Ada', 27, 52000, 'Sales', '2019-03-11'], ['Bola', 34, 71000, 'Finance', '2016-07-01'], ['Cyn', 29, 64000, 'IT', '2020-01-20'], ['Dan', 45, 93000, 'IT', '2011-09-05'], ['Eve', 25, 48000, 'Sales', '2022-02-14'], ['Fay', 38, 80500, 'Finance', '2015-05-23']]
      .map(([Name, Age, Salary, Department, HireDate]) => ({ Name, Age, Salary, Department, HireDate })),
  },
  Orders: {
    cols: ['order_id', 'customer_id', 'order_total', 'order_date'],
    rows: [[1, 1, 250, '2022-01-01'], [2, 2, 150, '2022-02-01'], [3, 1, 100, '2022-03-01'], [4, 3, 300, '2022-04-01'], [5, 2, 200, '2022-05-01']]
      .map(([order_id, customer_id, order_total, order_date]) => ({ order_id, customer_id, order_total, order_date })),
  },
  Tasks: {
    cols: ['name', 'due_date'],
    rows: [['Write report', '2020-01-10'], ['Ship release', '2099-12-31'], ['Plan sprint', '2020-06-01']].map(([name, due_date]) => ({ name, due_date })),
  },
});
export const DAX_RELATIONS = [{ from: 'Sales.Product', to: 'Products.ProductName' }];
