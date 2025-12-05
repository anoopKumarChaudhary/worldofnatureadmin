"use client";

interface ChartProps {
  data: { name: string; value: number }[];
  title: string;
  color?: string;
}

export default function Chart({ data, title, color = "blue" }: ChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-3">
        {data.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className="w-20 text-sm text-gray-600 truncate">
              {item.name}
            </div>
            <div className="flex-1 mx-4">
              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className={`h-4 rounded-full bg-${color}-500`}
                  style={{ width: `${(item.value / maxValue) * 100}%` }}
                ></div>
              </div>
            </div>
            <div className="w-12 text-sm text-gray-900 text-right">
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
