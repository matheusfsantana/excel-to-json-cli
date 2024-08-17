import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import ExcelJS from 'exceljs'
import { extractExcelData, convertDataToArrayObject  } from "../lib/extractFromExcel";

fs.existsSync = jest.fn();
ExcelJS.Workbook = jest.fn();

describe('extractExcelData', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const filepath = "../../Downloads/teste.xlsx"

  it('should call process.exit(1) if filepath directory or file doesn\'t exist', async () => {
    fs.existsSync.mockReturnValue(false);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {
        throw new Error('process.exit called');
    });
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    try {
        await extractExcelData(filepath);
    } catch (error) {
        expect(error.message).toBe('process.exit called');
    }

    expect(fs.existsSync).toHaveBeenCalledWith(filepath);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(`Erro: o diretório ou arquivo ${path.resolve(filepath)} não foi encontrado.`)

  });

  it('should read and return data from a valid Excel file', async () => {
    fs.existsSync.mockReturnValue(true);

    const mockWorkbook = {
        //worksheet methods "getRow" and "eachRow" simulation/mock 
        worksheets: [
            { 
                // const header = worksheet.getRow(1).values.slice(1);
                getRow: jest.fn().mockImplementation((rowNumber) => {
                    if (rowNumber === 1) {
                        return { values: [null,'ID', 'Name', 'Age'] };
                    } else {
                        return { values: [[null,1, 'Matthew', 20],[null,1, 'Jhon', 21],[null,3, 'David', 22]]};
                    }
                }),

                // worksheet.eachRow((row, rowNumber) => {
                //     // avoid the header
                //     if (rowNumber > 1) { 
                //         allRows.push(row.values.slice(1)); 
                //     }
                // });
                eachRow: jest.fn((callback) => {
                    callback({ values: [null,1, 'Matthew', 20] }, 2);
                    callback({ values: [null, 2, 'Jhon', 21] }, 3);
                    callback({ values: [null, 3, 'David', 22] }, 4);
                })
            }
        ],
    };
    ExcelJS.Workbook.mockImplementation(() => mockWorkbook);
    mockWorkbook.xlsx = { readFile: jest.fn() };

     const [allRows, header] = await extractExcelData(filepath);

    expect(allRows).toEqual([[1, 'Matthew', 20], [2, 'Jhon', 21], [3, 'David', 22]]);
    expect(header).toEqual(['ID', 'Name', 'Age']);
  });

  it('should read and return data from a valid Excel file with no rows', async () => {
    fs.existsSync.mockReturnValue(true);

    const mockWorkbook = {
        worksheets: [
            { 
                getRow: jest.fn().mockImplementation((rowNumber) => {
                    if (rowNumber === 1) {
                        return { values: [null,'ID', 'Name', 'Age'] };
                    } else {
                        return { values: [null]};
                    }
                }),

                //no data rows
                eachRow: jest.fn((callback) => {})
            }
        ],
    };
    ExcelJS.Workbook.mockImplementation(() => mockWorkbook);
    mockWorkbook.xlsx = { readFile: jest.fn() };

    const [allRows, header] = await extractExcelData(filepath);

    expect(allRows).toEqual([]);
    expect(header).toEqual(['ID', 'Name', 'Age']);
  });

  it('should read and return data from a valid Excel file with no header and no rows', async () => {
    fs.existsSync.mockReturnValue(true);

    const mockWorkbook = {
        worksheets: [
            { 
                //no header
                getRow: jest.fn().mockImplementation((rowNumber) => {
                    return { values: [] };
                }),

                //no data rows
                eachRow: jest.fn((callback) => {})
            }
        ],
    };
    ExcelJS.Workbook.mockImplementation(() => mockWorkbook);
    mockWorkbook.xlsx = { readFile: jest.fn() };

    const [allRows, header] = await extractExcelData(filepath);

    expect(allRows).toEqual([]);
    expect(header).toEqual([]);
  });
});

describe('convertDataToArrayObject', () => {
    it('should convert data to array of objects', () => {
        const allRows = [[1, 'Matthew', 20], [2, 'Jhon', 21], [3, 'David', 22]]
        const columns = ['ID', 'Name', "Age"]
        const dataObject = convertDataToArrayObject(allRows, columns)

        expect(dataObject).toEqual(
            [
                {'ID': 1, 'Name': 'Matthew', "Age":20}, 
                {'ID': 2, 'Name': 'Jhon', "Age":21}, 
                {'ID': 3, 'Name': 'David', "Age":22}, 
            ]
        )
    });
    it('should convert data to array of objects with null values', () => {
        const allRows = [[null, 'Matthew', 20], [2, 'Jhon'], [3, null, 22]]
        const columns = ['ID', 'Name', "Age"]
        const dataObject = convertDataToArrayObject(allRows, columns)

        expect(dataObject).toEqual(
            [
                {'ID': null, 'Name': 'Matthew', "Age":20}, 
                {'ID': 2, 'Name': 'Jhon', "Age":null}, 
                {'ID': 3, 'Name': null, "Age":22}, 
            ]
        )
    });
    it('should return an empty array when given empty allRows and columns', () => {
        const dataObject = convertDataToArrayObject([], [])
        expect(dataObject).toEqual([])
    });
  });