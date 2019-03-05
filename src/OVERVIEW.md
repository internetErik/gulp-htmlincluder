

## `processFile`)

Converts file to node

Ignores nodes that contain no tags

Otherwise, sends node to `processNode`

## `processNode`

Builds up nested nodes (both nested tags and chidlren)

* Ignores nodes that are of type `textContent`
* Splits up content of node (`splitContent`)
* builds `content.nestedNodes` with `buildNodes`
* calls `resolveNode`

### `buildNodes`

* Loops through list of split up content
  * 


## `resolveNode)`

Resolves nodes, ultimately setting their node.content
