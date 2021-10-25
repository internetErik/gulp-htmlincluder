

## `processFile`

Converts file to node

Ignores nodes that contain no tags

Otherwise, sends node to `processNode`

## `processNode`

Builds up nested nodes (both nested tags and children)

* Ignores nodes that are of type `textContent`
* Splits up content of node (`splitContent`)
* builds `content.nestedNodes` with `buildNodes`
* calls `resolveNode`

### `buildNodes`

* create result list
* Loops through list of split up content, while there is split up content
  * shift off first content
    * note: this is how we eventually reach the exit condition
    * note: the same content is passed in by the recursive call below
  * if we are looking for close tag
    * if you found it, then return (dropping close tag - which is unnecessary)
  * creates node
  * if a node that has an end tag
    * call `buildNodes` again and seek close tag
  * insert created node into result list
* return result list

## `resolveNode`

Resolves nodes, ultimately setting their node.content
