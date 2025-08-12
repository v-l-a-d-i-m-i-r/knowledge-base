import { addBuildIdToFilePath } from '../utils/add-build-id-to-file-path';

export function renderCss(props: CSSProperties): string {
  const buildId = props.buildId;
  const path = props.path;

  const pathWithBuildId = addBuildIdToFilePath({ filePath: path, fileExt: '.css', buildId });

  return `<link rel="stylesheet" href="${pathWithBuildId}">`;
}

type CSSProperties = {
  buildId: string;
  path: string;
};
