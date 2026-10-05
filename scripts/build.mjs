import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {loadCatalog,validateCatalog} from './validate-content.mjs';
const preview=process.argv.includes('--preview');
const output=preview?'dist-preview':'dist';
// Only these owned output directories are removed; failed validation must not leave a stale accepted build.
fs.rmSync(path.resolve(output),{recursive:true,force:true});
const result=validateCatalog(loadCatalog(),{production:!preview});
if(result.errors.length){console.error(result.errors.join('\n'));process.exitCode=1;}
else {execFileSync(process.execPath,['node_modules/astro/bin/astro.mjs','build','--outDir',output],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});}
