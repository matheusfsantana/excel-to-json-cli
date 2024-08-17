# excel-to-json-cli
Um CLI simples para converter arquivos .xslx para .json

# Como instalar

```bash
$ npm install -g git+https://github.com/matheusfsantana/excel-to-json-cli.git
```

# Como utilizar

Se você quer converter um arquivo .xlsx para JSON e que as chaves no JSON possua o mesmo nome que as colunas do Excel execute:

```bash
$ excel-to-json -f ../caminho/para/seu/arquivo/excel.xlsx -o caminho/para/seu/arquivo/arquivo.json
```

Caso você queira que alguma coluna do arquivo Excel tenha um nome diferente no JSON execute:

```bash
$ excel-to-json -c -f ../caminho/para/seu/arquivo/excel.xlsx -o caminho/para/seu/arquivo/arquivo.json
```
# Opções

| Opção                  | Descrição                                                                                           | Exemplo                                    |
|------------------------|-----------------------------------------------------------------------------------------------------|--------------------------------------------|
| `-V`, `--version`      | Exibe a versão do CLI.                                                                            |                                            |
| `-c`, `--columns`      | Use esta flag para renomear colunas do arquivo `.xlsx` antes de salvar o JSON.                     |                                            |
| `-f`, `--file <file>`  | Especifique o caminho do arquivo `.xlsx` que deseja converter para JSON.                           | `-f caminho/seu/arquivo/xlsx/file.xlsx`   |
| `-o`, `--output <output>` | Especifique onde deseja salvar o arquivo JSON.                                                    | `-o caminho/seu/arquivo/json/file.json`   |
| `-h`, `--help`         | Exibe ajuda sobre os comandos disponíveis.                                                         |                                            |

# Melhorias implementadas

- Agora o feedback ao salvar ou ao dar um erro caso o arquivo/diretório não exista, retorna o caminho completo do arquivo ou diretorio.
Ex: Salvo com sucesso em /home/user/folder/file.json

- Agora ao salvar um arquivo com o mesmo nome em uma mesma pasta o arquivo não é sobreescrito, é criado um novo;
Ex: teste (1).json, teste (2).json, etc

- Testes unitários para as funções de extrair dados do excel, converter os dados para objeto e salvar arquivo em json.