import { AdapterObject, FullElementInfo, GetTreeResult } from "../adapterApi";
import { parseDataId } from "../../functions/parseDataId";
import { FileStorage, Source } from "@locator/shared";
import { getExpressionData } from "./getExpressionData";
import { getJSXComponentBoundingBox } from "./getJSXComponentBoundingBox";
import { TreeNode } from "../../types/TreeNode";
import { SimpleDOMRect } from "../../types/types";

export function getElementInfo(target: HTMLElement): FullElementInfo | null {
  const found = target.closest("[data-locatorjs-id]");

  if (
    found &&
    found instanceof HTMLElement &&
    found.dataset &&
    (found.dataset.locatorjsId || found.dataset.locatorjsStyled)
  ) {
    const dataId = found.dataset.locatorjsId;
    const styledDataId = found.dataset.locatorjsStyled;
    if (!dataId) {
      return null;
    }

    const [fileFullPath] = parseDataId(dataId);
    const [styledFileFullPath, styledId] = styledDataId
      ? parseDataId(styledDataId)
      : [null, null];

    const locatorData = window.__LOCATOR_DATA__;
    if (!locatorData) {
      return null;
    }

    const fileData: FileStorage | undefined = locatorData[fileFullPath];
    if (!fileData) {
      return null;
    }
    const styledFileData: FileStorage | undefined =
      styledFileFullPath && locatorData[styledFileFullPath];

    const expData = getExpressionData(found, fileData);
    if (!expData) {
      return null;
    }
    const styledExpData =
      styledFileData && styledFileData.styledDefinitions[Number(styledId)];

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const styledLink = styledExpData && {
      filePath: styledFileData.filePath,
      projectPath: styledFileData.projectPath,
      column: (styledExpData.loc?.start.column || 0) + 1,
      line: styledExpData.loc?.start.line || 0,
    };

    // TODO move styled to separate data
    // const styled = found.dataset.locatorjsStyled
    //   ? getDataForDataId(found.dataset.locatorjsStyled)
    //   : null;

    const wrappingComponent =
      expData.wrappingComponentId !== null
        ? fileData.components[Number(expData.wrappingComponentId)]
        : null;

    return {
      thisElement: {
        box: found.getBoundingClientRect(),
        label: expData.name,
        link: {
          filePath: fileData.filePath,
          projectPath: fileData.projectPath,
          column: (expData.loc.start.column || 0) + 1,
          line: expData.loc.start.line || 0,
        },
      },
      htmlElement: found,
      parentElements: [],
      componentBox: getJSXComponentBoundingBox(
        found,
        locatorData,
        fileFullPath,
        Number(expData.wrappingComponentId)
      ),
      componentsLabels: wrappingComponent
        ? [
            {
              label: wrappingComponent.name || "component",
              link: {
                filePath: fileData.filePath,
                projectPath: fileData.projectPath,
                column: (wrappingComponent.loc?.start.column || 0) + 1,
                line: wrappingComponent.loc?.start.line || 0,
              },
            },
          ]
        : [],
    };
  }

  // return deduplicateLabels(labels);

  return null;
}

export class JSXTreeNodeComponent implements TreeNode {
  name: string;
  uniqueId: string;
  constructor(name: string, uniqueId: string) {
    this.name = name;
    this.uniqueId = uniqueId;
  }
  getBox(): SimpleDOMRect | null {
    return null;
  }
  getChildren(): TreeNode[] {
    return [];
  }
  getParent(): TreeNode {
    throw new Error("Method not implemented.");
  }
  getSource(): Source | null {
    throw new Error("Method not implemented.");
  }
}

export class JSXTreeNodeElement implements TreeNode {
  name: string;
  uniqueId: string;
  constructor(name: string, uniqueId: string) {
    this.name = name;
    this.uniqueId = uniqueId;
  }
  getBox(): SimpleDOMRect | null {
    return null;
  }
  getElement(): Element | Text {
    throw new Error("Method not implemented.");
  }
  getChildren(): TreeNode[] {
    return [];
  }
  getParent(): TreeNode {
    throw new Error("Method not implemented.");
  }
  getSource(): Source | null {
    throw new Error("Method not implemented.");
  }
}

function getTree(element: HTMLElement): GetTreeResult | null {
  return null;
}

const reactAdapter: AdapterObject = {
  getElementInfo,
  getTree,
};

export default reactAdapter;
