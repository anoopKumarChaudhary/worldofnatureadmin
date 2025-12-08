"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
  { name: "Delivered", value: 400 },
  { name: "Shipped", value: 300 },
  { name: "Processing", value: 300 },
  { name: "Pending", value: 200 },
];

const COLORS = ["#5A7D6B", "#B56B56", "#C4A052", "#E0C075"];

export default function OrdersChart() {
  return (
    <div className="bg-white/60 backdrop-blur-md border border-white/50 rounded-[2rem] p-6 shadow-sm h-[400px]">
      <h3 className="text-lg font-bold text-[#1A2118] mb-6">Order Status</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={80}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
             contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.8)', 
              backdropFilter: 'blur(8px)',
              borderRadius: '12px',
              border: 'none',
              boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
            }}
            itemStyle={{ color: '#1A2118', fontWeight: 'bold' }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            iconType="circle"
            iconSize={8}
            formatter={(value) => <span className="text-[#596157] text-xs font-medium ml-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
