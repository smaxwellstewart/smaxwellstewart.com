function makeMarkdown($sce) {
    return function (md) {
        if (!md) {
            return '';
        };

        var html = marked(md);
        return $sce.trustAsHtml(html);;
    };
}

function makeBlogSnippet($sce) {
    return function (md) {
        if (!md) {
            return '';
        };

        var max = 200;
        var tail = '... ';

        md = md.substr(0, max);

        var lastspace = md.lastIndexOf('\n');
        if (lastspace != -1) {
            md = md.substr(0, lastspace);
        }
        md = md + tail;

        var html = marked(md);
        return $sce.trustAsHtml(html);
    };
}

function ucFirst() {
    return function(input, scope) {
        if (input!=null) {
            input = input.toLowerCase();
            input = input.substring(0,1).toUpperCase()+input.substring(1);
        }

        return input;
    }
}
angular.module('mySite')
    .filter('snippet', makeBlogSnippet)
    .filter('markdown', makeMarkdown)
    .filter('ucfirst', ucFirst)
