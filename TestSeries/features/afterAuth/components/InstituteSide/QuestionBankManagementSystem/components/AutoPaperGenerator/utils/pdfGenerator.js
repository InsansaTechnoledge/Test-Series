export const pdfGenerator = {
    /**
     * Generate and download PDF for the exam paper
     */
    generateAndDownload(generatedPaper) {
      if (!generatedPaper) return;
      
      const printWindow = window.open('', '_blank');
      const html = this.generatePDFContent(generatedPaper);
      
      printWindow.document.write(html);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    },
  
    /**
     * Generate HTML content for PDF printing
     */
    generatePDFContent(paper) {
      if (!paper) return '';
      
      return `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${paper.title}</title>
          <style>
              ${this.getPDFStyles()}
          </style>
      </head>
      <body>
          ${this.generateHeader(paper)}
          ${this.generateInstructions(paper)}
          ${this.generateQuestions(paper)}
          ${this.generateFooter(paper)}
      </body>
      </html>`;
    },
  
    /**
     * Generate header section for PDF
     */
    generateHeader(paper) {
      return `
        <div class="header">
            <div class="paper-title">${paper.title}</div>
            <div class="paper-info">Time: ${paper.timeLimit} minutes | Total Questions: ${paper.totalQuestions} | Total Marks: ${paper.totalMarks}</div>
            <div class="paper-info">Generated on: ${new Date(paper.generatedAt).toLocaleString()}</div>
        </div>
      `;
    },
  
    /**
     * Generate instructions section for PDF
     */
    generateInstructions(paper) {
      const difficultyStats = paper.actualDistribution?.difficulty || {};
      const bloomStats = paper.actualDistribution?.bloom || {};
      
      return `
        <div class="instructions">
            <h3>Instructions:</h3>
            <ul>
                ${paper.instructions ? paper.instructions.map(inst => `<li>${inst}</li>`).join('') : '<li>Read all questions carefully before answering.</li><li>Answer all questions.</li><li>Write clearly and legibly.</li>'}
            </ul>
        </div>
        
        <div class="distribution-summary">
            <div class="distribution-row">
                <strong>Question Distribution Summary:</strong>
            </div>
            <div class="distribution-row">
                <span>Difficulty:</span>
                <span>Easy: ${difficultyStats.easy || 0} | Medium: ${difficultyStats.medium || 0} | Hard: ${difficultyStats.hard || 0}</span>
            </div>
            <div class="distribution-row">
                <span>Bloom's Taxonomy:</span>
                <span>Remember: ${bloomStats.remember || 0} | Understand: ${bloomStats.understand || 0} | Apply: ${bloomStats.apply || 0}</span>
            </div>
            <div class="distribution-row">
                <span></span>
                <span>Analyze: ${bloomStats.analyze || 0} | Evaluate: ${bloomStats.evaluate || 0} | Create: ${bloomStats.create || 0}</span>
            </div>
        </div>
      `;
    },
  
    /**
     * Generate questions section for PDF
     */
    generateQuestions(paper) {
      if (!paper.questions || paper.questions.length === 0) {
        return '<div class="no-questions">No questions available</div>';
      }
  
      return paper.questions.map((question, index) => `
        <div class="question">
            <div class="question-header">
                <span>Question ${index + 1}:</span>
                <span class="question-marks">[${question.marks || 2} marks]</span>
            </div>
            <div class="question-text">${question.question_text || question.title || 'Question text not available'}</div>
            ${question.options && question.options.length > 0 ? `
                <div class="options">
                    ${question.options.map((option, optIndex) => `
                        <div class="option">
                            <div class="option-label">${String.fromCharCode(65 + optIndex)})</div>
                            <div class="option-text">${option.text || option}</div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="answer-space"></div>
            ${this.generateQuestionMeta(question)}
        </div>
      `).join('');
    },
  
    /**
     * Generate question metadata
     */
    generateQuestionMeta(question) {
      const metaParts = [];
      
      if (question.subject) {
        metaParts.push(`Subject: ${question.subject}`);
      }
      
      if (question.difficultyLevel) {
        metaParts.push(`Difficulty: ${question.difficultyLevel}`);
      }
      
      if (question.bloomLevel) {
        metaParts.push(`Bloom Level: ${question.bloomLevel}`);
      }
      
      return metaParts.length > 0 
        ? `<div class="question-meta">${metaParts.join(' | ')}</div>`
        : '';
    },
  
    /**
     * Generate footer section for PDF
     */
    generateFooter(paper) {
      return `
        <div class="footer">
            End of Question Paper - Total Questions: ${paper.totalQuestions} | Total Marks: ${paper.totalMarks}
        </div>
      `;
    },
  
    /**
     * Generate answer sheet PDF
     */
    generateAnswerSheet(paper) {
      const answerSheetHTML = `
      <!DOCTYPE html>
      <html>
      <head>
          <title>${paper.title} - Answer Sheet</title>
          <style>
              ${this.getPDFStyles()}
              .answer-grid {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 10px;
                  margin: 20px 0;
              }
              .answer-item {
                  border: 1px solid #ccc;
                  padding: 10px;
                  text-align: center;
              }
              .answer-options {
                  margin-top: 5px;
                  display: flex;
                  justify-content: space-around;
              }
              .option-circle {
                  width: 20px;
                  height: 20px;
                  border: 2px solid #333;
                  border-radius: 50%;
                  display: inline-block;
                  margin: 0 5px;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <div class="paper-title">${paper.title} - Answer Sheet</div>
              <div class="paper-info">Name: _________________ Roll No: _________ Date: _________</div>
          </div>
          
          <div class="answer-grid">
              ${paper.questions ? paper.questions.map((_, index) => `
                  <div class="answer-item">
                      <div><strong>Q${index + 1}</strong></div>
                      <div class="answer-options">
                          <span class="option-circle"></span> A
                          <span class="option-circle"></span> B
                          <span class="option-circle"></span> C
                          <span class="option-circle"></span> D
                      </div>
                  </div>
              `).join('') : ''}
          </div>
      </body>
      </html>`;
  
      const printWindow = window.open('', '_blank');
      printWindow.document.write(answerSheetHTML);
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    },
  
    /**
     * Generate PDF-specific CSS styles
     */
    getPDFStyles() {
      return `
        body {
            font-family: 'Times New Roman', serif;
            line-height: 1.4;
            margin: 0;
            padding: 20px;
            color: #000;
            font-size: 14px;
        }
        
        .header {
            text-align: center;
            border-bottom: 2px solid #000;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .paper-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
        }
        
        .paper-info {
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .instructions {
            background-color: #f5f5f5;
            padding: 15px;
            border-left: 4px solid #333;
            margin-bottom: 25px;
        }
        
        .instructions h3 {
            margin-top: 0;
            font-size: 16px;
        }
        
        .instructions ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        
        .question {
            margin-bottom: 25px;
            page-break-inside: avoid;
        }
        
        .question-header {
            font-weight: bold;
            margin-bottom: 8px;
            font-size: 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .question-marks {
            font-size: 12px;
            color: #666;
            font-weight: normal;
        }
        
        .question-text {
            margin-bottom: 12px;
            line-height: 1.5;
        }
        
        .options {
            margin-left: 15px;
        }
        
        .option {
            margin-bottom: 6px;
            display: flex;
            align-items: flex-start;
        }
        
        .option-label {
            font-weight: bold;
            margin-right: 8px;
            min-width: 20px;
        }
        
        .option-text {
            flex: 1;
        }
        
        .answer-space {
            margin-top: 15px;
            border: 1px solid #ccc;
            height: 25px;
            background-color: #fafafa;
        }
        
        .question-meta {
            margin-top: 8px;
            font-size: 10px;
            color: #666;
            font-style: italic;
        }
        
        .footer {
            position: fixed;
            bottom: 20px;
            left: 20px;
            right: 20px;
            text-align: center;
            font-size: 10px;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 10px;
        }
        
        .distribution-summary {
            margin-bottom: 20px;
            padding: 10px;
            border: 1px solid #ddd;
            background-color: #f9f9f9;
        }
        
        .distribution-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 5px;
            font-size: 12px;
        }
        
        .no-questions {
            text-align: center;
            padding: 20px;
            color: #666;
            font-style: italic;
        }
        
        @media print {
            body { margin: 0; }
            .question { page-break-inside: avoid; }
            .no-print { display: none; }
        }
      `;
    }
  };