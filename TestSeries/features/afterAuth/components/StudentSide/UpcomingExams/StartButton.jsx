import React from 'react'

const StartButton = ({ exam, onStartTest, getStartButtonConfig, proctorStatus, isElectronEnv, currentExamId }) => {

    const isAiProctored = (exam) => {
        return exam.ai_proctored === true || 
               exam.ai_proctored === "TRUE" || 
               exam.ai_proctored === "true" || 
               exam.ai_proctored === 1 || 
               exam.ai_proctored === "1";
    };

    const getButtonProps = () => {
        if (exam.reapplicable) {
            if (exam.hasAttempted) {
                return { 
                    label: 'Start Test Again', 
                    onClick: () => onStartTest(exam.id, exam.ai_proctored) 
                };
            }
            return { 
                label: 'Start Test', 
                onClick: () => onStartTest(exam.id, exam.ai_proctored) 
            };
        } else {
            if (exam.hasAttempted) {
                return { 
                    label: 'View Result', 
                    onClick: () => {
                        
                        window.location.href = '/student/completed-exams';
                    }
                };
            }
            return { 
                label: 'Start Test', 
                onClick: () => onStartTest(exam.id, exam.ai_proctored) 
            };
        }
    };

    const buttonConfig = getStartButtonConfig(exam);
    const isProctored = isAiProctored(exam);
    const { label, onClick } = getButtonProps();
    
    return (
        <div style={{ marginTop: '15px' }}>
            {
                exam.go_live === false ? (
                    <div style={{
                        padding: '10px 20px',
                        backgroundColor: '#adb5bd',
                        color: '#fff',
                        borderRadius: '5px',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        minWidth: '160px',
                        textAlign: 'center'
                    }}>
                        🚫 Not Yet Started
                    </div>
                ) : (
                    <button
                    onClick={onClick}
                    disabled={buttonConfig.disabled || proctorStatus === 'starting' || exam.go_live === false}
                    style={{
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '5px',
                        fontSize: '14px',
                        fontWeight: 'bold',
                        cursor: buttonConfig.disabled ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease',
                        minWidth: '160px',
                        ...buttonConfig.style,
                        ...(proctorStatus === 'starting' && currentExamId === exam.id ? {
                            backgroundColor: '#ffc107',
                            color: '#000'
                        } : {})
                    }}
                >
                    {proctorStatus === 'starting' && currentExamId === exam.id 
                        ? '🔄 Starting...' 
                        : label
                    }
                </button>
                )
            }
           
            
            {isProctored && !isElectronEnv && (
                <div style={{
                    marginTop: '8px',
                    fontSize: '12px',
                    color: '#6c757d',
                    fontStyle: 'italic'
                }}>
                    Please download and use the Evalvo Proctor desktop application to take this AI-proctored exam.
                </div>
            )}
        </div>
    );
};

export default StartButton