import XLSX, { ParsingOptions, WorkBook } from 'xlsx';
import { useEffect, useState } from 'react';
import { RcFile } from 'antd/es/upload';

export const parseSpreadsheet = async (file: RcFile | File, parsingOptions?: ParsingOptions): Promise<WorkBook | undefined> => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    if (!e.target) {
      reject(new Error('No file available'));
      return;
    }

    const opts: ParsingOptions = {
      ...parsingOptions,
      type: 'binary',
    };

    const book = XLSX.read(e.target.result, opts);
    resolve(book);
  };

  reader.readAsBinaryString(file);
});

export const readSheet = (workbook: WorkBook, targetSheet?: string): Promise<string[][] | undefined> => new Promise((resolve, reject) => {
  let sheetName = targetSheet;
  if (!sheetName) {
    [sheetName] = workbook.SheetNames;
  }

  const sheet = workbook.Sheets?.[sheetName];
  if (!sheet) {
    reject(new Error(`Workbook does not contain the sheet "${sheetName}"`));
    return;
  }

  const parsedData: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  resolve(parsedData);
});

/**
 * Read/Parse spreadsheet file
 */
export const useLoadSpreadsheet = (file?: RcFile | File, parsingOptions?: ParsingOptions): WorkBook | undefined => {
  const [workbook, setWorkbook] = useState<WorkBook | undefined>();

  useEffect(() => {
    let mounted = true;
    const unmount = () => {
      mounted = false;
    };

    if (!file) {
      return unmount;
    }

    parseSpreadsheet(file, parsingOptions)
      .then((data) => {
        if (!mounted) {
          return;
        }
        setWorkbook(data);
      })
      .catch(() => {
        if (!mounted) {
          return;
        }
        setWorkbook(undefined);
      });

    return unmount;
  }, [file, parsingOptions]);

  return workbook;
};

export const useReadWorkbookSheet = (workbook?: WorkBook, targetSheet?: string): string[][] => {
  const [headers, setHeaders] = useState<string[][]>([]);

  useEffect(() => {
    let mounted = true;
    const unmount = () => {
      mounted = false;
    };

    if (!workbook) {
      return unmount;
    }

    readSheet(workbook, targetSheet)
      .then(data => {
        if (!mounted) {
          return;
        }

        if (data) setHeaders(data);
        else setHeaders([]);
      })
      .catch(() => {
        setHeaders([]);
      });

    return unmount;
  }, [workbook, targetSheet]);

  return headers;
};
