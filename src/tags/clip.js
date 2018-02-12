// <!--#clipbefore -->
// <!--#clipafter -->
// <!--#clipbetween -->
// <!--#endclipbetween -->
// This runs first, since all of the clipped areas will completely be removed
export default function processClip(file) {
  var tmp;

  if(file.content.indexOf('<!--#clipbefore') > -1) {

    file.content = file.content
            .split(/<!--#clipbefore\s*-->/)
            .splice(1)[0]
            .split('<!--#clipafter')
            .splice(0,1)[0];
  }

  if(file.content.indexOf('<!--#clipbetween') > -1) {

    tmp = file.content
        .split(/<!--#clipbetween\s*-->/);

    file.content = tmp[0] + tmp[1].split(/<!--#endclipbetween\s*-->/)[1];
  }
}
