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
const volume = document.getElementById('volume');
const progressmeter = document.getElementById('progress_meter');


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

const loadsongs = (path) => {
    return new Promise((resolve) => {
        const tempAudio = new Audio();
        tempAudio.src = path;
        tempAudio.addEventListener('loadedmetadata', () => {
            resolve(tempAudio);
        });
    });
};

// returning an array of promises of loadedsongs in audioPromises variavble
const audioPromises = songs.map(song => loadsongs(song.filePath))

// run the entire list of array and then call for seperate audioElement
Promise.all(audioPromises).then((audioElement) => {
    // creating element for songs array dynamically 
    for (let i in songs) {
        const song_item = document.createElement('div');
        song_item.classList.add('songItem');
        song_list.appendChild(song_item);
        const inserthtml = `
            <img src="${songs[i].coverPath}" alt="${i + 1}">
            <span>${songs[i].songname}</span>
            <span class="spanplay"><span>${formatTime(audioElement[i].duration)}</span><i class="fa fa-play-circle-o songplaypause"></i></span>
        `;
        song_item.insertAdjacentHTML('afterbegin', inserthtml);
    };
    songplaypause(audioElement);
});

// declare a function for changing play pause and updating animation
playpause.addEventListener('click', () => {
    if (audioele.paused && audioele.currentTime <= 0) {
        audioele.src = songs[index - 1].filePath;
        audioele.currentTime = 0;
        audioele.play();
        namechanger(index);
        songitems_play(index);
        playpause.classList.remove('fa-play-circle-o');
        playpause.classList.add('fa-pause-circle-o');
        gif.style.opacity = 1;
    }
    else if (audioele.paused && audioele.currentTime != 0) {
        audioele.play();
        namechanger(index);
        songitems_play(index);
        playpause.classList.remove('fa-play-circle-o');
        playpause.classList.add('fa-pause-circle-o');
        gif.style.opacity = 1;
    }
    else {
        audioele.pause();
        playpause.classList.add('fa-play-circle-o');
        playpause.classList.remove('fa-pause-circle-o');
        gif.style.opacity = 0;
        songitems_pause();
    }
})


const progressBarUpdating = () => {
    // incrementing progressbar using timeupdate event and performing checking tasks.
    audioele.addEventListener('timeupdate', () => {
        let progress = parseFloat(audioele.currentTime / audioele.duration * 100);
        progressmeter.style.width = progress + "%";
        document.getElementById('current-time').textContent = formatTime(audioele.currentTime);
        document.getElementById('duration').textContent = formatTime(audioele.duration);
        if (audioele.ended && index < songs.length) {
            index += 1;
            audioele.src = songs[index - 1].filePath;
            audioele.play();
            namechanger(index);
            songitems_play(index);
        }
        if (audioele.ended) {
            index = songs.length;
            playpause.classList.add("fa-play-circle-o")
            playpause.classList.remove("fa-pause-circle-o")
            gif.style.opacity = 0;
            songitems_pause();
        }
    })
}
progressBarUpdating()

// changing music time through progressbar using click event.
progressbar.addEventListener('click', (e) => {
    let progressbarWidth = progressbar.getBoundingClientRect().width;
    let clientPosition = e.clientX - progressbar.offsetLeft;
    let percentage = clientPosition / progressbarWidth * 100;
    progressmeter.style.width = percentage + "%";
    audioele.currentTime = audioele.duration * (percentage / 100);
})


// volume
volume.addEventListener('click', () => {
    audioele.volume = volume.value / 100
})
volume.addEventListener('mousemove', () => {
    audioele.volume = volume.value / 100
})


// function to change the icon of songplay class while playing a song
const songitems_pause = () => {
    Array.from(songplay).forEach((ele) => {
        if (ele.classList.contains('fa-pause-circle-o')) {
            ele.classList.add('fa-play-circle-o')
            ele.classList.remove('fa-pause-circle-o')
        }
    })
}

// to convert duration into min,secs format
function formatTime(timeInSeconds) {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(1, '0')}:${String(seconds).padStart(2, '0')}`;
}

// function to change icon of  play symbol to pause when song is playing for specific song  
const songitems_play = (inx) => {
    songitems_pause();
    let a = Array.from(songplay)[inx - 1]
    if (a.classList.contains('fa-play-circle-o')) {
        a.classList.add('fa-pause-circle-o')
        a.classList.remove('fa-play-circle-o')
    }
}


//  to update song name when song change
const namechanger = (inx) => {
    songName.innerHTML = songs[inx - 1].songname;
}
namechanger(index);


// calling songs when their button is clicked
const songplaypause = aud => {
    let j = 1;
    Array.from(songplay).forEach(ele => {
        // use to set id in songplay class
        ele.setAttribute('id', j);
        j += 1;
        ele.addEventListener('click', (e) => {
            // condition to check for pause icon, audio is playing or not .
            audioele.pause()
            if (ele.classList.contains('fa-pause-circle-o') && audioele.played) {
                songitems_pause();
                audioele.pause();
                progressBarUpdating()
                gif.style.opacity = 0;
                playpause.classList.add('fa-play-circle-o')
                playpause.classList.remove('fa-pause-circle-o')
            }
            else {
                songitems_pause();
                // convert into int because id is in string
                index = parseInt(e.target.id);
                ele.classList.add('fa-pause-circle-o')
                ele.classList.remove('fa-play-circle-o')
                audioele = aud[index - 1];
                audioele.currentTime = 0;
                audioele.play();
                namechanger(index);
                progressBarUpdating()
                gif.style.opacity = 1;
                playpause.classList.add('fa-pause-circle-o')
                playpause.classList.remove('fa-play-circle-o')
            }
        })
    })
}

// conditon of click event for next functionality
document.getElementById('next').addEventListener('click', () => {
    if (index >= songs.length) {
        index = 1;
    }
    else if (index >= 1 && index < songs.length) {
        index = index + 1;
    }
    audioele.src = songs[index - 1].filePath;
    audioele.currentTime = 0;
    audioele.play();
    namechanger(index);
    songitems_play(index);
    gif.style.opacity = 1;
    playpause.classList.add('fa-pause-circle-o')
    playpause.classList.remove('fa-play-circle-o')
})


// conditon of click event for previous functionality
document.getElementById('previous').addEventListener('click', () => {
    if (index <= 1) {
        index = songs.length;
    }
    else if (index <= songs.length && index > 1) {
        index -= 1;
    }
    audioele.src = songs[index - 1].filePath;
    audioele.currentTime = 0;
    audioele.play();
    namechanger(index);
    songitems_play(index);
    gif.style.opacity = 1;
    playpause.classList.add('fa-pause-circle-o')
    playpause.classList.remove('fa-play-circle-o')
})