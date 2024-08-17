import { jest } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { writeJsonFile, renameFileIfAlreadyExists} from '../lib/writeToJson.js';

fs.existsSync = jest.fn();
fs.promises.writeFile = jest.fn();

describe('writeJsonFile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const filename = 'test.json';
  const filepath = './testDir';
  const output = path.join(filepath, filename)

  it('should call process.exit(1) if filepath directory doesn\'t exist', async () => {
    fs.existsSync.mockReturnValue(false);

    const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    await writeJsonFile({ key: 'value' }, filepath, filename);

    expect(fs.existsSync).toHaveBeenCalledWith(filepath);
    expect(exitSpy).toHaveBeenCalledWith(1);
    expect(errorSpy).toHaveBeenCalledWith(`Erro: o diretório ${filepath} do arquivo ${filename} não foi encontrado.`)
  });

  it('should rename the file if filename already exists', async () => {
    fs.existsSync.mockReturnValueOnce(true) // true for directory exists
                 .mockReturnValueOnce(true) // true for filename already exists
                 .mockReturnValue(false);   // false for filename already exists


    const expectedFilename = 'test (1).json';
    const resultFilename = await writeJsonFile({ key: 'value' }, filepath, filename);

    expect(resultFilename).toBe(expectedFilename);

  });

  it('should write the JSON file if directory exists', async () => {
     fs.existsSync.mockReturnValueOnce(true) // true for directory exists
                  .mockReturnValue(false);   // false for filename already exists

     const logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
     const writeFileSpy = jest.spyOn(fs.promises, "writeFile").mockImplementation(() => {})
     const resultFilename = await writeJsonFile({ key: 'value' }, filepath, filename);

     expect(writeFileSpy).toHaveBeenCalledTimes(1);
     expect(writeFileSpy).toHaveBeenCalledWith(output, JSON.stringify({ key: 'value' }, null, 2));

     expect(resultFilename).toBe(filename);
     expect(logSpy).toHaveBeenCalledTimes(2);
     expect(logSpy.mock.calls[0][0]).toBe("Exportando para JSON...");
     expect(logSpy.mock.calls[1][0]).toBe(`JSON salvo com sucesso em: ${path.resolve(output)}`);

  });

  it('should log an error if writing the file fails', async () => {
    fs.promises.writeFile.mockImplementation(() => {
        throw new Error('File write error');
    });

    const errorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    await writeJsonFile({ key: 'value' }, filepath, filename);

    expect(errorSpy).toHaveBeenCalledWith('Erro ao exportar para JSON: ', new Error('File write error'));
    
  });
});
