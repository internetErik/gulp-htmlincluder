<!--#wrap data -->
  hello
  <!--#insert data -->
  <!--#each [{true},{false},{true},{false}] -->
    text
    <!--#if -->
      text
    <!--#else -->
      alternate text
    <!--#endif -->
  <!--#endeach -->
  world
<!--#endwrap -->

Rules:
* Try to resolve leaf nodes first
* Resolve tags before their children

Process:
* Break file into parts (tag non-tag)
* Iterate through collection
  * Build node
  * If the tag should children
    * recurse to iterating function


## Arbitrarily Nested Tags

```
<!--#insert
  path="<!--#data jsonPath="file" rawJson="{ file : '<!--#insertJson jsonPath="filename" -->"
  <!--#if jsonPath="" rawJson="" -->jsonPath="hello"<!--#endif -->
-->
```

* We know that we have a tag
* we know all of the nested tags
```
[
  {
    content : '<!--#data jsonPath="file" rawJson="{ file : '<!--#insertJson jsonPath="filename" -->',
    childNodes: [ '<!--#insertJson jsonPath="filename" -->' ]
  },
  {
    content: '<!--#if jsonPath="" rawJson="" -->jsonPath="hello"<!--#endif -->',
  },
]
```

If we resolve all of the inner most tags is it possible for them to be ambiguous

Should we resolve tags or just bind data?

Until I resolve nested tags, attributes cannot be evaluated, and so it doesn't make sense to process a tag until it has all of its nested tags processed.

The content for higher tags must be rebuilt from the content of lower tags.
