import { Injectable } from '@angular/core';

@Injectable()
export class FileUtilService {

  constructor() { }

  getHeaderArray(csvRecordsArr) {
    let headers = csvRecordsArr[0].split(';');
    let headerArray = [];
    for (let j = 0; j < headers.length; j++) {
        headerArray.push(headers[j]);
    }
    return headerArray;
}
 
getDataRecordsArrayFromCSVFile(csvRecordsArray, headerLength) {
    var dataArr = []
 
    for (let i = 0; i < csvRecordsArray.length; i++) {
        let data = csvRecordsArray[i].split(';');
         
        if (data.length == headerLength) {
            let col = [];
 
            for (let j = 0; j < data.length; j++) {
                col.push(data[j]);
            }
 
            dataArr.push(col);
        }else{
            return null;
        }
    }   
    return dataArr;
}

}
