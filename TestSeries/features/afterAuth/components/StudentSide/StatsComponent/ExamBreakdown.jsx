const ExamBreakdown = () => {
    const examData = [
        { name: 'Attempted', value: 20, color: '#818cf8' },
        { name: 'Unattempted', value: 5, color: '#fbbf24' },
        { name: 'Disqualified', value: 1, color: '#9ca3af' }
    ];

    return (
        <div className="mx-10">
            <h1 className="text-blue-900 font-bold text-2xl text-center mt-14 mb-4">Exams Status breakdown</h1>

            <div className="flex justify-end">
                <span className="text-xs text-gray-700 my-auto mb-2">Toal Exams: 26</span>
            </div>
            <div className="flex items-center gap-2 mb-4">
                <div className="w-full bg-gray-200 rounded-full overflow-hidden h-2.5">
                    {examData.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                width: `${(item.value / 26) * 100}%`,
                                backgroundColor: item.color
                            }}
                            className="h-2.5 float-left"
                        ></div>
                    ))}
                </div>
            </div>
            <div className="flex justify-between">
                {examData.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-xs text-gray-600">{item.name}: {item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ExamBreakdown;