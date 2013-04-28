/** Class Comment */
function Comment(cmtElement) {
    var _rootElement = cmtElement,
        _text = "",
        _from,
        _when,
        _isSvn = false,
        _isActivity = false,
        _e;
    _e = _rootElement.getElementsByClassName("bd")[0]
            .getElementsByClassName("comments-item")[0];
    if ( _e ) {
        if ( _e.getElementsByClassName("comments-text")[0] ) {
            _text = _e.getElementsByClassName("comments-text")[0]
                    .getElementsByClassName("bz_comment_text")[0].innerText;
            _isActivity=false;
        }
        else if ( _e.getElementsByTagName("div")[0] ) {
            if( _e.getElementsByTagName("div")[0].id.indexOf("activity_text") > -1) {
                _isActivity=true;
            }
        }
    }

    if ( "[Comment by" == _text.substring(0,11)
            && _text.indexOf("SVN Commit") > -1 ) {
        _isSvn = true;
    }

    /** whether this comment is an SVN commit or not */
    this.isSvn = function() {
        return _isSvn;
    }
    /** Obtain the DOM object this comment is constructed by */
    this.getElement = function() {
        return _rootElement;
    }
}

var main = function() {
    console.log("BQ starts...");

    var commentRoot = document.getElementById("comments-history");
    if ( commentRoot != null ) {
        var comments = commentRoot.getElementsByClassName("comments");
        for ( var i = 0 ; i < comments.length ; i++ ) {
            var c = new Comment(comments[i]);
            if ( c.isSvn() ) {
                c.getElement().style.backgroundColor="#FFFF7F";
            }
        }
    }
}

main();
