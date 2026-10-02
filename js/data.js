// AdventureWorks Power BI Dashboard - Data Module
// All mock data embedded as JavaScript objects (no backend/fetch needed for file:// protocol)

// ============================================================
// EXECUTIVE DASHBOARD DATA
// ============================================================
const EXECUTIVE_DATA = {
  kpis: {
    revenue: { value: 24900000, label: "Revenue", display: "$24.9M" },
    profits: { value: 10500000, label: "Profits", display: "$10.5M" },
    orders: { value: 25200, label: "Orders", display: "25.2K" },
    returnRate: { value: 2.2, label: "Return Rate", display: "2.2%" }
  },
  revenueTrending: {
    title: "Revenue Trending",
    yMax: 2000000,
    months: [
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec",
      "Jan","Feb","Mar","Apr","May","Jun"
    ],
    years: [
      "2020","2020","2020","2020","2020","2020","2020","2020","2020","2020","2020","2020",
      "2021","2021","2021","2021","2021","2021","2021","2021","2021","2021","2021","2021",
      "2022","2022","2022","2022","2022","2022"
    ],
    values: [
      520000,580000,620000,590000,680000,720000,690000,750000,820000,880000,950000,1050000,
      1150000,1180000,1250000,1300000,1350000,1420000,1480000,1520000,1580000,1620000,1680000,1750000,
      1780000,1820000,1850000,1880000,1830000,1780000
    ]
  },
  categoryOrders: {
    title: "Order by Category",
    data: [
      { category: "Accessories", orders: 17000, color: "#5bbcc4" },
      { category: "Bikes", orders: 13900, color: "#1fd1c8" },
      { category: "Clothing", orders: 7000, color: "#94a3b8" }
    ]
  },
  top10Products: {
    title: "Top 10 Products",
    data: [
      { product: "AWC Logo Cap", orders: 2062, revenue: 35882, returnPct: 1.11 },
      { product: "Fender Set - Mountain", orders: 1975, revenue: 87041, returnPct: 1.36 },
      { product: "Mountain Bottle Cage", orders: 1896, revenue: 38062, returnPct: 2.02 },
      { product: "Mountain Tire Tube", orders: 2846, revenue: 28533, returnPct: 1.64 },
      { product: "Patch Kit/8 Patches", orders: 2952, revenue: 13506, returnPct: 1.61 },
      { product: "Road Tire Tube", orders: 2173, revenue: 17265, returnPct: 1.55 },
      { product: "Sport-100 Helmet, Black", orders: 1940, revenue: 65270, returnPct: 2.69 },
      { product: "Sport-100 Helmet, Blue", orders: 1995, revenue: 67120, returnPct: 3.21 },
      { product: "Sport-100 Helmet, Red", orders: 2099, revenue: 73444, returnPct: 3.35 },
      { product: "Water Bottle - 30 oz.", orders: 3983, revenue: 39755, returnPct: 1.95 }
    ]
  },
  monthlyKpiCards: {
    cards: [
      {
        title: "Monthly Revenue",
        value: "$1.83M",
        prevValue: "$1.77M",
        change: "+3.31%",
        trend: "up",
        color: "#38a174",
        sparkline: [1720000,1750000,1770000,1780000,1800000,1830000]
      },
      {
        title: "Monthly Orders",
        value: "2,146",
        prevValue: "2,165",
        change: "-0.88%",
        trend: "down",
        color: "#e74c38",
        sparkline: [2180,2170,2165,2155,2150,2146]
      },
      {
        title: "Monthly Returns",
        value: "166",
        prevValue: "169",
        change: "+1.78%",
        trend: "up",
        color: "#38a174",
        sparkline: [169,168,170,168,167,166]
      }
    ]
  },
  productTypeCards: {
    mostOrdered: { title: "Most Ordered Product Type", value: "Tires and Tubes" },
    mostReturned: { title: "Most Returned Product Type", value: "Shorts" }
  }
};

// ============================================================
// MANUAL TOOLTIP DATA (Page 5)
// ============================================================
const TOOLTIP_DATA = {
  summary: [
    { label: "Revenue", value: "$24,914,587" },
    { label: "Total profit", value: "$10,457,715" },
    { label: "Total order", value: "25,164" },
    { label: "Total returns", value: "1,809" },
    { label: "Return Rate", value: "2.17%" }
  ],
  subcategoryOrders: {
    title: "Orders by Subcategory",
    data: [
      { label: "Tires and Tubes", value: 9100, color: "#5bbcc4" },
      { label: "Road Bikes", value: 7100, color: "#1fd1c8" },
      { label: "Helmets", value: 6000, color: "#5bbcc4" },
      { label: "Mountain Bikes", value: 4700, color: "#1fd1c8" },
      { label: "Bottles and Cages", value: 4500, color: "#5bbcc4" }
    ]
  }
};

// ============================================================
// MAP VISUALIZATION DATA (Page 2)
// ============================================================
const MAP_DATA = {
  title: "Map Visualization",
  bubbleColor: "#5bbcc4",
  countries: [
    { name: "United States", lat: 39.8283, lng: -98.5795, revenue: 12500000, size: 45, continent: "North America" },
    { name: "Australia", lat: -25.2744, lng: 133.7751, revenue: 6200000, size: 32, continent: "Pacific" },
    { name: "Canada", lat: 56.1321, lng: -106.3468, revenue: 2400000, size: 22, continent: "North America" },
    { name: "United Kingdom", lat: 55.3781, lng: -3.4360, revenue: 1900000, size: 18, continent: "Europe" },
    { name: "France", lat: 46.2276, lng: 2.2137, revenue: 800000, size: 12, continent: "Europe" },
    { name: "Germany", lat: 51.1657, lng: 10.4515, revenue: 450000, size: 10, continent: "Europe" }
  ],
  regionFilters: ["Select all", "Europe", "North America", "Pacific"],
  regions: {
    "Europe": ["United Kingdom", "France", "Germany"],
    "North America": ["United States", "Canada"],
    "Pacific": ["Australia"]
  }
};

