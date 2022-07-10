import { HighlightedNode, SimpleNode } from "./types";
export declare type IdsMap = {
    [id: string]: true;
};
export declare function RootTreeNode(props: {
    node: SimpleNode;
    idsToShow: IdsMap;
    highlightedNode: HighlightedNode;
}): import("solid-js").JSX.Element;