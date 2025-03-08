import { useState, useEffect, useMemo } from 'react';
import { useAtom } from 'jotai';
import { 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Line, 
  ComposedChart
} from 'recharts';
import { storeAtom, planningAtom, calendarAtom } from '../jotaiStore';

const Chart = () => {
  const [stores] = useAtom(storeAtom);
  const [planningData] = useAtom(planningAtom);
  const [calendar] = useAtom(calendarAtom);
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  useEffect(() => {
    if (stores.length > 0 && !selectedStore) {
      setSelectedStore(stores[0].storeID);
    }
  }, [stores, selectedStore]);

  const chartData = useMemo(() => {
    if (!selectedStore) return [];

    const weekData: { [key: string]: { week: string, gmDollars: number, salesDollars: number, gmPercent: number } } = {};
    
    calendar.forEach(cal => {
      weekData[cal.week] = {
        week: cal.week,
        gmDollars: 0,
        salesDollars: 0,
        gmPercent: 0
      };
    });

    // Calculate totals for selected store
    planningData.forEach(item => {
      if (item.storeID === selectedStore) {
        const salesDollars = item.salesUnits * item.price;
        const costDollars = item.salesUnits * item.cost;
        const gmDollars = salesDollars - costDollars;
        
        weekData[item.week].salesDollars += salesDollars;
        weekData[item.week].gmDollars += gmDollars;
      }
    });

    Object.keys(weekData).forEach(week => {
      const { salesDollars, gmDollars } = weekData[week];
      weekData[week].gmPercent = salesDollars > 0 
        ? (gmDollars / salesDollars) * 100 
        : 0;
    });

    return Object.values(weekData).sort((a, b) => 
      a.week.localeCompare(b.week)
    );
  }, [selectedStore, planningData, calendar]);

  const handleStoreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStore(e.target.value);
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <div className="flex mb-4">
        <select
          className="border border-gray-300 rounded-md p-2 w-96"
          value={selectedStore || ''}
          onChange={handleStoreChange}
        >
          {stores.map(store => (
            <option key={store.storeID} value={store.storeID}>
              {store.store}
            </option>
          ))}
        </select>
      </div>
      
      <div className="flex-1 w-full bg-gray-800 p-4 rounded-md">
        <h2 className="text-xl text-center text-white mb-4">Gross Margin</h2>
        <ResponsiveContainer width="100%" height="90%">
          <ComposedChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 40 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#555" />
            <XAxis 
              dataKey="week" 
              tick={{ fill: 'white' }}
              axisLine={{ stroke: '#555' }}
            />
            <YAxis 
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => `$${(value).toLocaleString()}`}
              tick={{ fill: 'white' }}
              axisLine={{ stroke: '#555' }}
              label={{ 
                value: '', 
                position: 'insideLeft',
                angle: -90,
                style: { textAnchor: 'middle', fill: 'white' } 
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              domain={[0, 70]}
              tickFormatter={(value) => `${value}%`}
              tick={{ fill: 'white' }}
              axisLine={{ stroke: '#555' }}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === 'GM Dollars') return [`$${Number(value).toLocaleString()}`, name];
                if (name === 'GM %') return [`${Number(value).toFixed(1)}%`, name];
                return [value, name];
              }}
              contentStyle={{ backgroundColor: '#333', color: 'white', border: '1px solid #555' }}
            />
            <Legend 
              verticalAlign="bottom"
              wrapperStyle={{ paddingTop: '20px', color: 'white' }}
            />
            <Bar 
              yAxisId="left"
              dataKey="gmDollars" 
              name="GM Dollars" 
              fill="#4dabf7" 
              radius={[4, 4, 0, 0]}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="gmPercent" 
              name="GM %" 
              stroke="#ff9f43" 
              strokeWidth={3}
              dot={{ stroke: '#ff9f43', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;