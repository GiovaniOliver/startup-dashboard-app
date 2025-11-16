import "./widget.scss";
import { memo } from "react";
import { Link } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { AreaChart, Area, ResponsiveContainer, Tooltip } from "recharts";

const Widget = memo(({ type, data }) => {
  // Format value based on whether it's money or not
  const formatValue = (value, isMoney) => {
    if (isMoney) {
      return `$${value.toLocaleString()}`;
    }
    return value;
  };

  // Determine if percentage is positive or negative
  const isPositive = data.percentage >= 0;

  return (
    <div className="widget">
      <div className="left">
        <span className="title">{data.title}</span>
        <span className="counter">
          {formatValue(data.value, data.isMoney)}
        </span>
        <Link to={data.linkTo} className="link">
          {data.link}
        </Link>
      </div>
      <div className="right">
        <div className={`percentage ${isPositive ? "positive" : "negative"}`}>
          {isPositive ? (
            <KeyboardArrowUpIcon />
          ) : (
            <KeyboardArrowDownIcon />
          )}
          {Math.abs(data.percentage)}%
        </div>
        {data.icon}
      </div>
      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data.chartData}
            margin={{ top: 5, right: 0, left: 0, bottom: 5 }}
          >
            <defs>
              <linearGradient id={`gradient-${type}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={data.chartColor} stopOpacity={0.8} />
                <stop offset="95%" stopColor={data.chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Tooltip
              contentStyle={{
                background: "#f5f5f5",
                border: "none",
                borderRadius: "5px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={data.chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#gradient-${type})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

Widget.displayName = 'Widget';

export default Widget;