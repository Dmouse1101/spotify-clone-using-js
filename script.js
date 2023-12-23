// declaring all the references 
let index = 1;
let audioele = new Audio();
const playpause = document.getElementById('playpause');
const progressbar = document.getElementById('progressBar');
const gif = document.querySelector('.songinfo img');
const song_list = document.querySelector('.songList');
const songplay = document.getElementsByClassName('songplaypause');
const songinfo = document.getElementsByClassName('songinfo');
const songName = document.getElementById('songName');

// creating a array of object for songs
let songs = [
    { songname: "it's always Blue", coverPath: 'covers/1.jpg', filePath: 'songs/1.mp3' },
    { songname: "Cielo - Huma-Huma", coverPath: 'covers/2.jpg', filePath: 'songs/2.mp3' },
    { songname: "DEAF KEV - Invincible", coverPath: 'covers/3.jpg', filePath: 'songs/3.mp3' },
    { songname: "Different Heaen & EH!DE", coverPath: 'covers/4.jpg', filePath: 'songs/4.mp3' },
    { songname: "Janji-Heroes-Tonight", coverPath: 'covers/5.jpg', filePath: 'songs/5.mp3' },
    { songname: "Rabba - Salam-e-Ishq", coverPath: 'covers/6.jpg', filePath: 'songs/6.mp3' },
    { songname: "Sakhiyaan - Salam-e-Ishq", coverPath: 'covers/7.jpg', filePath: 'songs/7.mp3' }
]

// creating element for songs array dynamically 
for (let i in songs) {
    const song_item = document.createElement('div');
    song_item.classList.add('songItem');
    song_list.appendChild(song_item);
    const inserthtml = `
            <img src="${songs[i].coverPath}" alt="${i}">
            <span>${songs[i].songname}</span>
            <span class="spanplay"><span></span><i class="fa fa-play-circle-o songplaypause"></i></span>
            `;
    song_item.insertAdjacentHTML('afterbegin', inserthtml);
}


// declare a function for changing play pause and updating animation
playpause.addEventListener('click', () => {
    if (audioele.paused || audioele.currentTime <= 0) {
        audioele.src = `songs/${index}.mp3`;
        audioele.currentTime = 0;
        audioele.play();
        namechanger(index);
        playpause.classList.remove('fa-play-circle-o');
        playpause.classList.add('fa-pause-circle-o');
        gif.style.opacity = 1;
    }
    else {
        audioele.pause();
        playpause.classList.add('fa-play-circle-o');
        playpause.classList.remove('fa-pause-circle-o');
        gif.style.opacity = 0;
    }
})

// incrementing progressbar using timeupdate event.
audioele.addEventListener('timeupdate', () => {
    const progress = parseInt(audioele.currentTime / audioele.duration * 100)
    progressbar.value = progress;
})

// controling music through progressbar using change event.
progressbar.addEventListener('change', () => {
    audioele.currentTime = (progressbar.value * audioele.duration / 100);
})

// function to change the logo of songplay to manually play a song
const controls = () => {
    Array.from(songplay).forEach((ele) => {
        ele.classList.add('fa-play-circle-o')
        ele.classList.remove('fa-pause-circle-o')
    })
}
// function to update song name when song change
const namechanger = (inx) => {
    songName.innerHTML = songs[inx - 1].songname;
}


let j = 1;
Array.from(songplay).forEach(ele => {
    // use to set id in songplay class
    ele.setAttribute('id', j);
    j += 1;
    ele.addEventListener('click', (e) => {
        // condition to check for pause icon, audio is playing or not .
        if(ele.classList.contains('fa-pause-circle-o') && !audioele.paused) {
            controls();
            audioele.pause();
            gif.style.opacity = 0;
            playpause.classList.add('fa-play-circle-o')
            playpause.classList.remove('fa-pause-circle-o')
        }
        else {
            controls();
            // convert into int because id is in string
            index = parseInt(e.target.id);
            ele.classList.add('fa-pause-circle-o')
            ele.classList.remove('fa-play-circle-o')
            audioele.src = `songs/${index}.mp3`;
            audioele.currentTime = 0;
            audioele.play();
            namechanger(index);
            gif.style.opacity = 1;
            playpause.classList.add('fa-pause-circle-o')
            playpause.classList.remove('fa-play-circle-o')
        }
    })
})

// conditon of click event for next functionality
document.getElementById('next').addEventListener('click', () => {
    if (index >= songs.length) {
        index = 1;
    }
    else if (index >= 1 && index < songs.length) {
        index = index + 1;
    }
    audioele.src = `songs/${index}.mp3`;
    audioele.currentTime = 0;
    audioele.play();
    namechanger(index);
    gif.style.opacity = 1;
    playpause.classList.add('fa-pause-circle-o')
    playpause.classList.remove('fa-play-circle-o')
})

// conditon of click event for previous functionality
document.getElementById('previous').addEventListener('click', () => {
    if (index <= 1) {
        index = songs.length;
    }
    else if (index <= 7 && index > 1) {
        index -= 1;
    }
    audioele.src = `songs/${index}.mp3`;
    audioele.currentTime = 0;
    audioele.play();
    namechanger(index);
    gif.style.opacity = 1;
    playpause.classList.add('fa-pause-circle-o')
    playpause.classList.remove('fa-play-circle-o')
})