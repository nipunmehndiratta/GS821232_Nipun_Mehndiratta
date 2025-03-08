import { StoreItem, SKUItem, CalendarItem, PlanningItem } from '../types';
// Sample store data based on the Excel file
export const initialStores: StoreItem[] = [
  { id: 1, storeID: "ST035", store: "San Francisco Bay Trends", city: "San Francisco", state: "CA" },
  { id: 2, storeID: "ST046", store: "Phoenix Sunwear", city: "Phoenix", state: "AZ" },
  { id: 3, storeID: "ST064", store: "Dallas Ranch Supply", city: "Dallas", state: "TX" },
  { id: 4, storeID: "ST073", store: "Miami Beach Fashion", city: "Miami", state: "FL" },
  { id: 5, storeID: "ST091", store: "Chicago Urban Outfitters", city: "Chicago", state: "IL" },
];

// Sample SKU data based on the Excel file
export const initialSKUs: SKUItem[] = [
  { id: 1, skuCode: "SK00158", label: "Crew Neck Merino Wool Sweater", class: "Tops", department: "Men's Apparel", price: 114.99, cost: 18.28 },
  { id: 2, skuCode: "SK00269", label: "Faux Leather Leggings", class: "Jewelry", department: "Footwear", price: 9.99, cost: 8.45 },
  { id: 3, skuCode: "SK00300", label: "Fleece-Lined Parka", class: "Jewelry", department: "Unisex Accessories", price: 199.99, cost: 17.80 },
  { id: 4, skuCode: "SK00411", label: "V-Neck Cashmere Cardigan", class: "Tops", department: "Women's Apparel", price: 149.99, cost: 30.00 },
  { id: 5, skuCode: "SK00522", label: "Waterproof Hiking Boots", class: "Footwear", department: "Outdoor Gear", price: 89.99, cost: 40.50 },
];

// Sample calendar data based on the Excel file
export const initialCalendar: CalendarItem[] = [
  { id: 1, week: "W01", weekLabel: "Week 01", month: "M01", monthLabel: "Feb" },
  { id: 2, week: "W02", weekLabel: "Week 02", month: "M01", monthLabel: "Feb" },
  { id: 3, week: "W03", weekLabel: "Week 03", month: "M01", monthLabel: "Feb" },
  { id: 4, week: "W04", weekLabel: "Week 04", month: "M01", monthLabel: "Feb" },
  { id: 5, week: "W05", weekLabel: "Week 05", month: "M02", monthLabel: "Mar" },
  { id: 6, week: "W06", weekLabel: "Week 06", month: "M02", monthLabel: "Mar" },
  { id: 7, week: "W07", weekLabel: "Week 07", month: "M02", monthLabel: "Mar" },
  { id: 8, week: "W08", weekLabel: "Week 08", month: "M02", monthLabel: "Mar" },
  { id: 9, week: "W09", weekLabel: "Week 09", month: "M03", monthLabel: "Apr" },
  { id: 10, week: "W10", weekLabel: "Week 10", month: "M03", monthLabel: "Apr" },
  { id: 11, week: "W11", weekLabel: "Week 11", month: "M03", monthLabel: "Apr" },
  { id: 12, week: "W12", weekLabel: "Week 12", month: "M03", monthLabel: "Apr" },
];

// Function to generate initial planning data based on stores, SKUs, and calendar
export const generateInitialPlanningData = (): PlanningItem[] => {
  const planningData: PlanningItem[] = [];
  let id = 1;

  // Generate cross join of stores and SKUs
  initialStores.forEach(store => {
    initialSKUs.forEach(sku => {
      // For each store-SKU combination, create entries for each week
      initialCalendar.forEach(calendarItem => {
        // Random sales units between 0 and 50
        const salesUnits = Math.floor(Math.random() * 50);

        planningData.push({
          id: id++,
          storeID: store.storeID,
          storeName: store.store,
          skuCode: sku.skuCode,
          skuLabel: sku.label,
          week: calendarItem.week,
          weekLabel: calendarItem.weekLabel,
          month: calendarItem.month,
          monthLabel: calendarItem.monthLabel,
          salesUnits: salesUnits,
          price: sku.price,
          cost: sku.cost
          // The calculated fields (salesDollars, gmDollars, gmPercent) will be computed in the grid
        });
      });
    });
  });

  return planningData;
};

// Initial planning data
export const initialPlanningData = generateInitialPlanningData();