
const {writeFileSync, mkdirSync} = require('fs');

require( 'dotenv').config();

const targetPath = './src/environments/environment.ts';
const targetPathDev = './src/environments/environment.development.ts';

if (!process.env["MAPTILER_KEY"]){
    throw new Error('MAPTILER_KEY is not set')
}
const enviFileContent = `

export const environment = {
    maptilerKey: "${process.env['MAPTILER_KEY']}"
};

`;

mkdirSync('./src/environments', {recursive: true});

writeFileSync( targetPath, enviFileContent);
writeFileSync( targetPathDev, enviFileContent);
