import { createApi } from '@reduxjs/toolkit/dist/query/react';
import { RcFile } from 'antd/es/upload';
import { appBaseQuery } from '../../services/query';

interface AttributeMapping {
  AttributeName: string;
  MappedAttributeNum?: number;
}

interface UploadFileParams {
  channelNum?: number;
  channelAccountNum?: number;
  fileOperation: number;
  reason: string;
  files: Array<File | RcFile | undefined>;
  attributeList?: AttributeMapping[];
  createAll?: boolean;
}

interface UploadChannelFileParams {
  channelNum: number;
  channelAccountNum: number;
  /**
   * API docs mention it but still unsure if required.
   */
  channelCatalogNum?: number;
  // Body params
  createAll: boolean;
  attributeList: AttributeMapping[];
  fileOperation: number;
  file: File | RcFile;
  reason: string;
}

export const filesApi = createApi({
  reducerPath: 'api.files',
  baseQuery: appBaseQuery({ baseUrl: '/v1/files' }),
  endpoints: (builder) => ({
    uploadFile: builder.mutation<void, UploadFileParams>({
      query: ({ files, reason, fileOperation, attributeList = [], createAll = false, channelNum, channelAccountNum }) => {
        const data = new FormData();

        files.forEach(f => {
          if (!f) {
            return;
          }

          data.append('files[]', f);
        });

        data.append('FileOperation', fileOperation.toString());
        data.append('Reason', reason);
        data.append('CreateAll', createAll.toString());
        data.append('AttributeList', JSON.stringify(attributeList));
        if (channelAccountNum && channelNum) {
          data.append('ChannelAccountNum', channelAccountNum.toString());
          data.append('ChannelNum', channelNum.toString());
        }

        return {
          url: '/upload',
          method: 'POST',
          data,
        };
      },
    }),
    uploadChannelFile: builder.mutation<void, UploadChannelFileParams>({
      query: ({ file, fileOperation, reason, channelNum, channelAccountNum, createAll, attributeList }) => {
        const data = new FormData();
        data.append('file', file);
        data.append('FileOperation', fileOperation.toString());
        data.append('Reason', reason);
        data.append('ChannelNum', channelNum.toString());
        data.append('CreateAll', createAll.toString());
        data.append('AttributeList', JSON.stringify(attributeList));
        data.append('ChannelAccountNum', channelAccountNum.toString());
        // Hardcoded until more info is provided
        data.append('ChannelAccountFileImportType', '1');

        return ({
          url: '/uploadChannelFile',
          method: 'POST',
          data,
        });
      },
    }),
  }),
});

export const { useUploadChannelFileMutation, useUploadFileMutation } = filesApi;
