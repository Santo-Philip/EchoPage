import Compressor from "compressorjs";

export interface CompressOptions {
  convertSize?: number;
}

export function compressImage(
  file: File,
  options: CompressOptions = {}
): Promise<File> {
  return new Promise<File>((resolve, reject) => {
    if (!file) {
      reject(new Error("No file provided"));
      return;
    }

    new Compressor(file, {
      quality:  0.4,
      maxWidth:  1280,
      maxHeight:  720, 
      convertSize: options.convertSize ?? 2_000_000,
      success(result: Blob) {
        const compressedFile = new File([result], file.name, {
          type: result.type || file.type,
          lastModified: Date.now(),
        });

        resolve(compressedFile);
      },
      error(err: Error) {
        reject(err);
      },
    });
  });
}
