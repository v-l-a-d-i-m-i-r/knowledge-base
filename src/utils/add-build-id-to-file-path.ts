export function addBuildIdToFilePath(input: AddBuildIdToFilePathInput): string {
  const filePath = input.filePath;
  const fileExt = input.fileExt;
  const buildId = input.buildId;

  const baseName = filePath.substring(0, filePath.lastIndexOf(fileExt));
  return `${baseName}.${buildId}${fileExt}`;
}

type AddBuildIdToFilePathInput = {
  filePath: string;
  fileExt: string;
  buildId: string;
};
