export const pdfGenerator = {
    generateAndDownload: (paper) => {
      // Create HTML content for the PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>${paper.title}</title>
          <style>
            @media print {
              @page {
                margin: 1in;
                size: A4;
              }
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
            }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 8.5in;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 20px;
            }
            .title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .paper-info {
              display: flex;
              justify-content: space-around;
              margin-bottom: 20px;
              font-weight: bold;
            }
            .instructions {
              margin-bottom: 30px;
            }
            .instructions h3 {
              font-size: 16px;
              margin-bottom: 10px;
              text-decoration: underline;
            }
            .instructions ul {
              padding-left: 20px;
            }
            .questions {
              margin-top: 30px;
            }
            .questions h3 {
              font-size: 18px;
              margin-bottom: 20px;
              text-decoration: underline;
            }
            .question {
              margin-bottom: 25px;
              page-break-inside: avoid;
            }
            .question-header {
              font-weight: bold;
              margin-bottom: 10px;
              font-size: 14px;
            }
            .options {
              margin-left: 20px;
              margin-bottom: 10px;
            }
            .option {
              margin-bottom: 5px;
            }
            .answer {
              margin-left: 20px;
              font-style: italic;
              margin-bottom: 10px;
            }
            .metadata {
              font-size: 10px;
              color: #666;
              margin-left: 20px;
              border-top: 1px solid #ddd;
              padding-top: 5px;
            }
            .separator {
              border-bottom: 1px solid #333;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${paper.title}</div>
            <div class="paper-info">
              <span>Time: ${paper.timeLimit} minutes</span>
              <span>Total Questions: ${paper.totalQuestions}</span>
              <span>Total Marks: ${paper.totalMarks}</span>
            </div>
          </div>
  
          <div class="instructions">
            <h3>INSTRUCTIONS:</h3>
            <ul>
              ${paper.instructions.map(inst => `<li>${inst}</li>`).join('')}
            </ul>
          </div>
  
          <div class="separator"></div>
  
          <div class="questions">
            <h3>QUESTIONS:</h3>
            ${paper.questions.map((q, index) => `
              <div class="question">
                <div class="question-header">
                  ${index + 1}. ${q.question_text} [${q.marks} marks]
                </div>
                
                ${q.options ? `
                  <div class="options">
                    ${q.options.map((opt, i) => `
                      <div class="option">
                        ${String.fromCharCode(65 + i)}) ${opt}
                      </div>
                    `).join('')}
                  </div>
                ` : ''}
                
                
                <div class="metadata">
                  Subject: ${q.subject} | Difficulty: ${q.difficulty} | Chapter: ${q.chapter || 'N/A'} | Bloom Level: ${q.bloom_level || 'N/A'}
                </div>
              </div>
            `).join('')}
          </div>
        </body>
        </html>
      `;
  
      // Create a new window and print to PDF
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          // Close the window after printing (optional)
          printWindow.onafterprint = () => {
            printWindow.close();
          };
        }, 500);
      };
    }
  };