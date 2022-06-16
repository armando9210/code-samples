import { CloudDownloadOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import stringify, { Options } from 'csv-stringify';
import _ from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';

interface CSVColumnDefinition<T> {
  /**
   * Name of property present in the input records;
   */
  key: string;
  /**
   * Value to be printed in the first header line.
   * If not specified, defaults to key
   */
  header?: string;
  /**
   * Function to execute by each row in order to transform the column's value
   * @param value
   */
  transform?: (value: T) => any;
}

export type CSVColumns<T = any> = Array<string | CSVColumnDefinition<T>>;

interface CSVLinkProps<T> extends ButtonProps {
  filename: string;
  data: any;
  columns?: CSVColumns<T>;
  children?: React.ReactNode;
}

function normalizeColumns<T>(columns?: CSVColumns<T> | null): CSVColumnDefinition<T>[] {
  return columns ? columns.map(c => typeof c === 'string' ? { key: c } : c) : [];
}

function processData<T>(data: Array<any>, columns: CSVColumnDefinition<T>[] | null = null) {
  if (!columns || columns.length === 0) {
    return data;
  }

  const applicableColumns = columns.filter(c => !!c.transform);

  if (applicableColumns.length === 0) {
    return data;
  }

  return data.map((row: object) => {
    // Prevent modifying the original object when there's nested values
    const newRow: any = _.cloneDeep(row);

    // For each column that has a transform function, apply it and return a new row object
    applicableColumns.forEach(column => {
      newRow[column.key] = column.transform?.(newRow[column.key]) || newRow[column.key];
    });

    return newRow;
  });
}

function generateCSV<T>(data: any, columns: CSVColumns<T> | null = null): Promise<string | null> {
  return new Promise<string | null>((resolve, reject) => {
    if (!Array.isArray(data)) {
      reject(new Error('CSV generation only supports an array of objects'));
      return;
    }

    if (data.length === 0) {
      resolve(null);
      return;
    }

    const options: Options = {
      header: true,
      quoted: true,
      columns: undefined,
    };

    const normalizedColumns = normalizeColumns(columns);

    if (normalizedColumns.length > 0) {
      options.columns = normalizedColumns;
    }

    const processedData = processData(data, normalizedColumns);

    stringify(processedData, options, (err, output) => {
      resolve(output);
    });
  });
}

/**
 * Custom hook that given some data, generates a CSV file that can be downloaded on-demand.
 *
 * @param data - Data for the CSV file
 * @param columns - Columns for the CSV header
 * @param filename - Output filename, defaults to 'data.csv'
 */
export function useGenerateCSV<T>(
  data: T[] | any,
  filename: string = 'data.csv',
  columns?: CSVColumns<T>,
): [() => Promise<void>, boolean] {
  const [processing, setProcessing] = useState<boolean>(false);
  const downloadData = useCallback(async (): Promise<void> => {
    if (!data) {
      return;
    }

    setProcessing(true);
    let csvText = null;

    try {
      csvText = await generateCSV(data, columns);
      if (!csvText) {
        setProcessing(false);
        return;
      }
    } catch (e) {
      setProcessing(false);
      throw new Error('CSV file could not be generated');
    }

    const targetFilename = filename.includes('.csv') ? filename : `${filename}.csv`;
    const link = document.createElement('a');
    link.href = `data:attachment/csv,${encodeURIComponent(csvText)}`;
    link.target = '_blank';
    link.download = targetFilename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setProcessing(false);
  }, [data, filename, columns]);

  return [downloadData, processing];
}

function CSVLink<T>({ data, filename, columns, children, ...props }: CSVLinkProps<T>) {
  const [downloadData, processing] = useGenerateCSV(data, filename, columns);
  const buttonType = props.type ? props.type : 'primary';
  const disabled = useMemo(() => {
    if (Array.isArray(data)) {
      return data.length === 0;
    }

    return !data;
  }, [data]);

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <Button
      type={buttonType}
      {...props}
      disabled={disabled}
      onClick={downloadData}
      loading={processing}
    >
      {/* eslint-enable react/jsx-props-no-spreading */}
      {children}
    </Button>
  );
}

CSVLink.defaultProps = {
  children: [
    'Export',
    <CloudDownloadOutlined key={1} />,
  ],
  columns: undefined,
};

export default CSVLink;
