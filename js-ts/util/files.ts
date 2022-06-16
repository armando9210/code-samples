import { message } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import * as XLSX from 'xlsx';

/**
 * Download file from blob data.
 */
const downloadFile = (fileName: string, data: string) => {
  const url = (window.URL || window.webkitURL).createObjectURL(new Blob([data]));
  const link = document.createElement('a');

  link.href = url;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();
  // console.log('res', res, typeof res);
  setTimeout(() => {
    document.body.removeChild(link);
  }, 0);
};

/**
 * Checks whether any given file is empty
 * @param file
 * @param files
 */
const validateFileIsNotEmpty = (files: UploadFile[]): Promise<void> => new Promise((resolve, reject) => {
  if (files.length === 0) {
    return;
  }

  const f = files[0].originFileObj;

  if (!f) {
    return;
  }

  const extension = f.name.split('.').pop();
  if (extension !== 'xls' && extension !== 'xlsx') {
    message.error('Wrong file format (Accepted formats: xls, xlsx)').then();
    reject();
    return;
  }

  const reader = new FileReader();

  reader.addEventListener('error', () => {
    reader.abort();
    reject(new DOMException('Problem parsing input file.'));
  });

  reader.addEventListener('load', (e) => {
    if (!e.target) {
      reject();
      return;
    }

    const data = new Uint8Array(e.target.result as ArrayBuffer);
    const workbook = XLSX.read(data, { type: 'array' });
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    const fileContent = XLSX.utils.sheet_to_json(firstWorksheet, { header: 1 });

    if (fileContent.filter((fi: any) => fi.length !== 0)[1] === undefined) {
      message.error('Empty File, please re-upload').then();
      reject();
    } else {
      resolve();
    }
  });

  reader.readAsArrayBuffer(f);
});

export default validateFileIsNotEmpty;
export {
  downloadFile,
};