// ============================================================
// PRODUCT DASHBOARD DATA (Page 3)
// ============================================================
const PRODUCT_DATA = {
  title: "Product Dashboard",
  selectedProduct: "Patch Kit/8 Patches",
  gauges: [
    { label: "Monthly Order vs Target", value: 265, min: 0, max: 319, unit: "orders", color: "#5bbcc4" },
    { label: "Monthly Revenue vs Target", value: 1225, min: 0, max: 1494, unit: "$", color: "#5bbcc4" },
    { label: "Monthly Profit vs Target", value: 767, min: 0, max: 935, unit: "$", color: "#5bbcc4" }
  ],
  metrics: ["Order", "Profit", "Revenue", "Returns", "Return Rate"],
  profitData: {
    title: "Total profit / Adjusted Profit",
    weeks: [
      {"week":"2021-W27","totalProfit":198,"adjustedProfit":205},
      {"week":"2021-W28","totalProfit":203,"adjustedProfit":210},
      {"week":"2021-W29","totalProfit":195,"adjustedProfit":202},
      {"week":"2021-W30","totalProfit":210,"adjustedProfit":217},
      {"week":"2021-W31","totalProfit":205,"adjustedProfit":212},
      {"week":"2021-W32","totalProfit":208,"adjustedProfit":215},
      {"week":"2021-W33","totalProfit":192,"adjustedProfit":199},
      {"week":"2021-W34","totalProfit":215,"adjustedProfit":222},
      {"week":"2021-W35","totalProfit":218,"adjustedProfit":225},
      {"week":"2021-W36","totalProfit":201,"adjustedProfit":208},
      {"week":"2021-W37","totalProfit":222,"adjustedProfit":229},
      {"week":"2021-W38","totalProfit":225,"adjustedProfit":232},
      {"week":"2021-W39","totalProfit":210,"adjustedProfit":217},
      {"week":"2021-W40","totalProfit":230,"adjustedProfit":237},
      {"week":"2021-W41","totalProfit":235,"adjustedProfit":242},
      {"week":"2021-W42","totalProfit":220,"adjustedProfit":227},
      {"week":"2021-W43","totalProfit":240,"adjustedProfit":247},
      {"week":"2021-W44","totalProfit":242,"adjustedProfit":249},
      {"week":"2021-W45","totalProfit":228,"adjustedProfit":235},
      {"week":"2021-W46","totalProfit":245,"adjustedProfit":252},
      {"week":"2021-W47","totalProfit":248,"adjustedProfit":255},
      {"week":"2021-W48","totalProfit":232,"adjustedProfit":239},
      {week:"2021-W49",totalProfit:250,adjustedProfit:257},
      {"week":"2021-W50","totalProfit":255,"adjustedProfit":262},
      {"week":"2021-W51","totalProfit":238,"adjustedProfit":245},
      {"week":"2021-W52","totalProfit":258,"adjustedProfit":265},
      {"week":"2022-W01","totalProfit":252,"adjustedProfit":259},
      {"week":"2022-W02","totalProfit":245,"adjustedProfit":252},
      {"week":"2022-W03","totalProfit":260,"adjustedProfit":267},
      {"week":"2022-W04","totalProfit":262,"adjustedProfit":269},
      {"week":"2022-W05","totalProfit":248,"adjustedProfit":255},
      {"week":"2022-W06","totalProfit":265,"adjustedProfit":272},
      {"week":"2022-W07","totalProfit":268,"adjustedProfit":275},
      {"week":"2022-W08","totalProfit":255,"adjustedProfit":262},
      {"week":"2022-W09","totalProfit":270,"adjustedProfit":277},
      {"week":"2022-W10","totalProfit":272,"adjustedProfit":279},
      {"week":"2022-W11","totalProfit":258,"adjustedProfit":265},
      {"week":"2022-W12","totalProfit":275,"adjustedProfit":282},
      {"week":"2022-W13","totalProfit":278,"adjustedProfit":285},
      {"week":"2022-W14","totalProfit":265,"adjustedProfit":272},
      {"week":"2022-W15","totalProfit":280,"adjustedProfit":287},
      {"week":"2022-W16","totalProfit":282,"adjustedProfit":289},
      {"week":"2022-W17","totalProfit":268,"adjustedProfit":275}
    ]
  },
  ordersData: {
    title: "Orders",
    weeks: [
      {"week":"2021-W27","orders":52},{"week":"2021-W28","orders":58},{"week":"2021-W29","orders":55},
      {"week":"2021-W30","orders":62},{"week":"2021-W31","orders":59},{"week":"2021-W32","orders":65},
      {"week":"2021-W33","orders":54},{"week":"2021-W34","orders":68},{"week":"2021-W35","orders":70},
      {"week":"2021-W36","orders":60},{"week":"2021-W37","orders":72},{"week":"2021-W38","orders":75},
      {"week":"2021-W39","orders":63},{"week":"2021-W40","orders":78},{"week":"2021-W41","orders":80},
      {"week":"2021-W42","orders":66},{"week":"2021-W43","orders":82},{"week":"2021-W44","orders":85},
      {"week":"2021-W45","orders":67},{"week":"2021-W46","orders":88},{"week":"2021-W47","orders":90},
      {"week":"2021-W48","orders":69},{"week":"2021-W49","orders":92},{"week":"2021-W50","orders":95},
      {"week":"2021-W51","orders":68},{"week":"2021-W52","orders":70},{"week":"2022-W01","orders":72},
      {"week":"2022-W02","orders":74},{"week":"2022-W03","orders":76},{"week":"2022-W04","orders":78},
      {"week":"2022-W05","orders":73},{"week":"2022-W06","orders":80},{"week":"2022-W07","orders":82},
      {"week":"2022-W08","orders":75},{"week":"2022-W09","orders":85},{"week":"2022-W10","orders":88},
      {"week":"2022-W11","orders":77},{"week":"2022-W12","orders":90},{"week":"2022-W13","orders":92},
      {"week":"2022-W14","orders":78},{"week":"2022-W15","orders":95},{"week":"2022-W16","orders":98},
      {"week":"2022-W17","orders":80}
    ],
    yMax: 100
  },
  whatIfTarget: 240
};

