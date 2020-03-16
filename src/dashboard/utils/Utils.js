let Utils = {
  generateTree(arrayList, rootId) {
    let rootNodes = [];
    let traverse = function(nodes, item, index) {
      if (nodes instanceof Array) {
        return nodes.some(node => {
          if (node.id === item.parent) {
            node.children = node.children || [];
            return node.children.push(arrayList.splice(index, 1)[0]);
          }

          return traverse(node.children, item, index);
        });
      }
    };

    while (arrayList.length > 0) {
      arrayList.some((item, index) => {
        if (item.parent === rootId) {
          return rootNodes.push(arrayList.splice(index, 1)[0]);
        }

        return traverse(rootNodes, item, index);
      });
    }

    return rootNodes;
  },
  getLocalStorage(stoageName) {
    return new Promise(res => {
      chrome.storage.local.get([stoageName], result => {
        res(result);
      });
    });
  }
};

export default Utils;
