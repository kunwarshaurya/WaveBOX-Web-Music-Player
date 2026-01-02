document.addEventListener('DOMContentLoaded', () => {
    // Song_obj
    const songs = [
        {
            title: 'Top 50 - Global',
            artist: 'Your Daily Update',
            cover: './projectSpotify/assets/card1img.jpeg',
            file: 'https://cdn.pixabay.com/audio/2022/11/23/audio_725552a2b6.mp3'
        },
        {
            title: 'Mahiye Jinna Sohna',
            artist: 'Darshan Raval',
            cover: './projectSpotify/assets/card2img.jpeg',
            file: './projectSpotify/music_assets/song1.mp3'
        },
        {
            title: 'Naa Ready',
            artist: 'Anirudh Ravichander, Vijay',
            cover: './projectSpotify/assets/card4img.jpeg',
            file: './projectSpotify/music_assets/song2.mp3'
        },
        {
            title: 'Mere Paas Tum Ho',
            artist: 'Rahat Fateh Ali Khan',
            cover: './projectSpotify/assets/card3img.jpeg',
            file: './projectSpotify/music_assets/song3.mp3'
        },
        {
            title: 'Naah(Lofi)',
            artist: 'Jass ManaK',
            cover: './projectSpotify/assets/naahlofi.jpeg',
            file: './projectSpotify/music_assets/song4.mp3'
        },
        {
            title: 'Barbaadiyan',
            artist: 'Sachin-Jigar',
            cover: './projectSpotify/assets/barbadiyan.jpg',
            file: './projectSpotify/music_assets/song5.mp3'
        }
        ,
        {
            title: 'Ek Mai Aur Ek Tu',
            artist: 'Maruti Rao, RD Burman, Asha Bhosle, Kishore Kumar, Gulshan Bawra',
            cover: './projectSpotify/assets/emaet.jpg',
            file: './projectSpotify/music_assets/song6.mp3'
        },
        {
            title: 'Tune Maari Entriyaan',
            artist: 'KK, Vishal Dadlani, Sohail Sen, Irshad Kamil',
            cover: './projectSpotify/assets/tme.jpg',
            file: './projectSpotify/music_assets/song7.mp3'
        },
        {
            title: 'Dola Re Dola',
            artist: 'Kavita Krishnamurthy, Shreya Ghoshal, KK',
            cover: './projectSpotify/assets/dedas.jpg',
            file: './projectSpotify/music_assets/song8.mp3'
        }
    ];
    
    // Current_State
    let currentSongIndex = 0;
    let isPlaying = false;
    let isShuffle = false;
    let isRepeat = false;
    
    //dom
    const audio = document.getElementById('audio-source');
    const albumCoverImg = document.querySelector('.album-cover-img');
    const songTitle = document.querySelector('.song-title');
    const songArtist = document.querySelector('.song-artist');
    
    // Player Controls
    const shuffleBtn = document.getElementById('shuffle-btn');
    const prevBtn = document.getElementById('prev-btn');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');

    // Muisc Bar
    const progressBar = document.querySelector('.progress-bar');
    const currentTimeEl = document.querySelector('.curr-time');
    const totalTimeEl = document.querySelector('.tot-time');
    
    // Volume
    const volumeBar = document.querySelector('.volume-bar');
    const volumeIcon = document.getElementById('volume-icon');

    // Interactive Content
    const cardContainer = document.querySelector('.card-container');
    const playlistContainer = document.getElementById('playlist-container');
    
    //working fn

    // Generate Playlist in the Library
    function generatePlaylist() {
        playlistContainer.innerHTML = ''; // Clear existing playlist
        songs.forEach((song, index) => {
            const item = document.createElement('div');
            item.classList.add('playlist-item');
            item.dataset.index = index; // Add index to link to the song
            
            item.innerHTML = `
                <img src="${song.cover}" alt="${song.title} cover">
                <div class="playlist-song-info">
                    <p class="title">${song.title}</p>
                    <p class="artist">${song.artist}</p>
                </div>
            `;
            playlistContainer.appendChild(item); // songs has been added
        });
    }

    function loadSong(song) {
        songTitle.textContent = song.title;
        songArtist.textContent = song.artist;
        albumCoverImg.src = song.cover;
        audio.src = song.file;
        
        // Highlight the active song in the playlist
        document.querySelectorAll('.playlist-item').forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.index) === currentSongIndex) {
                item.classList.add('active');
            }
        });
    }

    function playSong() {
        isPlaying = true;
        audio.play();
        playPauseBtn.src = './projectSpotify/assets/pause.png'; // Pause Icon (malfunctioning currently)
        playPauseBtn.style.height = '1.5rem';
    }
    
    function pauseSong() {
        isPlaying = false;
        audio.pause();
        playPauseBtn.src = './projectSpotify/assets/player_icon3.png';
        playPauseBtn.style.height = '2rem';
    }
    
    function playSongByIndex(index) {
        currentSongIndex = index;
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function prevSong() {
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
        loadSong(songs[currentSongIndex]);
        playSong();
    }
//Shuffle is malfunctioning
    function nextSong() {
        if (isShuffle) {
            let randomIndex;
            do {
                randomIndex = Math.floor(Math.random() * songs.length);
            } while (randomIndex === currentSongIndex); // Avoid playing the same song twice
            currentSongIndex = randomIndex;
        } else {
            currentSongIndex = (currentSongIndex + 1) % songs.length;
        }
        loadSong(songs[currentSongIndex]);
        playSong();
    }

    function updateProgress() {
        const { duration, currentTime } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progressBar.value = progressPercent;
            totalTimeEl.textContent = formatTime(duration);
        }
        currentTimeEl.textContent = formatTime(currentTime);
    }
    // cureent song progress path track
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function setVolume() {
        audio.volume = volumeBar.value / 100;
        if (audio.volume === 0) {
            volumeIcon.className = 'fa-solid fa-volume-off';
        } else if (audio.volume < 0.5) {
            volumeIcon.className = 'fa-solid fa-volume-low';
        } else {
            volumeIcon.className = 'fa-solid fa-volume-high';
        }
    }

    function handleSongEnd() {
        if (isRepeat) {
            playSong(); // Replay the current song(malfunctioning currently )
        } else {
            nextSong();
        }
    }

    //EVENT LISTENERS
    
    playPauseBtn.addEventListener('click', () => isPlaying ? pauseSong() : playSong());
    prevBtn.addEventListener('click', prevSong);
    nextBtn.addEventListener('click', nextSong);
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });
    repeatBtn.addEventListener('click', () => {
        isRepeat = !isRepeat;
        repeatBtn.classList.toggle('active', isRepeat);
    });

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', () => totalTimeEl.textContent = formatTime(audio.duration));
    audio.addEventListener('ended', handleSongEnd);

    progressBar.addEventListener('input', (e) => {
        if (audio.duration) {
             audio.currentTime = (e.target.value / 100) * audio.duration;
        }
    });

    volumeBar.addEventListener('input', setVolume);

    // Event Delegation for clicking on song cards and playlist items
    cardContainer.addEventListener('click', e => {
        const card = e.target.closest('.card');
        if (card) {
            playSongByIndex(parseInt(card.dataset.index));
        }
    });

    playlistContainer.addEventListener('click', e => {
        const item = e.target.closest('.playlist-item');
        if (item) {
            playSongByIndex(parseInt(item.dataset.index));
        }
    });
    
    // INITIALIZATION
    generatePlaylist();
    loadSong(songs[currentSongIndex]);
    setVolume(); // Set initial volume icon
});