// ============================================================
// CUSTOMER DASHBOARD DATA (Page 4)
// ============================================================
const CUSTOMER_DATA = {
  title: "Customer Dashboard",
  kpis: [
    { value: "17.2K", label: "Customer" },
    { value: "$1,074", label: "Revenue Per Customer" }
  ],
  incomeDonut: {
    title: "Orders by Income",
    colors: ["#5bbcc4", "#ffd93d", "#94a3b8"],
    data: [
      { label: "High", value: 2450 },
      { label: "Average", value: 10450 },
      { label: "Low", value: 9210 }
    ]
  },
  occupationDonut: {
    title: "Orders by Occupation",
    colors: ["#5bbcc4", "#ffd93d", "#94a3b8"],
    data: [
      { label: "Management", value: 3890 },
      { label: "Professional", value: 7140 },
      { label: "Skilled Manual", value: 5340 }
    ]
  },
  revenuePerCustomer: {
    title: "Revenue Per Customer",
    months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr"],
    years: ["2021","2021","2021","2021","2021","2021","2021","2021","2021","2021","2021","2021","2022","2022","2022","2022"],
    values: [1020,1050,1080,1090,1110,1085,1450,1120,1140,1160,1180,1200,1220,1240,1260,1280]
  },
  topCustomer: {
    name: "Mr. Maurice Shan",
    revenue: "12.4K",
    orders: 6,
    customerKey: 11433
  },
  yearRange: { min: 2021, max: 2022, default: [2021, 2022] }
};

// ============================================================
// CUSTOMER TABLE DATA (100 customers)
// ============================================================
const CUSTOMER_TABLE_DATA = generateCustomers();

function generateCustomers() {
  const first9 = [
    { key: 11433, name: "Mr. Maurice Shan", orders: 6, revenue: 12406 },
    { key: 11439, name: "Mrs. Janet Munoz", orders: 6, revenue: 12015 },
    { key: 11241, name: "Mrs. Lisa Cai", orders: 7, revenue: 11330 },
    { key: 11417, name: "Mrs. Lacey Zheng", orders: 7, revenue: 11086 },
    { key: 11420, name: "Mr. Jordan Turner", orders: 7, revenue: 11022 },
    { key: 11242, name: "Mr. Larry Munoz", orders: 7, revenue: 10852 },
    { key: 11425, name: "Mrs. Ariana Gray", orders: 6, revenue: 10391 },
    { key: 11429, name: "Mr. Marco Lopez", orders: 7, revenue: 10290 },
    { key: 12308, name: "Mrs. Margaret He", orders: 4, revenue: 9267 }
  ];

  const titles = ["Mr.", "Mrs.", "Ms.", "Dr."];
  const firstNames = [
    "James","Mary","John","Patricia","Robert","Jennifer","Michael","Linda","William","Elizabeth",
    "David","Barbara","Richard","Susan","Joseph","Jessica","Thomas","Sarah","Charles","Karen",
    "Christopher","Nancy","Daniel","Lisa","Matthew","Margaret","Anthony","Sandra","Mark","Ashley",
    "Donald","Kimberly","Steven","Emily","Paul","Donna","Andrew","Michelle","Joshua","Carol",
    "Kenneth","Amanda","Kevin","Melissa","Brian","Deborah","George","Stephanie","Edward","Rebecca",
    "Ryan","Laura","Jason","Cynthia","Jeffrey","Kathleen","Jacob","Angela","Gary","Shirley",
    "Nicholas","Brenda","Eric","Emma","Jonathan","Anna","Stephen","Pamela","Larry","Nicole",
    "Justin","Samantha","Scott","Katherine","Brandon","Christine","Benjamin","Helen","Samuel","Debra",
    "Gregory","Rachel","Frank","Carolyn","Alexander","Janet","Raymond","Maria","Patrick","Heather"
  ];
  const lastNames = [
    "Zhang","Wang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou","Yu","Xu","Qian","Ma","Duan",
    "Song","Cheng","Lin","Sun","Li","Zi","Wang","Xu","Qian","Ma","Duan","Song","Cheng","Lin","Sun","Li",
    "Zhang","Wang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou","Yu","Xu","Qian","Ma","Duan",
    "Song","Cheng","Lin","Sun","Li","Zhang","Wang","Liu","Chen","Yang","Huang","Zhao","Wu","Zhou"
  ];

  const all = [...first9];
  let seed = 12345;
  for (let i = 10; i <= 100; i++) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r1 = seed % titles.length; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r2 = seed % firstNames.length; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r3 = seed % lastNames.length; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r4 = seed % 4; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r5 = seed % 3000; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r6 = seed % 2000; seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const r7 = seed % 30000;

    const orders = r4 + 4;
    const revenue = 9267 - r5 + r6 + r7 + 9000;
    const name = `${titles[r1]} ${firstNames[r2]} ${lastNames[r3]}`;
    const key = 11000 + r7;

    all.push({ key: key, name: name, orders: orders, revenue: revenue });
  }

  // Sort by revenue descending
  all.sort((a, b) => b.revenue - a.revenue);
  return all;
}

