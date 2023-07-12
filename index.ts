// Import stylesheets
import "./style.css";

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById("app");
appDiv.innerHTML = `<h1>open console</h1>`;

export type TTree<T> = {
  children?: TTree<T>[];
} & T;

/**
 * flat list to tree
 *
 * @param list - a flat list
 * @param params - `{ id, parentId }`: id name and parentId name
 * @example `arrayToTree<IFolder>(folderArr, { id: 'folderId', parentId: 'folderParentId' });`
 * @returns `TTree`
 */
export const arrayToTree = <T>(
  list: T[],
  { id, parentId }: { id: string; parentId: string }
): TTree<T>[] | [] => {
  /** map between id and array position */
  const map: number[] = [];
  const treeList: TTree<T>[] = list as TTree<T>[];

  for (let i = 0; i < treeList.length; i += 1) {
    /** initialize the map */
    map[(treeList[i] as TTree<T> & { [id: string]: number })[id]] = i;
    /** initialize the children */
    treeList[i].children = [];
  }

  let node: TTree<T> & { [parentId: string]: number };
  /** return value */
  const roots: TTree<T>[] = [];

  for (const item of treeList) {
    node = item as TTree<T> & { [parentId: string]: number };
    if (node[parentId] !== 0) {
      if (treeList[map[node[parentId]]] !== undefined) {
        treeList[map[node[parentId]]].children?.push(node);
      }
    } else {
      roots.push(node);
    }
  }
  return roots;
};

export interface IFolder {
  folderId: number;
  folderParentId: number;
  name: string;
}

const folderArr = [
  { folderId: 1, folderParentId: 0, name: "root" },
  { folderId: 2, folderParentId: 1, name: "A" },
  { folderId: 3, folderParentId: 1, name: "B" },
  { folderId: 4, folderParentId: 3, name: "C" }
];

const folderTree = [
  {
    folderId: 1,
    folderParentId: 0,
    name: "root",
    children: [
      { folderId: 2, folderParentId: 1, name: "A", children: [] },
      {
        folderId: 3,
        folderParentId: 1,
        name: "B",
        children: [{ folderId: 4, folderParentId: 3, name: "C", children: [] }]
      }
    ]
  }
];

const arrToTreeRes = arrayToTree<IFolder>(folderArr, {
  id: "folderId",
  parentId: "folderParentId"
});

console.log(JSON.stringify(folderTree));
console.log(JSON.stringify(arrToTreeRes));

if (JSON.stringify(folderTree) === JSON.stringify(arrToTreeRes)) {
  console.log("equal");
}

console.log(arrToTreeRes);
