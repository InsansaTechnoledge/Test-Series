import React from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";

// Sample data: Replace with your actual data
const data = [
    { exam: "GATE", rank: 2308 },
    { exam: "JEE Advanced", rank: 5123 },
    { exam: "UPSC", rank: 340 },
    { exam: "CAT", rank: 856 },
    { exam: "NET", rank: 1023 },
];

const ExamRankLineChart = () => {
    return (
        <div>
            <ResponsiveContainer height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis reversed /> {/* lower rank = better */}
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="rank"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ExamRankLineChart;