// ============================================================
// FINANCIAL REPORT DATA (Page 6)
// ============================================================
const FINANCIAL_DATA = {
  years: [2015, 2016, 2017, 2018],
  selectedYear: 2017,
  theme: "#0f3a5a",

  incomeStatement: {
    years: {
      2015: {
        revenues: [
          { label: "Distributor", value: 16240.80 },
          { label: "Export", value: 7680.45 },
          { label: "Wholesale", value: 29100.50 }
        ],
        cogs: [
          { label: "Commissions", value: 1560.00 },
          { label: "Equipment", value: 890.50 },
          { label: "Labor Burden", value: 2240.30 },
          { label: "Materials", value: 3820.75 },
          { label: "Other Costs", value: 1200.00 },
          { label: "Prize Fund", value: 540.20 },
          { label: "Referral Fund", value: 760.00 },
          { label: "Repair Fund", value: 420.80 },
          { label: "Subcontractors", value: 1180.40 }
        ],
        expenses: [
          { label: "Depreciation", value: 2100.00 },
          { label: "Education", value: 320.50 },
          { label: "Insurance", value: 450.00 },
          { label: "Advertising", value: 3800.00 },
          { label: "Professional Fees", value: 1500.00 },
          { label: "Research & Development", value: 2200.00 },
          { label: "Salaries & Wages", value: 8500.00 },
          { label: "Utilities", value: 980.00 },
          { label: "Rent", value: 1800.00 },
          { label: "Office Supplies", value: 420.00 }
        ],
        totalRevenues: 53021.75,
        totalCOGS: 15572.55,
        grossProfit: 37449.20,
        grossProfitPct: 70.62,
        totalExpenses: 21570.50,
        netIncome: 15878.70
      },
      2016: {
        revenues: [
          { label: "Distributor", value: 16810.00 },
          { label: "Export", value: 7920.00 },
          { label: "Wholesale", value: 30050.00 }
        ],
        cogs: [
          { label: "Commissions", value: 1620.00 },
          { label: "Equipment", value: 910.00 },
          { label: "Labor Burden", value: 2310.00 },
          { label: "Materials", value: 3930.00 },
          { label: "Other Costs", value: 1240.00 },
          { label: "Prize Fund", value: 560.00 },
          { label: "Referral Fund", value: 790.00 },
          { label: "Repair Fund", value: 440.00 },
          { label: "Subcontractors", value: 1220.00 }
        ],
        expenses: [
          { label: "Depreciation", value: 2200.00 },
          { label: "Education", value: 340.00 },
          { label: "Insurance", value: 470.00 },
          { label: "Advertising", value: 3950.00 },
          { label: "Professional Fees", value: 1550.00 },
          { label: "Research & Development", value: 2350.00 },
          { label: "Salaries & Wages", value: 8800.00 },
          { label: "Utilities", value: 1020.00 },
          { label: "Rent", value: 1880.00 },
          { label: "Office Supplies", value: 440.00 }
        ],
        totalRevenues: 54780.00,
        totalCOGS: 16020.00,
        grossProfit: 38760.00,
        grossProfitPct: 70.74,
        totalExpenses: 22360.00,
        netIncome: 16400.00
      },
      2017: {
        revenues: [
          { label: "Distributor", value: 17373.59 },
          { label: "Export", value: 8190.97 },
          { label: "Wholesale", value: 31002.15 }
        ],
        cogs: [
          { label: "Commissions", value: 1800.00 },
          { label: "Equipment", value: 950.00 },
          { label: "Labor Burden", value: 2520.00 },
          { label: "Materials", value: 4120.00 },
          { label: "Other Costs", value: 1320.00 },
          { label: "Prize Fund", value: 620.00 },
          { label: "Referral Fund", value: 850.00 },
          { label: "Repair Fund", value: 480.00 },
          { label: "Subcontractors", value: 1340.00 }
        ],
        expenses: [
          { label: "Depreciation", value: 2400.00 },
          { label: "Education", value: 360.00 },
          { label: "Insurance", value: 500.00 },
          { label: "Advertising", value: 4200.00 },
          { label: "Professional Fees", value: 1650.00 },
          { label: "Research & Development", value: 2500.00 },
          { label: "Salaries & Wages", value: 9200.00 },
          { label: "Utilities", value: 1080.00 },
          { label: "Rent", value: 1950.00 },
          { label: "Office Supplies", value: 460.00 }
        ],
        totalRevenues: 56566.71,
        totalCOGS: 16409.45,
        grossProfit: 40157.26,
        grossProfitPct: 70.99,
        totalExpenses: 23490.00,
        netIncome: 16667.26
      },
      2018: {
        revenues: [
          { label: "Distributor", value: 17920.00 },
          { label: "Export", value: 8470.00 },
          { label: "Wholesale", value: 32250.00 }
        ],
        cogs: [
          { label: "Commissions", value: 1890.00 },
          { label: "Equipment", value: 980.00 },
          { label: "Labor Burden", value: 2650.00 },
          { label: "Materials", value: 4300.00 },
          { label: "Other Costs", value: 1380.00 },
          { label: "Prize Fund", value: 650.00 },
          { label: "Referral Fund", value: 900.00 },
          { label: "Repair Fund", value: 500.00 },
          { label: "Subcontractors", value: 1400.00 }
        ],
        expenses: [
          { label: "Depreciation", value: 2550.00 },
          { label: "Education", value: 380.00 },
          { label: "Insurance", value: 530.00 },
          { label: "Advertising", value: 4450.00 },
          { label: "Professional Fees", value: 1720.00 },
          { label: "Research & Development", value: 2620.00 },
          { label: "Salaries & Wages", value: 9500.00 },
          { label: "Utilities", value: 1130.00 },
          { label: "Rent", value: 2020.00 },
          { label: "Office Supplies", value: 480.00 }
        ],
        totalRevenues: 58640.00,
        totalCOGS: 17070.00,
        grossProfit: 41570.00,
        grossProfitPct: 70.87,
        totalExpenses: 24430.00,
        netIncome: 17140.00
      }
    },
    waterfall: {
      title: "Income Statement Waterfall",
      bars: [
        { label: "Total Revenues", value: 56566.71, color: "#4a90d9" },
        { label: "Other Expenses", value: -11000, color: "#e74c38" },
        { label: "COGS", value: -16409.45, color: "#e74c38" },
        { label: "Total", value: 29157.26, color: "#38a174" }
      ]
    },
    monthlyRevenue: {
      title: "Monthly Revenue by Channel",
      months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"],
      channels: [
        { label: "Distributor", color: "#5bbcc4", data: [1448,1420,1520,1480,1560,1490,1530,1550,1480,1510,1580,1600] },
        { label: "Export", color: "#1fd1c8", data: [683,660,700,690,710,680,700,720,690,710,730,740] },
        { label: "Wholesale", color: "#94a3b8", data: [2584,2550,2680,2600,2700,2650,2700,2750,2620,2680,2750,2780] }
      ]
    },
    tyVsPyBar: {
      title: "TY vs PY %",
      labels: ["Distributor","Export","Wholesale","Net Income"],
      data: [7.4, 6.3, 7.1, 5.5],
      color: "#5bbcc4"
    }
  },

  financialDetails: {
    views: ["Actuals", "vs Last Year", "% to Revenue"],
    selectedView: "Actuals",
    quarters: ["Q1","Q2","Q3","Q4","Annual Total"],
    matrixRows: [
      { label: "Distributor", q1: 4343, q2: 4215, q3: 4450, q4: 4366 },
      { label: "Export", q1: 2048, q2: 1980, q3: 2100, q4: 2063 },
      { label: "Wholesale", q1: 7750, q2: 7550, q3: 7850, q4: 7852 },
      { label: "Total Revenues", q1: 14141, q2: 13745, q3: 14400, q4: 14281 },
      { label: "Commissions", q1: 450, q2: 440, q3: 460, q4: 450 },
      { label: "Materials", q1: 1030, q2: 1010, q3: 1050, q4: 1030 },
      { label: "Labor Burden", q1: 630, q2: 620, q3: 640, q4: 630 },
      { label: "Total COGS", q1: 4060, q2: 3970, q3: 4130, q4: 4249 },
      { label: "Total Gross Profit", q1: 10081, q2: 9775, q3: 10270, q4: 10032 },
      { label: "Advertising", q1: 1050, q2: 1020, q3: 1080, q4: 1050 },
      { label: "Salaries & Wages", q1: 2300, q2: 2250, q3: 2350, q4: 2300 },
      { label: "Depreciation", q1: 600, q2: 590, q3: 610, q4: 600 },
      { label: "Total Expenses", q1: 5875, q2: 5770, q3: 6050, q4: 5795 },
      { label: "Net Income", q1: 4206, q2: 4005, q3: 4220, q4: 4237 }
    ],
    monthlyCharts: [
      { title: "Revenue by Channel", type: "column", months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], series: [
        { label: "Distributor", color: "#5bbcc4", data: [1448,1420,1520,1480,1560,1490,1530,1550,1480,1510,1580,1600] },
        { label: "Export", color: "#1fd1c8", data: [683,660,700,690,710,680,700,720,690,710,730,740] },
        { label: "Wholesale", color: "#94a3b8", data: [2584,2550,2680,2600,2700,2650,2700,2750,2620,2680,2750,2780] }
      ]},
      { title: "COGS by Category", type: "column", months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], series: [
        { label: "Commissions", color: "#5bbcc4", data: [150,145,155,148,158,149,155,157,149,152,158,160] },
        { label: "Materials", color: "#1fd1c8", data: [335,325,345,330,350,340,348,355,330,345,350,360] },
        { label: "Labor Burden", color: "#94a3b8", data: [198,195,205,198,210,198,208,212,197,205,210,215] }
      ]},
      { title: "Net Income", type: "column", months: ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"], series: [
        { label: "Net Income", color: "#5bbcc4", data: [1300,1280,1350,1310,1400,1330,1370,1420,1340,1390,1410,1430] }
      ]}
    ]
  },

  balanceSheet: {
    assetRows: [
      { label: "Cash", v2015: 11500, v2016: 11750, v2017: 11875, v2018: 12100 },
      { label: "Accounts Receivable", v2015: 4100, v2016: 4150, v2017: 4216, v2018: 4300 },
      { label: "Inventory", v2015: 2050, v2016: 2100, v2017: 2146, v2018: 2200 },
      { label: "Prepaid Expenses", v2015: 850, v2016: 880, v2017: 900, v2018: 920 },
      { label: "Other Current Assets", v2015: 500, v2016: 520, v2017: 550, v2018: 580 },
      { label: "Total Current Assets", v2015: 19000, v2016: 19370, v2017: 19687, v2018: 20100 },
      { label: "Property, Plant & Equipment", v2015: 12000, v2016: 12500, v2017: 12800, v2018: 13200 },
      { label: "Less: Accumulated Depreciation", v2015: -3500, v2016: -4000, v2017: -4300, v2018: -4600 },
      { label: "Net Fixed Assets", v2015: 8500, v2016: 8500, v2017: 8500, v2018: 8600 },
      { label: "Long-term Investments", v2015: 3500, v2016: 3800, v2017: 3900, v2018: 4000 },
      { label: "Other Long-term Assets", v2015: 2000, v2016: 2100, v2017: 2200, v2018: 2300 },
      { label: "Total Assets", v2015: 33000, v2016: 33770, v2017: 35287, v2018: 35000 }
    ],
    liabilityEquityRows: [
      { label: "Accounts Payable", v2015: 4500, v2016: 4600, v2017: 4800, v2018: 4900 },
      { label: "Short-term Debt", v2015: 3200, v2016: 3100, v2017: 1000, v2018: 900 },
      { label: "Current Portion of Long-term Debt", v2015: 1500, v2016: 1400, v2017: 1300, v2018: 1200 },
      { label: "Total Current Liabilities", v2015: 9200, v2016: 9100, v2017: 7100, v2018: 7000 },
      { label: "Long-term Debt", v2015: 13000, v2016: 12800, v2017: 13000, v2018: 12700 },
      { label: "Other Long-term Liabilities", v2015: 1500, v2016: 1600, v2017: 1700, v2018: 1800 },
      { label: "Total Liabilities", v2015: 23700, v2016: 23500, v2017: 21800, v2018: 21500 },
      { label: "Common Stock", v2015: 5000, v2016: 5000, v2017: 5000, v2018: 5000 },
      { label: "Retained Earnings", v2015: 4300, v2016: 5270, v2017: 8487, v2018: 8500 },
      { label: "Total Shareholders Equity", v2015: 9300, v2016: 10270, v2017: 13487, v2018: 13500 },
      { label: "Total Liabilities & Equity", v2015: 33000, v2016: 33770, v2017: 35287, v2018: 35000 }
    ],
    ratios: [
      { label: "Debt Ratio", v2015: 0.72, v2016: 0.70, v2017: 0.62, v2018: 0.61 },
      { label: "Current Ratio", v2015: 2.07, v2016: 2.13, v2017: 2.77, v2018: 2.87 },
      { label: "Working Capital", v2015: 9800, v2016: 10270, v2017: 12587, v2018: 13100 },
      { label: "Assets-to-Equity", v2015: 3.55, v2016: 3.30, v2017: 2.61, v2018: 2.59 },
      { label: "Debt-to-Equity", v2015: 2.55, v2016: 2.30, v2017: 1.61, v2018: 1.59 }
    ],
    waterfalls: [
      {
        title: "Assets Waterfall",
        bars: [
          { label: "Starting", value: 19000, color: "#4a90d9" },
          { label: "Add", value: 14487, color: "#5bbcc4" },
          { label: "Less Depreciation", value: -4300, color: "#e74c38" },
          { label: "Investments", value: 3900, color: "#5bbcc4" },
          { label: "Other Assets", value: 2200, color: "#5bbcc4" },
          { label: "Total Assets", value: 35287, color: "#38a174" }
        ]
      },
      {
        title: "Equity Waterfall",
        bars: [
          { label: "Starting", value: 9300, color: "#4a90d9" },
          { label: "Net Income", value: 10397, color: "#5bbcc4" },
          { label: "Dividends", value: -6580, color: "#e74c38" },
          { label: "Other", value: 370, color: "#5bbcc4" },
          { label: "Total Equity", value: 13487, color: "#38a174" }
        ]
      }
    ]
  },

  cashFlow: {
    sections: [
      {
        title: "Net Cash from Operations",
        years: { 2015: 170085, 2016: 195000, 2017: 230000, 2018: 258678 }
      },
      {
        title: "Net Cash from Investing",
        years: { 2015: -45000, 2016: -48000, 2017: -52000, 2018: -55000 }
      },
      {
        title: "Net Cash from Financing",
        years: { 2015: -120000, 2016: -140000, 2017: -165000, 2018: -180000 }
      }
    ],
    summary: [
      { label: "Net Cash IN", v2015: 170085, v2016: 195000, v2017: 230000, v2018: 258678, color: "#5bbcc4" },
      { label: "Net Cash OUT", v2015: -287000, v2016: -326000, v2017: -382000, v2018: -415000, color: "#e74c38" },
      { label: "Net Change", v2015: -116915, v2016: -131000, v2017: -152000, v2018: -156322, color: "#ffd93d" }
    ],
    donutPairs: [
      {
        title: "Cash IN / Cash OUT",
        inVal: { label: "Cash IN", value: 230000, color: "#5bbcc4" },
        outVal: { label: "Cash OUT", value: 382000, color: "#e74c38" }
      },
      {
        title: "Operating IN / Operating OUT",
        inVal: { label: "Operating IN", value: 180000, color: "#5bbcc4" },
        outVal: { label: "Operating OUT", value: 50000, color: "#e74c38" }
      },
      {
        title: "Investing IN / Investing OUT",
        inVal: { label: "Investing IN", value: 15000, color: "#5bbcc4" },
        outVal: { label: "Investing OUT", value: 67000, color: "#e74c38" }
      }
    ]
  },

  agedTrial: {
    buckets: [
      { label: "Age 1-30", value: 907111, color: "#5bbcc4" },
      { label: "Age 31-60", value: 600416, color: "#1fd1c8" },
      { label: "Age 61-90", value: 560321, color: "#ffd93d" },
      { label: "Age 90+", value: 2460051, color: "#e74c38" }
    ],
    summary: [
      { label: "OUTSTANDING INVOICES", value: 751 },
      { label: "INVOICES VALUE", value: 4510899, format: "currency", suffix: "M" }
    ],
    customers: [
      { key: "CUST001", name: "Adventure Works", total: 125000, b1_30: 98000, b31_60: 27000, b61_90: 0, b90: 0 },
      { key: "CUST002", name: "Contoso Ltd", total: 87500, b1_30: 32500, b31_60: 28000, b61_90: 19000, b90: 8000 },
      { key: "CUST003", name: "Fabrikam Inc", total: 43200, b1_30: 15200, b31_60: 14000, b61_90: 8000, b90: 6000 },
      { key: "CUST004", name: "Northwind Traders", total: 65300, b1_30: 22000, b31_60: 18000, b61_90: 12000, b90: 13300 },
      { key: "CUST005", name: "Proseware LLC", total: 199800, b1_30: 50000, b31_60: 45000, b61_90: 50000, b90: 54800 },
      { key: "CUST006", name: "Wingtip Toys", total: 32700, b1_30: 18000, b31_60: 8000, b61_90: 4000, b90: 2700 },
      { key: "CUST007", name: "Litware Inc", total: 28600, b1_30: 9000, b31_60: 7500, b61_90: 6800, b90: 5300 }
    ],
    dateRange: { start: "1/1/2017", end: "12/31/2017" }
  },

  revenueInsights: {
    kpis: [
      { label: "SALES", value: 3000000, format: "currency", suffix: "M" },
      { label: "PROFITS", value: 1100000, format: "currency", suffix: "M" },
      { label: "MARGINS", value: 36, format: "percent", suffix: "%" }
    ],
    slicers: {
      territory: ["All","Northwest","Northeast","Southeast","Southwest","International"],
      channel: ["All","Online","Reseller","Direct","Partner"],
      productGroups: ["All","Bikes","Components","Clothing","Accessories"]
    },
    dateRange: { start: "12/23/2016", end: "2/17/2018" },
    lineChart: {
      title: "Total Sales / Previous Highest / Rolling Average",
      months: ["Dec 16","Jan 17","Feb 17","Mar 17","Apr 17","May 17","Jun 17","Jul 17","Aug 17","Sep 17","Oct 17","Nov 17"],
      series: [
        { label: "Total Sales", color: "#5bbcc4", data: [240000,250000,245000,260000,255000,270000,265000,280000,275000,290000,285000,300000] },
        { label: "Previous Highest Sale", color: "#94a3b8", data: [240000,240000,245000,245000,250000,250000,260000,260000,270000,275000,280000,300000] },
        { label: "Rolling Average", color: "#1fd1c8", data: [238000,242000,245000,249000,252000,257000,260000,264000,268000,272000,276000,280000] }
      ]
    },
    waterfall: {
      title: "Sales by Month",
      bars: [
        { label: "Starting", value: 240000, color: "#4a90d9" },
        { label: "Jan", value: 10000, color: "#5bbcc4" },
        { label: "Feb", value: -5000, color: "#e74c38" },
        { label: "Mar", value: 15000, color: "#5bbcc4" },
        { label: "Apr", value: 5000, color: "#5bbcc4" },
        { label: "May", value: 15000, color: "#5bbcc4" },
        { label: "Jun", value: -5000, color: "#e74c38" },
        { label: "Jul", value: 15000, color: "#5bbcc4" },
        { label: "Aug", value: 5000, color: "#5bbcc4" },
        { label: "Sep", value: 15000, color: "#5bbcc4" },
        { label: "Oct", value: -5000, color: "#e74c38" },
        { label: "Nov", value: 15000, color: "#5bbcc4" },
        { label: "Total", value: 320000, color: "#38a174" }
      ]
    },
    transactions: [
      { date: "2/17/2018", city: "Seattle", territory: "Northwest", channel: "Online", productGroup: "Accessories", product: "AWC Logo Cap", customers: "Mr. Maurice Shan", sales: 35882, profits: 5200, margin: "14.5%" },
      { date: "1/26/2018", city: "Portland", territory: "Northwest", channel: "Reseller", productGroup: "Components", product: "Fender Set", customers: "Mrs. Lisa Cai", sales: 87041, profits: 12500, margin: "14.4%" },
      { date: "1/4/2018", city: "Boston", territory: "Northeast", channel: "Direct", productGroup: "Bikes", product: "Mountain Bike", customers: "Mr. Jordan Turner", sales: 73444, profits: 10600, margin: "14.4%" },
      { date: "12/13/2017", city: "Miami", territory: "Southeast", channel: "Partner", productGroup: "Components", product: "Tire Tube", customers: "Mr. Larry Munoz", sales: 17265, profits: 2500, margin: "14.5%" },
      { date: "11/21/2017", city: "Phoenix", territory: "Southwest", channel: "Online", productGroup: "Clothing", product: "Short-Sleeve Jersey", customers: "Mrs. Ariana Gray", sales: 39755, profits: 5700, margin: "14.3%" },
      { date: "10/30/2017", city: "London", territory: "International", channel: "Online", productGroup: "Bikes", product: "Touring Bike", customers: "Mrs. Janet Munoz", sales: 64500, profits: 15480, margin: "24.0%" },
      { date: "10/8/2017", city: "Sydney", territory: "International", channel: "Partner", productGroup: "Clothing", product: "Bib-Shorts", customers: "Mr. Maurice Shan", sales: 28900, profits: 8381, margin: "29.0%" },
      { date: "9/16/2017", city: "Atlanta", territory: "Southeast", channel: "Reseller", productGroup: "Accessories", product: "Water Bottle", customers: "Mrs. Lacey Zheng", sales: 41200, profits: 12360, margin: "30.0%" },
      { date: "8/25/2017", city: "New York", territory: "Northeast", channel: "Online", productGroup: "Clothing", product: "T-Shirt", customers: "Mr. Jordan Turner", sales: 52300, profits: 14121, margin: "27.0%" },
      { date: "8/3/2017", city: "Los Angeles", territory: "Southwest", channel: "Direct", productGroup: "Bikes", product: "Road Bike", customers: "Mrs. Lisa Cai", sales: 78300, profits: 19575, margin: "25.0%" },
      { date: "7/12/2017", city: "Seattle", territory: "Northwest", channel: "Reseller", productGroup: "Components", product: "Chain", customers: "Mr. Larry Munoz", sales: 19400, profits: 6014, margin: "31.0%" },
      { date: "6/20/2017", city: "London", territory: "International", channel: "Direct", productGroup: "Accessories", product: "Helmet", customers: "Mrs. Ariana Gray", sales: 37600, profits: 10528, margin: "28.0%" },
      { date: "5/29/2017", city: "Miami", territory: "Southeast", channel: "Online", productGroup: "Clothing", product: "Long-Sleeve Jersey", customers: "Mrs. Janet Munoz", sales: 46800, profits: 13000, margin: "27.8%" },
      { date: "5/7/2017", city: "Boston", territory: "Northeast", channel: "Partner", productGroup: "Bikes", product: "Mountain-100", customers: "Mrs. Lacey Zheng", sales: 82700, profits: 19021, margin: "23.0%" },
      { date: "4/15/2017", city: "Phoenix", territory: "Southwest", channel: "Reseller", productGroup: "Components", product: "Handlebars", customers: "Mr. Maurice Shan", sales: 13600, profits: 4760, margin: "35.0%" },
      { date: "3/24/2017", city: "Sydney", territory: "International", channel: "Online", productGroup: "Components", product: "Bottom Bracket", customers: "Mr. Jordan Turner", sales: 31800, profits: 8904, margin: "28.0%" },
      { date: "3/2/2017", city: "Atlanta", territory: "Southeast", channel: "Direct", productGroup: "Accessories", product: "Bike Wash", customers: "Mrs. Lisa Cai", sales: 8900, profits: 3204, margin: "36.0%" },
      { date: "2/8/2017", city: "Portland", territory: "Northwest", channel: "Partner", productGroup: "Clothing", product: "Gloves", customers: "Mrs. Ariana Gray", sales: 22400, profits: 6944, margin: "31.0%" },
      { date: "1/17/2017", city: "New York", territory: "Northeast", channel: "Online", productGroup: "Accessories", product: "Hydration Pack", customers: "Mr. Larry Munoz", sales: 26700, profits: 7476, margin: "28.0%" },
      { date: "12/26/2016", city: "London", territory: "International", channel: "Direct", productGroup: "Bikes", product: "Mountain-100", customers: "Mrs. Janet Munoz", sales: 58600, profits: 15236, margin: "26.0%" }
    ],
    top5Customers: [
      { label: "Mr. Maurice Shan", value: 12406, color: "#5bbcc4" },
      { label: "Mrs. Janet Munoz", value: 12015, color: "#1fd1c8" },
      { label: "Mrs. Lisa Cai", value: 11330, color: "#94a3b8" },
      { label: "Mrs. Lacey Zheng", value: 11086, color: "#5bbcc4" },
      { label: "Mr. Jordan Turner", value: 11022, color: "#1fd1c8" }
    ],
    top5Cities: [
      { label: "Seattle", value: 87000, color: "#5bbcc4" },
      { label: "Portland", value: 76000, color: "#1fd1c8" },
      { label: "Redmond", value: 65000, color: "#94a3b8" },
      { label: "Spokane", value: 54000, color: "#5bbcc4" },
      { label: "Tacoma", value: 42000, color: "#1fd1c8" }
    ]
  },

  navigationTiles: [
    { id: "income-statement", title: "Income Statement", icon: "📊" },
    { id: "balance-sheet", title: "Balance Sheet", icon: "📈" },
    { id: "cash-flow", title: "Cash Flow Statement", icon: "💰" },
    { id: "financial-details", title: "Financial Details", icon: "📋" },
    { id: "aged-trial", title: "Aged Trial Balance", icon: "📊" },
    { id: "revenue-insights", title: "Revenue Insights", icon: "💹" }
  ]
};

