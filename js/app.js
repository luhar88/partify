
//'use strict';

var app = angular.module('partify', ['ngRoute', 'firebase']);

app.constant('FIREBASE_URL', 'https://partify.firebaseio.com/');

app.config(['$routeProvider',
    function ($routeProvider) {
   $routeProvider
       .when('/playlist', {
       templateUrl: 'views/playlist.html',
       controller: 'PartifyMain'
       })
       .otherwise({
           redirectTo: '/playlist'
       });
}]);

app.controller('PartifyMain', function (partifyService) {
    var main = this;

    main.newSong = {
        songName: '',
        songUrl: 'https://',
        score: 0
    };

    main.songs = partifyService.getSongs();


    main.addSong = function () {
        //song = {
        //    songName: newSong.songName,
        //    songUrl: newSong.songUrl,
        //    score: '0'
        //};

        partifyService.addSong(main.newSong);
        main.newSong = {
            songName: '',
            songUrl: 'https://',
            score: 0
        };
    };

    main.removeSong = function (song) {
        partifyService.removeSong(song);
    };

    main.upVoteSong = function (song) {
        var new_score = song.score + 1;
        song.score = new_score;
        console.log(song);
        partifyService.updateSong(song);
    };

    main.downVoteSong = function (song) {
        var new_score = song.score - 1;
        song.score = new_score;
        console.log(song);
        partifyService.updateSong(song);
    };

});



app.service('partifyService', function (FIREBASE_URL, $firebaseArray) {
    var partifyService = this;

    var ref = new Firebase(FIREBASE_URL);
    var songs = $firebaseArray(ref);

    partifyService.getSongs = function () {
        return songs;
    };

    partifyService.addSong = function (newSong) {
        songs.$add(newSong);
    };

    partifyService.updateSong = function (updatedSong) {
        songs.$save(updatedSong);

    };

    partifyService.removeSong = function (songToDelete) {
        songs.$remove(songToDelete);
    };

});