import fs from 'fs';
import path from 'path';
import process from "process"

export const writeJsonFile = async (convertedData, filepath, filename) => {

    if (!fs.existsSync(filepath)) {
        console.error(`Erro: o diretório ${path.resolve(filepath)} não foi encontrado.`)
        process.exit(1)
    } 

    filename = renameFileIfAlreadyExists(filepath, filename)

    const output = path.join(filepath, filename);  
    console.log("Exportando para JSON...")
    try {
        await fs.promises.writeFile(output, JSON.stringify(convertedData, null, 2));
        console.log(`JSON salvo com sucesso em: ${path.resolve(output)}`);
    } catch (err) {
        console.error('Erro ao exportar para JSON: ', err);
    }

    //return filename to be tested
    return filename
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
