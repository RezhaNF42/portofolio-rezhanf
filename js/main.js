document.addEventListener('DOMContentLoaded', () => {
    
    // --- SMOOTH SCROLL NAV ---
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if(targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // --- MUSIC TOGGLE (POJOK ATAS) ---
    const musicBtn = document.getElementById('music-toggle');
    let isPlaying = false;
    let audio = null;

    musicBtn.addEventListener('click', () => {
        if (!audio) {
            audio = new Audio('../music/bg-music.mp3');
            audio.loop = true;
            audio.volume = 0.5;
        }

        if (isPlaying) {
            audio.pause();
            musicBtn.innerHTML = '<i class="fas fa-music"></i>';
            musicBtn.style.backgroundColor = '#2ecc71';
            musicBtn.style.color = '#121212';
        } else {
            audio.play().catch(e => console.log("Audio gagal diputar."));
            musicBtn.innerHTML = '<i class="fas fa-pause"></i>';
            musicBtn.style.backgroundColor = '#ffffff';
            musicBtn.style.color = '#2ecc71';
        }
        isPlaying = !isPlaying;
    });

    // --- SCROLL ANIMATION ---
    const sections = document.querySelectorAll('section');
    const options = { threshold: 0.1 };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, options);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});
/* --- ANIMASI PARTIKEL BACKGROUND (GLOWING VERSION) --- */
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];

// Atur ukuran canvas sesuai layar
function setCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = document.getElementById('hero').offsetHeight;
}
setCanvasSize();
window.addEventListener('resize', setCanvasSize);

// Class Partikel
class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        // Tambahan properti untuk efek cahaya
        this.glowing = Math.random() > 0.5;
    }
    
    // Method menggambar partikel dengan efek GLOW
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        
        // --- EFEK GLOWING (Radial Gradient) ---
        // Buat gradasi dari warna solid ke transparan
        let gradient = ctx.createRadialGradient(
            this.x, this.y, 0, 
            this.x, this.y, this.size * 3 // Cahaya menyebar 3x lipat dari ukuran asli
        );
        
        if(this.glowing) {
            // Partikel yang lebih terang (Glowing terang)
            gradient.addColorStop(0, '#ffffff'); // Tengah: Putih terang
            gradient.addColorStop(0.2, this.color); 
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); // Ujung: Transparan
        } else {
            // Partikel biasa (agak lebih gelap untuk variasi)
            gradient.addColorStop(0, 'rgba(46, 204, 113, 0.8)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        }

        ctx.fillStyle = gradient;
        ctx.fill();
    }
    
    // Method update posisi partikel
    update() {
        if (this.x > canvas.width || this.x < 0) {
            this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
            this.directionY = -this.directionY;
        }
        
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
    }
}

// Buat partikel
function init() {
    particlesArray = [];
    // Kita tambahin jumlah partikelnya dikit biar makin ramai
    let numberOfParticles = (canvas.height * canvas.width) / 7000;
    if(numberOfParticles > 150) numberOfParticles = 150; // Maksimal 150 biar tetep ringan

    for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 4) + 1; // Ukuran 1px - 5px
        let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.5) - 0.25; // Gerak sedikit lebih cepat
        let directionY = (Math.random() * 0.5) - 0.25;
        
        // Warna dasar partikel: Hijau Zamrud Tua & Muda, dan Putih
        let colors = [
            'rgba(46, 204, 113, 0.8)', // Hijau zamrud cerah
            'rgba(39, 174, 96, 0.8)',  // Hijau zamrud gelap
            'rgba(255, 255, 255, 0.6)' // Putih
        ];
        let color = colors[Math.floor(Math.random() * colors.length)];
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
    }
}

// Loop Animasi
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, innerWidth, canvas.height);
    
    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
    }
}

init();
animate();

/* --- LOGIKA MODAL WELCOME & CHAT APRIL --- */

const welcomeModal = document.getElementById('welcome-modal');
const acceptBtn = document.getElementById('accept-guide');
const rejectBtn = document.getElementById('reject-guide');
const chatToggle = document.getElementById('chat-toggle');
const chatBox = document.getElementById('chat-box');
const closeChat = document.getElementById('close-chat');
const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-chat');

let isChatOpen = false;

// --- 1. LOGIKA TOMBOL MODAL (LANJUTKAN / TOLAK) ---

