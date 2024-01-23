// TO DO: add source (recharts example)
"use client";
import { Cell, Pie, PieChart } from "recharts";

interface PieData {
  data: { name: string; value: number }[];
}

const COLORS = [
  "#EBA8BF",
  "#BCEBA8",
  "#F2DE93",
  "#F07A7A",
  "#94C4F6",
  "#CE93F2",
];

const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  index,
  name,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent > 0.1) {
    return (
      <text
        className="text-3xl"
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${name}`}
      </text>
    );
  }
};

// TO DO: FIX TYPES
export default function PieScore(props: { data: any }) {
  return (
    <div className="h-fit w-fit">
      <PieChart width={600} height={600}>
        <Pie
          data={props.data}
          cx="50%" // Center X dynamically set to 50% of the container width
          cy="50%" // Center Y dynamically set to 50% of the container height
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={"80%"} // Outer radius set as a percentage of the chart size
          fill="#8884d8"
          dataKey="value"
        >
          {props.data!.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
