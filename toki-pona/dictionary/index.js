let index = {};

function createIndex($e, $mama) {
    $e.contents().each((_, node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            createIndex($(node), $mama || $e);
        } else if (node.nodeType === Node.TEXT_NODE) {
            const words = node
                  .textContent
                  .trim()
                  .toLowerCase()
                  .split(/\W+/)
                  .filter(x => !!x);
            if (words.length > 0) {
                words.forEach((x) => {
                    if (index[x] === undefined) {
                        index[x] = [];
                    }
                    index[x].push($mama || $e);
                });
            }
        }
    });
}

$(main);
function main() {
    'use strict';
    const $entries = $('#dict > div');
    const $q = $('#q');
    const $err = $('#no_match');
    $entries.each((_, x) => {
        createIndex($(x));
    });
    $q.on("keyup", () => {
        const q = $q.val().trim().toLowerCase();
        if (q === '') {                        // no query; show everything
            $err.hide();
            $entries.show();
            return;
        }
        const re = new RegExp('^' + q.replace(/[*]/, '.*'));
        const matches = Object.keys(index).filter(x => x.match(re));
        if (matches.length === 0) {            // no matches; show error
            $err.show();
            $entries.hide();
            return;
        }
        $err.hide();                           // show matches
        $entries.hide();
        matches.forEach(match => {
            index[match].forEach($e => $e.show());
        });
    });
}

/*[eof]*/
