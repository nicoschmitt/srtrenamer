(function(){
    const glob  = require("glob");
    const path  = require("path");
    const async = require("async");
    const fs    = require("fs");
    var parser  = require('episode-parser')

    module.exports.getVideoWithoutSRT = function(folder, callback) {
        glob(folder + "/{*.avi,*.mkv}", (err, files) => {
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
        var ep = parser(o.base);
        
        glob(o.dir + "/*.srt", (err, files) => {
            var potentials = files.filter((elt) => { return ignore.indexOf(elt) < 0 });
            potentials.forEach(elt => {
                var pObj = path.parse(elt);
                var srt = parser(pObj.base);
                console.log(ep);
                console.log(srt);
                if (ep.show.toLowerCase() == srt.show.toLowerCase() && ep.season == srt.season && ep.episode == srt.episode) {
                    return callback({
                        dir: o.dir,
                        from: pObj.base,
                        to: o.base,
                        selected: true
                    });
                } else {
                    return callback(null);
                }
            });
        });

        return null;
    }

}());