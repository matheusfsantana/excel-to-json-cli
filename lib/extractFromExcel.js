import ExcelJS from 'exceljs';
import fs from 'fs';
import process from "process"


export async function extractExcelData(filepath){

    if (!fs.existsSync(filepath)) {
        console.error(`Erro: o diretório ou arquivo ${filepath} não foi encontrado.`)
        process.exit(1)
    } 

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filepath);
    const worksheet = workbook.worksheets[0];
    const allRows = [];
    const header = worksheet.getRow(1).values.slice(1);

    console.log("Extraindo dados do arquivo .xlsx...")
    worksheet.eachRow((row, rowNumber) => {
        // avoid the header
        if (rowNumber > 1) { 
            allRows.push(row.values.slice(1)); 
        }
    });

    return [allRows, header];
}

export const convertDataToArrayObject = (data, columns) => {
    const allRowsConverted = []

    for(let currentRow = 0; currentRow < data.length; currentRow++){
        let dataObject = {}
        for(let rowColumn = 0; rowColumn < columns.length; rowColumn++){
            dataObject[columns[rowColumn]] = data[currentRow][rowColumn] || null
        }
        allRowsConverted.push(dataObject)
    }

    return allRowsConverted;
}
