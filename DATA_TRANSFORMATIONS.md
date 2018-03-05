wrap data
  hello
  insert data
  each [{true},{false},{true},{false}]
    text
    if
      statement
    endif
  endeach
  world
endwrap

The array (pseudo-code)
[
  wrap-inserted title,
  wrap-inserted header,
  hello,
  inserted text,
  [// each
    'each'
    [ data,
      text,
      [// if true
        statement,
      ],
    ],
    [ data,
      text,
      [// if false
        statement,
      ],
    ],
    [ data,
      text,
      [// if true
        statement,
      ],
    ],
    [ data,
      text,
      [// if false
        statement,
      ],
    ],
  ],
  world,
  wrap-inserted footer,
]
