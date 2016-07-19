(function() {
    const path  = require("path");
    const fs    = require("fs");

    const { shell, remote } = require('electron');
    const dialog = remote.dialog;

    const episodes = require("./scripts/episodes.js");

    var app = angular.module('myApp');
  
    app.controller('homeCtrl', ['$http', "$scope",
        function ($http, $scope) {
            var vm = this;
            vm.arrToRename = [];

            vm.openDir = () => {
                var folder = localStorage.getItem("folder") || process.cwd();
                shell.openExternal(folder);
            }

            vm.chooseDir = () => {
                dialog.showOpenDialog({properties: ['openDirectory']}, (dir) => {
                    if (dir != undefined) {
                        $scope.$apply(() => {
                            var folder = dir[0];
                            localStorage.setItem("folder", folder);
                            updateRenameList();
                        });
                    }
                });
            }

            vm.refresh = updateRenameList;

            vm.onSelect = (elt) => {
                elt.selected = !elt.selected;
            };

            vm.rename = () => {
                var newarray = [];
                vm.arrToRename.forEach(elt => {
                    if (elt.selected) {
                        var from = path.resolve(elt.dir, elt.from);
                        var to = path.resolve(elt.dir, elt.to);
                        try {
                            fs.renameSync(from, to);
                        } catch (err) {
                            console.log(err);
                            newarray.push(elt);
                        }
                    } else {
                        newarray.push(elt);
                    }
                });
                vm.arrToRename = newarray;
            };

            // get video without subtitles
            function findCorrectSRT(filesToFind, filesToIgnore) {
                vm.arrToRename = [];
                filesToFind.forEach(function(element) {
                    episodes.findSrt(element, filesToIgnore, (srt) => {
                        if (srt != null) {
                            $scope.$apply(() => { vm.arrToRename.push(srt) });
                        }
                    });
                }, this);
            }

            function updateRenameList() {
                // display current folder
                var folder = localStorage.getItem("folder");
                if (!folder) folder = process.cwd();
                console.log("Folder: " + folder);
                vm.folder = folder;
                
                // get all videos and check if there is a subtitle already
                episodes.getVideoWithoutSRT(folder, findCorrectSRT);
            }

            updateRenameList();
        }
    ]);

}());