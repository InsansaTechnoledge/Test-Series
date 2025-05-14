import xlsx from 'xlsx';

const parseExcel = (filePath) => {
  try{
  const workbook = xlsx.readFile(filePath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  return xlsx.utils.sheet_to_json(sheet);
  }catch(err){
    console.error("Error reading Excel file:", err);
    throw err;
  }
};

export default parseExcel;