"use client";
import { Cell, Pie, PieChart } from "recharts";

const COLORS = [
  "#EBA8BF", // pink
  "#BCEBA8", // green
  "#CE93F2", // purple
  "#F07A7A", // red
  "#94C4F6", //blue
  "#F2DE93", //yellow
  ,
];

const RADIAN = Math.PI / 180;

//SOURCE: https://codesandbox.io/p/sandbox/pie-chart-with-customized-label-dlhhj?file=%2Fsrc%2FApp.tsx
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
      <PieChart width={470} height={470}>
        <Pie
          data={props.data}
          cx="50%" // Center X dynamically set to 50% of the container width
          cy="50%" // Center Y dynamically set to 50% of the container height
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={"100%"} // Outer radius set as a percentage of the chart size
          fill="#8884d8"
          dataKey="value"
          nameKey="playerName"
        >
          {props.data!.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </div>
  );
}