// Fungsi untuk menutup modal dengan efek perlahan
function closeModal() {
    welcomeModal.style.transition = 'opacity 0.5s ease, transform 0.5s ease'; // Animasi fade out
    welcomeModal.style.opacity = '0';
    welcomeModal.style.transform = 'scale(0.9)'; // Sedikit mengecil
    setTimeout(() => {
        welcomeModal.style.display = 'none'; // Hilang total setelah animasi selesai
    }, 500); // 500ms = 0.5 detik
}

// Jika klik "Lanjutkan"
acceptBtn.addEventListener('click', () => {
    closeModal();
    // Setelah modal hilang, kita buka chatbox & kasih sambutan
    setTimeout(() => {
        openChat();
        addMessage("Tch... Akhirnya mau juga. Baiklah, Tuan Rezha lagi sibuk, aku yang akan pandu kamu. Mau tanya apa?", "april");
    }, 600); // Muncul sedikit setelah modal hilang
});

// Jika klik "Tolak"
rejectBtn.addEventListener('click', () => {
    closeModal();
    // Tidak membuka chatbox, tapi kita kasih tau di console kalau user menolak
    console.log("User menolak bantuan April.");
    // (Opsional) Kamu bisa tambahin alert kecil kalau mau, tapi lebih profesional diam aja.
});

// --- 2. FUNGSI BUKA/TUTUP CHAT ---
function addMessage(text, sender) {
    const msgDiv = document.createElement('div');
    msgDiv.classList.add('msg', sender);
    msgDiv.textContent = text;
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight; 
}

function openChat() {
    chatBox.classList.remove('hidden');
    isChatOpen = true;
    chatInput.disabled = false;
    setTimeout(() => chatInput.focus(), 300);
}

function closeChatFunc() {
    chatBox.classList.add('hidden');
    isChatOpen = false;
    chatInput.disabled = true;
}

chatToggle.addEventListener('click', () => {
    if (isChatOpen) {
        closeChatFunc();
    } else {
        openChat();
        if (chatMessages.children.length === 0) {
            addMessage("Tuan Rezha lagi sibuk, titip pesan buat aku aja. Ada yang perlu aku bantu?", "april");
        }
    }
});

closeChat.addEventListener('click', closeChatFunc);

// --- 3. LOGIKA KIRIM PESAN (BOT APRIL) ---
sendBtn.addEventListener('click', handleSendMessage);
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSendMessage();
});

function handleSendMessage() {
    const text = chatInput.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    chatInput.value = "";

    setTimeout(() => {
        let reply = "";
        const lowerText = text.toLowerCase();

        if (lowerText.includes("portofolio") || lowerText.includes("hasil") || lowerText.includes("project")) {
            reply = "Hmm, portofolio Tuan Rezha ada di bagian atas. Scroll aja ke atas, atau klik menu 'Proyek'. Dia emang jago, meskipun kadang ngoding sampe lupa makan.";
        } 
        else if (lowerText.includes("jasa") || lowerText.includes("bayar") || lowerText.includes("harga") || lowerText.includes("topup")) {
            reply = "Tuan Rezha jual jasa design, akun game (FF/ML), topup diamond, dan server VPS. Kalau mau tanya harga detail, mending langsung chat ke kontak WA di bawah aja. Urusan duit mah urusan dia, aku cuma jagain website ini.";
        }
        else if (lowerText.includes("halo") || lowerText.includes("hai") || lowerText.includes("hi") || lowerText.includes("assalamualaikum")) {
            reply = "Halo juga. Udah liat-liat belum? Kalau belum, mending liat dulu projectnya, jangan cuma buang-buang waktu ngobrol sama aku.";
        }
        else if (lowerText.includes("tuan") || lowerText.includes("rezha") || lowerText.includes("mas")) {
            reply = "Tch... Dasar. Iya, Rezha itu Tuanku. Dia yang nyelamatin hidupku, jadi aku bakal lindungi dia dan semua karyanya. Kamu jangan macam-macam sama dia ya.";
        }
        else if (lowerText.includes("april") || lowerText.includes("kamu")) {
            reply = "Iya, aku April. Mantan assassin, sekarang pelayan setia Tuan Rezha. Jangan coba-coba hack website ini, aku bisa lacak IP kamu.";
        }
        else {
            reply = "Mmm... Aku kurang paham maksud kamu. Tapi kalau ada yang mau ditanyain tentang website ini atau jasa Tuan Rezha, bilang aja. Atau klik-klik aja menu di atas.";
        }

        addMessage(reply, "april");
    }, 1000); 
}