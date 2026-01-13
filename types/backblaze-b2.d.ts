declare module "backblaze-b2" {
  export interface B2Options {
    applicationKeyId: string;
    applicationKey: string;
  }

  export interface AuthorizeResponse {
    data: {
      authorizationToken: string;
      apiUrl: string;
      downloadUrl: string;
      recommendedPartSize: number;
    };
  }

  export interface GetUploadUrlResponse {
    data: {
      bucketId: string;
      uploadUrl: string;
      authorizationToken: string;
    };
  }

  export interface UploadFileOptions {
    uploadUrl: string;
    uploadAuthToken: string;
    fileName: string;
    data: Buffer;
    contentType: string;
  }

  export interface UploadFileResponse {
    data: {
      fileId: string;
      fileName: string;
      contentType: string;
      contentLength: number;
    };
  }

  export interface DeleteFileVersionOptions {
    fileName: string;
    fileId: string;
  }

  export default class B2 {
    constructor(options: B2Options);
    authorize(): Promise<AuthorizeResponse>;
    getUploadUrl(options: { bucketId: string }): Promise<GetUploadUrlResponse>;
    uploadFile(options: UploadFileOptions): Promise<UploadFileResponse>;
    deleteFileVersion(options: DeleteFileVersionOptions): Promise<void>;
  }
}
