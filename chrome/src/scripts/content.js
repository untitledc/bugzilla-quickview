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
    /** whether this comment is an activity to this ticket */
    this.isActivity = function() {
        return _isActivity;
    }
    /** Show the comment in the ticket (http://caniuse.com/#feat=classlist) */
    this.showInPage = function() {
        _rootElement.classList.remove("bq-hide");
    }
    /** Hide the comment in the ticket (http://caniuse.com/#feat=classlist) */
    this.hideInPage = function() {
        _rootElement.classList.add("bq-hide");
    }
    /** Obtain the DOM object this comment is constructed by */
    this.getElement = function() {
        return _rootElement;
    }
}

/** Class Ticket */
function Ticket(id, title) {
    var _id = id,
        _title = title,
        _resolution = false;

    /** get ticket id: NNNNNNN */
    this.getId = function() {
        return _id;
    }

    /** get ticket title */
    this.getTitle = function() {
        return _title;
    }

    /**
     * Set the resolution of this ticket.
     * Often it should be the resolution string, but might be
     * boolean true when you know it has resolution but you don't know which.
     */
    this.setResolution = function(res) {
        _resolution = res;
    }

    /** Whether this ticket has resolution or not (meaning it's 'closed' or not) */
    this.hasResolution = function() {
        return ( _resolution != undefined && _resolution != false );
    }
}

// globle variables
var comments = [];
var blockerTickets = [];

function setCommentView(type, toShow) {
    //XXX should do an index of comment type instead of checking in runtime
    var i;
    if ( type == "svn" ) {
        for ( i = 0 ; i < comments.length ; i ++ ) {
            var cmt = comments[i];
            if ( cmt.isSvn() ) {
                if ( toShow ) cmt.showInPage();
                else cmt.hideInPage();
            }
        }
    }
    else if ( type == "act" ) {
        for ( i = 0 ; i < comments.length ; i ++ ) {
            var cmt = comments[i];
            if ( cmt.isActivity() ) {
                if ( toShow ) cmt.showInPage();
                else cmt.hideInPage();
            }
        }
    }
    else if ( type == "chat" ) {
        for ( i = 0 ; i < comments.length ; i ++ ) {
            var cmt = comments[i];
            if ( !cmt.isSvn() && !cmt.isActivity() ) {
                if ( toShow ) cmt.showInPage();
                else cmt.hideInPage();
            }
        }
    }
}

function initTicketNav() {
    var navRoot = document.createElement("div");
    navRoot.className = "bq-nav";
    document.body.appendChild(navRoot);

    // view filter
    var navView = document.createElement("div");
    navView.className = "bq-nav-view";
    navRoot.appendChild(navView);

    navView.innerHTML = "<div class=\"bq-nav-title\">View</div>\n"
            + " <div><input type=\"checkbox\" id=\"bq-view-svn\" checked>SVN</div>\n"
            + " <div><input type=\"checkbox\" id=\"bq-view-chat\" checked>Text</div>\n"
            + " <div><input type=\"checkbox\" id=\"bq-view-act\" checked>Activity</div>\n";

    document.getElementById("bq-view-svn").addEventListener("change",
            function(e) { setCommentView("svn",e.target.checked)} );
    document.getElementById("bq-view-chat").addEventListener("change",
            function(e) { setCommentView("chat",e.target.checked)} );
    document.getElementById("bq-view-act").addEventListener("change",
            function(e) { setCommentView("act",e.target.checked)} );

    // depend-on list
    var navDepend = document.createElement("div");
    navDepend.className = "bq-nav-dependon";
    navRoot.appendChild(navDepend);

    console.log(blockerTickets);
}

function main() {
    var commentRoot = document.getElementById("comments-history");
    //in a created ticket
    if ( commentRoot != null ) {
        // comments
        var cmts = commentRoot.getElementsByClassName("comments");
        for ( var i = 0 ; i < cmts.length ; i++ ) {
            comments.push(new Comment(cmts[i]));
        }

        // depend-on tickets
        var ls = document.getElementsByTagName("label");
        for ( var i = 0 ; i < ls.length ; i ++ ) {
            if ( ls[i].getAttribute("for") == "dependson" ) {
                var elDts = ls[i].parentNode.nextElementSibling.children;
                for ( var c = 0 ; c < elDts.length ; c ++ ) {
                    var elT = elDts[c], isc = false;
                    if ( elT.tagName == "SPAN" && elT.className == "bz_closed") {
                        isc = true;
                        elT = elT.children[0];
                    }

                    if ( elT.tagName == "A" ) {
                        var t = new Ticket( elT.innerText,
                                elT.getAttribute("title") );
                        t.setResolution(isc);
                        blockerTickets.push(t);
                    }
                    else {
                        console.log("Can't recognize blocker "+t);
                    }
                }
            }
        }

        // create navigation menu at left
        initTicketNav();
    }
}

main();
