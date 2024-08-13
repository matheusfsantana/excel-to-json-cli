import fs from 'fs';
import path from 'path';
import process from "process"

export const writeJsonFile = (convertedData, filepath, filename) => {

    if (!fs.existsSync(filepath)) {
        console.error(`Erro: o diretório ${filepath} do arquivo ${filename} não foi encontrado.`)
        process.exit(1)
    } 

    filename = renameFileIfAlreadyExists(filepath, filename)

    const output = path.join(filepath, filename);  
    console.log("Exportando para JSON...")
    fs.writeFile(output, JSON.stringify(convertedData, null, 2), (err) => {
        if (err) {
            console.error('Erro ao exportar para JSON: ', err);
        } else {
            console.log(`JSON salvo com sucesso em: ${path.resolve(output)}`);
        }
    });
};

const  renameFileIfAlreadyExists = (filepath,filename) => {
    let i = 1;
    let output = path.join(filepath, filename);

    while (fs.existsSync(output)) {
        if (filename.includes(` (${i - 1}).json`)) {
            filename = filename.replace(` (${i - 1}).json`, ` (${i}).json`);
        } else {
            filename = filename.replace('.json', ` (${i}).json`);
        }
        output = path.join(filepath, filename);
        i += 1;
    }
    return filename;
}
