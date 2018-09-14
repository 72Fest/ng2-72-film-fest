import * as moment from 'moment';
import { Deserializable } from '../interfaces/deserializeable.interface';
import { markdown } from 'markdown';

const updateMarkdownLinks = nodes => {
  const nodeType = nodes[0];
  let nodeData;

  if (nodeType === 'link') {
    nodeData = nodes[1];
    //if we found a link node, add an onclick to
    //open the system browser
    nodeData.class = 'ex-link';
    nodeData['onclick'] = "window.open('" + nodeData.href + "', '_system', 'location=yes')";
    nodeData.href = '';
  } else {
    nodes.forEach(function(curNode) {
      if (Array.isArray(curNode)) {
        updateMarkdownLinks(curNode);
      }
    });
  }

  return nodes;
};
const processMd = content => {
  // create a json map of the markdown
  let tree = markdown.parse(content);
  // we need to update all links to include some javascript that will open
  // links into a new window
  tree = updateMarkdownLinks(tree);

  // render the object map to HTML and return the results
  return markdown.renderJsonML(markdown.toHTMLTree(tree));
};

export class NewsItemModel implements Deserializable {
  id: string;
  timestamp: string;
  title: string;
  content: string;
  get timeStr(): string {
    if (this.timestamp) {
      return moment(this.timestamp).fromNow();
    }

    return 'no date';
  }

  deserialize(input: any): this {
    Object.assign(this, input);

    // convert markdown to HTML
    if (input.content) {
      this.content = processMd(input.content);
    }

    return this;
  }
}