// ============================================================
// GLOBAL FILTER STATE
// ============================================================
const FILTER_STATE = {
  years: [2020, 2021, 2022],
  continents: ["Europe", "North America", "Pacific"],
  getAllYears: function() { return [2020, 2021, 2022]; },
  getAllContinents: function() { return ["Europe", "North America", "Pacific"]; }
};

const RI_FILTERS = {
  territory: ["All", "Northwest", "Northeast", "Southeast", "Southwest", "International"],
  channel: ["All", "Online", "Reseller", "Direct", "Partner"],
  product: ["All", "Bikes", "Components", "Clothing", "Accessories"],
  dateIndex: { current: 30, min: 0, max: 30 }
};

// ============================================================
// PAGE DEFINITIONS
// ============================================================
const PAGES = [
  { id: "page-executive", name: "Executive", icon: "📊" },
  { id: "page-map", name: "Map", icon: "🌍" },
  { id: "page-product", name: "Product", icon: "📦" },
  { id: "page-customer", name: "Customer", icon: "👥" },
  { id: "page-tooltip", name: "Manual Tooltip", icon: "🔍" },
  { id: "page-financial-nav", name: "Financial Report", icon: "📈" }
];

// Make data available globally for the HTML
if (typeof window !== 'undefined') {
  window.EXECUTIVE_DATA = EXECUTIVE_DATA;
  window.TOOLTIP_DATA = TOOLTIP_DATA;
  window.MAP_DATA = MAP_DATA;
  window.PRODUCT_DATA = PRODUCT_DATA;
  window.CUSTOMER_DATA = CUSTOMER_DATA;
  window.CUSTOMER_TABLE_DATA = CUSTOMER_TABLE_DATA;
  window.FINANCIAL_DATA = FINANCIAL_DATA;
  window.FILTER_STATE = FILTER_STATE;
  window.RI_FILTERS = RI_FILTERS;
  window.PAGES = PAGES;
}
