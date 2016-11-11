(function(){
    const path  = require("path");
    const async = require("async");
    const fs    = require("fs");
    var parser  = require('episode-parser');

    function find(folder, exts, callback) {
        fs.readdir(folder, (err, files) => {
            if (err) {
                callback(err, null);
            } else {
                if (files && files.length > 0) {
                    files = files.filter(f => exts.indexOf(path.parse(f).ext) >= 0 );
                    files = files.map(f => path.join(folder, f));
                }
                callback(null, files);
            }
        });
    }

    module.exports.getVideoWithoutSRT = function(folder, callback) {
        find(folder, [".avi", ".mkv", ".mp4"], (err, files) => {
            async.map(files, (f, cb) => {
                var o = path.parse(f);
                o.ext = ".srt";
                delete o.base;
                f = path.format(o);

                fs.access(f, (err) => {
                    cb(null, { file: f.replace('\\', '/'), exists: !err });
                });
            }, (err, results) => {
                var filesToFind = [], filesToIgnore = [];
                results.map(elt => { 
                    if (elt.exists) { filesToIgnore.push(elt.file); } 
                    else { filesToFind.push(elt.file); } 
                });
                callback(filesToFind, filesToIgnore);
            });
        });
    }

    module.exports.findSrt = function(video, ignore, callback) {
        var o = path.parse(video);
        var ep = parser(o.base.replace("'", ""));

        find(o.dir, [".srt"], (err, files) => {
            if (files && files.length > 0) {
                var potentials = files.filter((elt) => { return ignore.indexOf(elt) < 0 });
                potentials.forEach(elt => {
                    var pObj = path.parse(elt);
                    var srt = parser(pObj.base.replace("'", ""));
                    if (srt && ep.show.toLowerCase() == srt.show.toLowerCase() && ep.season == srt.season && ep.episode == srt.episode) {
                        return callback({
                            dir: o.dir,
                            from: pObj.base,
                            to: o.base,
                            selected: true
                        });
                    }
                });
            }
            callback(null);
        });
    }

}());