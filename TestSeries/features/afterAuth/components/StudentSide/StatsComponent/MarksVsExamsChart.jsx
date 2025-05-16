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

// Sample data: Replace with actual marks
const data = [
    { exam: "GATE", marks: 60.33 },
    { exam: "JEE Advanced", marks: 72.5 },
    { exam: "UPSC", marks: 45.2 },
    { exam: "CAT", marks: 88.9 },
    { exam: "NET", marks: 70.1 },
];

const MarksVsExamsChart = () => {
    return (
        <div>
            <ResponsiveContainer height={300}>
                <LineChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="exam" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="marks"
                        stroke="#82ca9d"
                        activeDot={{ r: 8 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MarksVsExamsChart;
