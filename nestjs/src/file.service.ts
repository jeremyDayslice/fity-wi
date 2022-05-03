/*
https://docs.nestjs.com/providers#services
*/

import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
@Injectable()
export class FileService {

    saveObjToJson(obj:any, key:string, loc:string): boolean {
        try {
            fs.writeFileSync(`${loc}/${key}.json`, JSON.stringify(obj));
        } catch (e) {
            return false;
        }
        return true;
    }

    readFileToObj(key:string, loc:string): any {
        const json = fs.readFileSync(`${loc}/${key}.json`);
        return json.toJSON();
    }
}
