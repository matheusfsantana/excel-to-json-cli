#!/usr/bin/env node

import process from 'process';
import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from 'node:process';
import { extractExcelData, convertDataToArrayObject } from "../lib/extractFromExcel.js";
import { writeJsonFile } from '../lib/writeToJson.js';
import { Command } from 'commander';
import path from 'path'
import fs from 'fs';
import { fileURLToPath } from 'url';

// Reading package.json to get the version
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../package.json'), 'utf8'));

const program = new Command();

program
  .name('excel-to-json-cli')
  .description(`excel-to-json-cli ${packageJson.version}\n\nUm CLI simples para converter arquivos .xslx para .json`)
  .version(packageJson.version);

program
    .option('-c, --columns', 
        'Use a flag -c ou --columns caso queira renomear alguma coluna do arquivo .xlsx antes de salvar o JSON.')
    .option('-f, --file <file>',
         'Especifique o caminho do arquivo .xlsx que você deseja converter para JSON. Exemplo: -f caminho/seu/arquivo/xlsx/file.xlsx')
    .option('-o, --output <output>',
         'Especifique aonde você quer salvar seu arquivo JSON. Exemplo: -o caminho/seu/arquivo/json/file.json')

program.configureHelp({
commandUsage: () => 'excel-to-json-cli [opções]',
optionDescription: (option) => {
    switch (option.long) {
        case '--version' || '-V':
            return 'Exibe a versão do CLI';
        case '--help' || '-h':
            return 'Exibe ajuda para comandos';
        default:
            return option.description;
        }
    },
});

program.parse(process.argv);

const options = program.opts();

async function main(options) {
    
    if (!options.file || !options.output) {
        console.error('Erro: caminho para o arquivo .xlsx ou .json não foi especificado.');
        program.help();
    }

    const xlsxFilePath = options.file;
    const outputPath = path.dirname(options.output);
    const outputFilename = path.basename(options.output);


    let [data,header] = await extractExcelData(xlsxFilePath)

    if (options.columns){
        const rl = readline.createInterface({ input, output });
        console.log("Renomeie as colunas que você quer que mude na chave no seu JSON. Deixe em branco caso não queira alterar o nome da coluna")
        for (let [index, value] of header.entries()){
            const newColumn = await rl.question(`${value}: `)
            if (newColumn){
                header[index] = newColumn
            }
        };
        rl.close()
    }
 
    const columns = header
   
    const convertedData = convertDataToArrayObject(data, columns)

    writeJsonFile(convertedData, outputPath, outputFilename)
   
}

main(options).catch(console.error);
