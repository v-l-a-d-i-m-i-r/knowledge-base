import { addBuildIdToFilePath } from '../utils/add-build-id-to-file-path';

export function renderJs(props: JSProperties) {
  const buildId = props.buildId;
  const path = props.path;

  const pathWithBuildId = addBuildIdToFilePath({ filePath: path, fileExt: '.js', buildId });

  return `<script src="${pathWithBuildId}"></script>`;
}

type JSProperties = {
  buildId: string;
  path: string;
};
