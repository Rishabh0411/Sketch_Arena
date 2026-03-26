Given below are the Drawing page, landing page and the lobby page(team view and individual view). All the bellow code is in HTML make sure you convert this into proper React code whi;e making the changes 

#DRAWING PAGE

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Skribbl Atelier - Game Room #402</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&amp;family=Be+Vietnam+Pro:wght@400;500;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#6eed53",
              "on-tertiary-container": "#564600",
              "error": "#ffb4ab",
              "tertiary-fixed": "#ffe175",
              "on-secondary-fixed": "#001b40",
              "on-secondary": "#002f66",
              "inverse-on-surface": "#002b75",
              "on-secondary-fixed-variant": "#004590",
              "background": "#001038",
              "surface-container-low": "#001849",
              "secondary-fixed": "#d7e2ff",
              "surface-variant": "#002f7e",
              "tertiary": "#f4d041",
              "on-error-container": "#ffdad6",
              "error-container": "#93000a",
              "surface-container-highest": "#002f7e",
              "on-error": "#690005",
              "inverse-primary": "#0e6e00",
              "secondary-fixed-dim": "#acc7ff",
              "on-surface": "#dae1ff",
              "on-tertiary": "#3b2f00",
              "on-tertiary-fixed": "#221b00",
              "outline-variant": "#3e4a39",
              "surface-tint": "#62e148",
              "on-primary-fixed": "#022200",
              "outline": "#879580",
              "on-tertiary-fixed-variant": "#554500",
              "on-primary-container": "#095400",
              "on-secondary-container": "#e6ecff",
              "surface-dim": "#001038",
              "surface-bright": "#053385",
              "tertiary-container": "#d6b424",
              "secondary": "#acc7ff",
              "surface-container-high": "#002567",
              "primary-container": "#51d039",
              "primary-fixed-dim": "#62e148",
              "primary-fixed": "#7efe62",
              "on-primary": "#043900",
              "surface-container": "#001c51",
              "surface-container-lowest": "#000c2d",
              "inverse-surface": "#dae1ff",
              "surface": "#001038",
              "on-background": "#dae1ff",
              "tertiary-fixed-dim": "#e7c435",
              "secondary-container": "#0068d4",
              "on-primary-fixed-variant": "#085300",
              "on-surface-variant": "#bdcbb4"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Space Grotesk"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .canvas-shadow {
            box-shadow: inset 0px 4px 20px rgba(0, 0, 0, 0.4);
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #002f7e;
            border-radius: 10px;
        }
    </style>
</head>
<body class="bg-background text-on-background font-body overflow-hidden">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-[#001038] flex justify-between items-center w-full px-6 py-4 max-w-full">
<div class="flex items-center gap-8">
<h1 class="font-headline text-2xl font-black text-[#6eed53] tracking-tighter italic">Skribbl Atelier</h1>
<nav class="hidden md:flex gap-6">
<a class="font-headline font-bold tracking-tight text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">How to Play</a>
<a class="font-headline font-bold tracking-tight text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">Gallery</a>
<a class="font-headline font-bold tracking-tight text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">Shop</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="px-4 py-2 font-headline font-bold text-on-primary bg-primary rounded-xl scale-95 duration-150 active:opacity-80">Create Room</button>
<button class="px-4 py-2 font-headline font-bold text-on-secondary-container bg-secondary-container rounded-xl scale-95 duration-150 active:opacity-80">Join Game</button>
<div class="flex gap-2 ml-2">
<span class="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">settings</span>
<span class="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">help</span>
</div>
</div>
</header>
<div class="flex h-screen pt-20">
<!-- SideNavBar (Left) -->
<aside class="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#001038]/60 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
<div class="mb-8 px-2">
<div class="flex items-center gap-3 mb-1">
<div class="w-10 h-10 rounded-full bg-surface-container-high border border-outline/20 flex items-center justify-center overflow-hidden">
<img alt="Room Icon" class="w-full h-full object-cover" data-alt="Stylized game controller icon with vibrant colors in a minimalist flat vector style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAinLyp3eFGFMsr0mU8ta3HzU4TCV0sR3N3pu81RH-Ln6EtQPlZK8t0wTgb_CcKDlEuG8Fyd8zZXLQ0HrtJLszB00Mj2f-eDdwSvNt6EzGetTBUDufUazwnd4PNDl2qM5itdoeEt4vftxbphDtcWG3tQhHo-8gWEcUuhI8X9xvmDYuWa4BbA-XhXhZij6S7-lqmMdap9PYRlNNn87i5xIU6dhCxbUcVnMFDlL-vKjxnzd8mKZyk7sSETrbLipoQaV5Z4i8nXLYJuDY"/>
</div>
<div>
<h2 class="text-lg font-bold text-[#acc7ff] font-headline">Room #402</h2>
<p class="text-xs text-secondary/70 font-label">Round 2 of 3</p>
</div>
</div>
</div>
<nav class="flex-1 flex flex-col gap-2">
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-label">Lobby</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#6eed53] font-bold border-r-4 border-[#6eed53] bg-white/5 translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">group</span>
<span class="font-label">Players</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">chat</span>
<span class="font-label">Chat</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">brush</span>
<span class="font-label">Tools</span>
</a>
</nav>
<div class="mt-auto flex flex-col gap-2 border-t border-outline/10 pt-6">
<button class="w-full py-3 px-4 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary/20 transition-all mb-4 font-headline text-sm">Invite Friends</button>
<a class="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-label text-sm">Settings</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-error/80 hover:text-error transition-all" href="#">
<span class="material-symbols-outlined">logout</span>
<span class="font-label text-sm">Leave</span>
</a>
</div>
</aside>
<!-- Main Content Area -->
<main class="ml-64 mr-80 flex-1 flex flex-col p-6 gap-6 overflow-y-auto custom-scrollbar">
<!-- Game Header (Word Bar) -->
<div class="bg-surface-container-low rounded-full px-8 py-4 flex items-center justify-between shadow-lg">
<div class="flex items-center gap-4">
<div class="bg-tertiary-container text-on-tertiary-container font-label font-bold px-3 py-1 rounded-lg text-sm">
                        0:54
                    </div>
</div>
<div class="flex gap-4">
<!-- Word Blanks -->
<div class="flex gap-2">
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
<span class="font-headline text-2xl font-black text-primary mx-1">P</span>
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
<span class="w-6 h-1 bg-on-surface/40 self-end mb-1"></span>
</div>
</div>
<div class="flex items-center gap-3">
<span class="font-label text-xs text-secondary/60 uppercase tracking-widest">Drawing:</span>
<div class="flex items-center gap-2">
<span class="text-sm font-bold text-on-surface">ArtVandelay</span>
<div class="w-6 h-6 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center">
<span class="material-symbols-outlined text-[14px] text-primary" style="font-variation-settings: 'FILL' 1;">brush</span>
</div>
</div>
</div>
</div>
<!-- Canvas Section -->
<div class="relative flex-1 bg-white rounded-3xl canvas-shadow overflow-hidden group">
<!-- Drawing Canvas Mockup -->
<div class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
<span class="material-symbols-outlined text-[200px]">edit_square</span>
</div>
<!-- Drawing Content (Visual Mock) -->
<svg class="absolute inset-0 w-full h-full" viewbox="0 0 800 600">
<path d="M100,100 Q250,50 400,100 T700,100" fill="none" stroke="#001038" stroke-linecap="round" stroke-width="8"></path>
<circle cx="200" cy="200" fill="#acc7ff" opacity="0.6" r="40"></circle>
<path d="M500,400 L550,450 L600,400 Z" fill="#6eed53"></path>
</svg>
<!-- Floating Toolbar -->
<div class="absolute bottom-6 left-1/2 -translate-x-1/2 bg-surface-container-highest/60 backdrop-blur-xl p-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/5 transition-transform group-hover:scale-105">
<!-- Brush Sizes -->
<div class="flex items-center gap-3 border-r border-white/10 pr-6">
<button class="w-4 h-4 rounded-full bg-on-surface/20 hover:bg-on-surface/40 transition-colors"></button>
<button class="w-6 h-6 rounded-full bg-on-surface/20 hover:bg-on-surface/40 transition-colors"></button>
<button class="w-8 h-8 rounded-full bg-primary ring-4 ring-primary/20 transition-all"></button>
<button class="w-10 h-10 rounded-full bg-on-surface/20 hover:bg-on-surface/40 transition-colors"></button>
</div>
<!-- Colors -->
<div class="flex items-center gap-2">
<div class="w-8 h-8 rounded-full bg-[#000000] cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#FFFFFF] border border-outline/20 cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#FF0000] cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#6eed53] ring-4 ring-primary/30 cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#0068d4] cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#f4d041] cursor-pointer hover:scale-110 transition-transform"></div>
<div class="w-8 h-8 rounded-full bg-[#93000a] cursor-pointer hover:scale-110 transition-transform"></div>
<div class="relative w-8 h-8 rounded-full bg-gradient-to-tr from-primary via-tertiary to-error cursor-pointer hover:scale-110 transition-transform overflow-hidden">
<span class="material-symbols-outlined absolute inset-0 flex items-center justify-center text-[18px] text-white">colorize</span>
</div>
</div>
<!-- Actions -->
<div class="flex items-center gap-3 border-l border-white/10 pl-6">
<button class="p-2 hover:bg-white/10 rounded-full transition-colors">
<span class="material-symbols-outlined text-secondary">undo</span>
</button>
<button class="p-2 hover:bg-white/10 rounded-full transition-colors">
<span class="material-symbols-outlined text-secondary">delete</span>
</button>
</div>
</div>
</div>
<!-- Bento Info Row -->
<div class="grid grid-cols-3 gap-4 h-32">
<div class="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between border-l-4 border-primary">
<span class="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Next Turn</span>
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full overflow-hidden bg-surface-container">
<img alt="Felix Avatar" class="w-full h-full" data-alt="Minimalist avatar of a person with stylish glasses and a smile in flat vector illustration style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAH3PQnLtsUi3_HrnCn24s21o34P1_HZz_w82bdRD-wrDW5mGfWyH87Z6T57cO-D0QZs9LBLiEg2rLjnQ4WJq7eKV_zKq0tXk_jQH42yaa6yP2MuD2El40Mfn0de941S3OXCW8QntAO316nT6c7KVTm_FtNIcIt8JefqDkZPuBcsm-EkjZi7E6dPJfedoeObkz8s3vnJzyedKQXD1hENPJLfhQJgGbUqLmlnqlJhgljaloyRRUoAMaTs3qY1iZYpuAKrppYXZOvaxk"/>
</div>
<span class="font-headline font-bold text-on-surface">Felix P.</span>
</div>
</div>
<div class="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between">
<span class="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Leaderboard Position</span>
<div class="flex items-baseline gap-2">
<span class="text-3xl font-black text-tertiary italic">#2</span>
<span class="text-xs text-secondary/60">out of 12</span>
</div>
</div>
<div class="bg-surface-container-high rounded-2xl p-4 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-highest transition-colors">
<span class="font-label text-[10px] uppercase tracking-tighter text-secondary/50">Current Streak</span>
<div class="flex items-center gap-2 text-primary">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">local_fire_department</span>
<span class="text-2xl font-black">4x</span>
</div>
</div>
</div>
</main>
<!-- Right Sidebar (Chat & Players) -->
<aside class="fixed right-0 top-0 h-full w-80 bg-surface-container-lowest border-l border-outline/5 pt-24 pb-6 px-4 flex flex-col gap-6">
<!-- Player List -->
<div class="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2">
<h3 class="font-label text-xs uppercase tracking-widest text-secondary/40 px-2 mb-2">Players</h3>
<!-- Active Player -->
<div class="flex items-center justify-between bg-primary/10 p-3 rounded-xl border-l-4 border-primary">
<div class="flex items-center gap-3">
<div class="relative">
<div class="w-10 h-10 rounded-full border-2 border-primary overflow-hidden">
<img alt="ArtVandelay" class="w-full h-full" data-alt="Vibrant flat vector avatar of a man with a beret and creative aesthetic" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfWeBf_UJlQN4UshjEWNT-QqhD6vo-YEuKoK3l8etA5sNjGx2xyVk8aZ3NZSOu_wtlFCc5FUM01_VPJzBjqRWHWWVV1RYxBwxmGMIe3Kv2u29GQ89oLqLj_uD0GSv7auJpEpNgfM75gzviLl2OVCfj4F6Iuh6Ani8AVP1fSDpL4eGVsP-YZBwk1gQqav7Kux_I2BBlYuGa1RzFiSEXgLoPPg7gwMOL2RW4wRictq_xB44TchsugDTPbZG3S11sJ5DxJfmRhboSWxU"/>
</div>
<div class="absolute -bottom-1 -right-1 bg-primary text-on-primary rounded-full p-0.5">
<span class="material-symbols-outlined text-[12px]" style="font-variation-settings: 'FILL' 1;">brush</span>
</div>
</div>
<div>
<p class="font-bold text-primary text-sm">ArtVandelay</p>
<p class="text-[10px] font-label text-secondary/60">Drawing...</p>
</div>
</div>
<span class="font-black text-on-surface">1,240</span>
</div>
<!-- Other Players -->
<div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border border-outline/20 overflow-hidden">
<img alt="DoodleMaster" class="w-full h-full" data-alt="Cartoon avatar of a young person with headphones and bright clothes" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByxDGiMBCiiksuXyApTVFWnjUNPlKJHyuTXRV4V__BvrEj-6mkFZxhAR_TPss1VkQfli4Jo3mS9RyYrY0nvJGgkl3wBvz62ZXLXsTqmthJ1G_4Zfbl-IDalknNk75xt59NA3iHs-J7l3v9AHyQeC5RhZQCR-MZ3aBYdXJVlq87E50zCQfJw3DWNupAx9LHGSjO68ExjZpbPS-XefDcVjzYmMGrCw0ExfK9g1srJMSR7eFf10ZaNV6hvmLp_D0ZIhgX1UnxshsNb3Y"/>
</div>
<div>
<p class="font-bold text-on-surface text-sm">DoodleMaster</p>
<p class="text-[10px] font-label text-primary flex items-center gap-1">
<span class="material-symbols-outlined text-[10px]">check_circle</span> Guessed!
                            </p>
</div>
</div>
<span class="font-black text-secondary group-hover:text-on-surface transition-colors">985</span>
</div>
<div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border border-outline/20 overflow-hidden">
<img alt="Sketchy" class="w-full h-full" data-alt="Playful illustrated character avatar with a quirky expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGbGurlkgL2wMVuTcifXQzusxL60nHrjdqpndjA2qrzrf0FboQhs_UiltFLJrCPZUbI5KNkI-kmsHNQLGVGfXcB6VLJm-rWX5M05uCElCDsbIuPlZiE3BIO0ZuMxQrU-8lOpuSRiGnrqVtnP21XGVSqyLQdYmpCf1dfvpUqlsmAbnNZarjpdfILlUO6I5gCIVQqkdd47C_EL_NeHTKx7vn9SQOUl79S0NeFF5Nfn-Knu86XjguDJyYuMsH45-yR-65PP0ifSv487U"/>
</div>
<div>
<p class="font-bold text-on-surface text-sm">Sketchy_Gal</p>
<p class="text-[10px] font-label text-secondary/40">Thinking...</p>
</div>
</div>
<span class="font-black text-secondary group-hover:text-on-surface transition-colors">720</span>
</div>
<div class="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group">
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-full border border-outline/20 overflow-hidden">
<img alt="Bot99" class="w-full h-full" data-alt="Simple robot head avatar with colorful antenna in vector style" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA5zGTNXVbsu0vqR4RPESLRfmquJ-xSduaqWvUldGGWceU1GrW00D3FDlI5XHO0ZYl9hmzsoB2Dc-0W8VCrRpNXNRWWGR21nxZ5PjzQQ2tMCh4D_ryZtHxcFZJfdg1pVuWx1yORKvaA8ZTb6nhZ46zO_whzXUmv95EZrMU_usBHCxS_mSjqpMOUDVTbIseZkcSHHPYnDan15K-Yfc8M_mY4ql77w4vSMiC3nNe72r_GpEhGtH8s4BwUN5559GPVHX8WmA3BshQJvFs"/>
</div>
<div>
<p class="font-bold text-on-surface text-sm">PixelPete</p>
<p class="text-[10px] font-label text-secondary/40">Thinking...</p>
</div>
</div>
<span class="font-black text-secondary group-hover:text-on-surface transition-colors">410</span>
</div>
</div>
<!-- Chat & Guesses -->
<div class="flex-1 flex flex-col bg-surface-container rounded-2xl overflow-hidden shadow-inner">
<div class="p-4 border-b border-outline/5">
<h3 class="font-label text-xs uppercase tracking-widest text-secondary/60">Live Guesses</h3>
</div>
<div class="flex-1 overflow-y-auto p-4 flex flex-col gap-2 custom-scrollbar">
<div class="text-sm">
<span class="font-bold text-secondary">Sketchy_Gal:</span> <span class="text-on-surface/80">is it a dog?</span>
</div>
<div class="text-sm">
<span class="font-bold text-secondary">PixelPete:</span> <span class="text-on-surface/80">cloud?</span>
</div>
<!-- Correct Guess -->
<div class="bg-primary/20 p-2 rounded-lg border border-primary/30 flex items-center gap-2 animate-pulse">
<span class="material-symbols-outlined text-primary text-[16px]">celebration</span>
<p class="text-xs font-bold text-primary">DoodleMaster guessed the word!</p>
</div>
<div class="text-sm">
<span class="font-bold text-secondary">SkribblBot:</span> <span class="italic text-tertiary">Hint: It starts with 'P'</span>
</div>
<div class="text-sm">
<span class="font-bold text-secondary">Sketchy_Gal:</span> <span class="text-on-surface/80">Panda?</span>
</div>
<div class="text-sm">
<span class="font-bold text-secondary">Sketchy_Gal:</span> <span class="text-on-surface/80">Pizza?</span>
</div>
</div>
<!-- Input Area -->
<div class="p-4 bg-surface-container-high">
<div class="relative">
<input class="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-4 pr-12 text-sm font-label focus:ring-2 focus:ring-primary/50 placeholder:text-secondary/30 transition-all" placeholder="Type your guess here..." type="text"/>
<button class="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-primary hover:bg-primary/10 rounded-lg transition-colors">
<span class="material-symbols-outlined">send</span>
</button>
</div>
</div>
</div>
</aside>
</div>
<!-- Floating UI Decoration -->
<div class="fixed bottom-8 left-72 pointer-events-none opacity-20 hidden lg:block">
<div class="flex gap-4 items-end">
<div class="w-12 h-32 bg-primary rounded-full blur-3xl"></div>
<div class="w-16 h-16 bg-tertiary rounded-full blur-2xl"></div>
</div>
</div>
</body></html>






#ENTRY/LANDING PAGE

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Skribbl Atelier - The Digital Sketchbook</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&amp;family=Be+Vietnam+Pro:wght@400;500;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "primary": "#6eed53",
              "on-tertiary-container": "#564600",
              "error": "#ffb4ab",
              "tertiary-fixed": "#ffe175",
              "on-secondary-fixed": "#001b40",
              "on-secondary": "#002f66",
              "inverse-on-surface": "#002b75",
              "on-secondary-fixed-variant": "#004590",
              "background": "#001038",
              "surface-container-low": "#001849",
              "secondary-fixed": "#d7e2ff",
              "surface-variant": "#002f7e",
              "tertiary": "#f4d041",
              "on-error-container": "#ffdad6",
              "error-container": "#93000a",
              "surface-container-highest": "#002f7e",
              "on-error": "#690005",
              "inverse-primary": "#0e6e00",
              "secondary-fixed-dim": "#acc7ff",
              "on-surface": "#dae1ff",
              "on-tertiary": "#3b2f00",
              "on-tertiary-fixed": "#221b00",
              "outline-variant": "#3e4a39",
              "surface-tint": "#62e148",
              "on-primary-fixed": "#022200",
              "outline": "#879580",
              "on-tertiary-fixed-variant": "#554500",
              "on-primary-container": "#095400",
              "on-secondary-container": "#e6ecff",
              "surface-dim": "#001038",
              "surface-bright": "#053385",
              "tertiary-container": "#d6b424",
              "secondary": "#acc7ff",
              "surface-container-high": "#002567",
              "primary-container": "#51d039",
              "primary-fixed-dim": "#62e148",
              "primary-fixed": "#7efe62",
              "on-primary": "#043900",
              "surface-container": "#001c51",
              "surface-container-lowest": "#000c2d",
              "inverse-surface": "#dae1ff",
              "surface": "#001038",
              "on-background": "#dae1ff",
              "tertiary-fixed-dim": "#e7c435",
              "secondary-container": "#0068d4",
              "on-primary-fixed-variant": "#085300",
              "on-surface-variant": "#bdcbb4"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Space Grotesk"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24
      }
      .canvas-grain {
        background-image: url(https://lh3.googleusercontent.com/aida-public/AB6AXuCJU6Uc5wYhU20Ba8q6o9CTxiYiGlWZREXVqxXkmmgAY8AbNKuyea9EXkztl4zPzvJKzIdjemi12LEq_5YTrtc1rU_YzXYPB7ieka_9o7sLSdcJUdI96zDWRmPvMJz1FZqJcfUiA0qY-9pjYqJ4O7hYcp22HrhsNoexhLDTD_QpStyNn5MOM_SzaQxZUNgOPya_KrIlMlioQHvfwRB4nG7h1nYGI9qwuJ-0G8pLbZ-QsateWK9kz-NcxRqDYPJwOOUk7ibnw4Pvpbw);
        pointer-events: none
      }
      .glass {
        background: rgba(0, 24, 73, 0.4);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.05);
      }
    </style>
</head>
<body class="bg-background text-on-background font-body min-h-screen selection:bg-primary selection:text-on-primary overflow-x-hidden">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-none flex justify-between items-center w-full px-6 py-4 max-w-full">
<div class="flex items-center gap-8">
<h1 class="text-2xl font-black text-primary tracking-tighter italic font-headline">Skribbl Atelier</h1>
<nav class="hidden md:flex gap-6">
<a class="font-headline font-bold tracking-tight text-primary border-b-2 border-primary pb-1" href="#">How to Play</a>
<a class="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">Gallery</a>
<a class="font-headline font-bold tracking-tight text-secondary font-medium hover:text-primary transition-colors duration-300" href="#">Shop</a>
</nav>
</div>
<div class="flex items-center gap-4">
<button class="px-4 py-2 font-headline font-bold text-on-primary bg-primary rounded-xl scale-95 hover:scale-100 transition-transform duration-150 active:opacity-80">Create Room</button>
<button class="px-4 py-2 font-headline font-bold text-on-secondary-container bg-secondary-container rounded-xl scale-95 hover:scale-100 transition-transform duration-150 active:opacity-80">Join Game</button>
<div class="flex gap-2 ml-2">
<span class="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">settings</span>
<span class="material-symbols-outlined text-secondary cursor-pointer hover:text-primary transition-colors">help</span>
</div>
</div>
</header>
<main class="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-12 px-6 max-w-7xl mx-auto">
<!-- Background Texture -->
<div class="fixed inset-0 canvas-grain opacity-10"></div>
<!-- Hero Branding -->
<section class="text-center mb-12 relative w-full flex flex-col items-center">
<div class="absolute -top-40 w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full -z-10"></div>
<div class="inline-block px-4 py-1.5 rounded-full glass border border-primary/20 text-primary font-label text-[10px] uppercase tracking-[0.2em] font-bold mb-6">
                The Digital Sketchbook Experience
            </div>
<h2 class="font-headline text-7xl md:text-[10rem] font-extrabold tracking-tighter italic text-primary leading-[0.8] mb-4 drop-shadow-[0_10px_30px_rgba(110,237,83,0.3)]">
                SKRIBBL<br/><span class="text-secondary ml-12">ATELIER</span>
</h2>
</section>
<!-- Entry Card Container -->
<div class="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative">
<!-- Left: Avatar Customizer -->
<div class="lg:col-span-5 bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl overflow-hidden group">
<div class="flex items-center justify-between mb-8">
<h3 class="font-headline text-xl font-bold text-on-surface">Your Artist Profile</h3>
<span class="p-2 bg-surface-container-highest rounded-full text-primary">
<span class="material-symbols-outlined text-lg">edit_note</span>
</span>
</div>
<div class="flex flex-col items-center">
<div class="relative w-full aspect-square max-w-[280px] mb-8 group/avatar">
<div class="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl group-hover/avatar:bg-primary/40 transition-all duration-500"></div>
<div class="relative w-full h-full bg-surface-container-high rounded-[2rem] flex items-center justify-center border-2 border-outline/10 overflow-hidden shadow-inner">
<img alt="Custom Avatar" class="w-full h-full object-cover group-hover/avatar:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_e4svEGiCxxe9J2iRjJr6QywolrOwLhf3kIl_nuq2yXUfbNXTitUlAtML9R2a7oG0giv_l0bONsT85ffI7wjC0Kmq2exEawwxA_7HyGcVqcsj84pd4EOUgOgeL1l3R2yfuQpzRm4vOgxONJfgPpvJZNtcsObNbbIv96S5pmnEL3REJvk0b59EvjU8q6uFzSshR42YOQ4Ao_42bhbgTDvUjJR9-K_iz1B8F-sSsLfD0zK2Tleex9gV4MDSzjcCbPpx5mtn-DIpnzU"/>
<div class="absolute bottom-4 right-4 bg-primary p-3 rounded-2xl shadow-xl transform translate-y-2 opacity-0 group-hover/avatar:translate-y-0 group-hover/avatar:opacity-100 transition-all cursor-pointer">
<span class="material-symbols-outlined text-on-primary font-bold">auto_fix_high</span>
</div>
</div>
</div>
<div class="grid grid-cols-1 w-full gap-3">
<div class="flex items-center justify-between bg-surface-container-lowest/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group/row">
<span class="font-label text-xs uppercase tracking-widest text-secondary/60 font-bold group-hover/row:text-primary transition-colors">Face Structure</span>
<div class="flex gap-2">
<button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_left</span></button>
<button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_right</span></button>
</div>
</div>
<div class="flex items-center justify-between bg-surface-container-lowest/80 rounded-2xl p-4 border border-white/5 hover:border-primary/20 transition-all cursor-pointer group/row">
<span class="font-label text-xs uppercase tracking-widest text-secondary/60 font-bold group-hover/row:text-primary transition-colors">Palette Theme</span>
<div class="flex gap-2">
<button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_left</span></button>
<button class="p-1 hover:text-primary"><span class="material-symbols-outlined text-lg">chevron_right</span></button>
</div>
</div>
</div>
</div>
</div>
<!-- Right: Action Panel -->
<div class="lg:col-span-7 flex flex-col gap-6">
<div class="bg-surface-container-low/50 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-10 border border-white/5 shadow-2xl flex-grow flex flex-col justify-center">
<div class="space-y-8">
<div class="space-y-3">
<label class="font-label text-xs text-tertiary ml-1 uppercase tracking-[0.3em] font-bold">Artist Alias</label>
<div class="relative group">
<span class="absolute left-6 top-1/2 -translate-y-1/2 material-symbols-outlined text-secondary/40 group-focus-within:text-primary transition-colors">stylus</span>
<input class="w-full bg-surface-container-lowest/80 border-2 border-white/5 rounded-[1.5rem] py-6 pl-16 pr-6 text-on-surface focus:ring-0 focus:border-primary placeholder:text-on-surface-variant/20 font-headline text-2xl font-bold transition-all" placeholder="How shall we call you?" type="text"/>
</div>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<button class="bg-gradient-to-br from-primary via-primary to-primary-container text-on-primary py-6 rounded-[1.5rem] font-headline text-3xl font-black italic tracking-tighter shadow-[0_15px_35px_-5px_rgba(110,237,83,0.4)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3">
                                PLAY NOW
                                <span class="material-symbols-outlined text-3xl">rocket_launch</span>
</button>
<button class="bg-secondary-container text-on-secondary-container py-6 rounded-[1.5rem] font-headline text-lg font-bold tracking-tight hover:bg-secondary/20 transition-colors flex items-center justify-center gap-2">
<span class="material-symbols-outlined">meeting_room</span>
                                Private Room
                            </button>
</div>
<div class="pt-6 flex items-center justify-between border-t border-white/5">
<div class="flex items-center gap-2">
<span class="flex h-2.5 w-2.5">
<span class="animate-ping absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary opacity-75"></span>
<span class="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary"></span>
</span>
<span class="text-sm font-label text-secondary/60">42,801 artists sketching</span>
</div>
<div class="flex items-center gap-4 text-secondary/40 font-label text-xs">
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">bolt</span> v2.4.0</span>
<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">cloud_done</span> US-East</span>
</div>
</div>
</div>
</div>
<!-- Mini Bento Bottom -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- News Card -->
<div class="bg-surface-container-low/50 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-low transition-all">
<div>
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-secondary text-sm">campaign</span>
<span class="font-label text-[10px] uppercase font-bold tracking-widest text-secondary/50">Atelier Bulletin</span>
</div>
<h4 class="font-headline font-bold text-lg text-on-surface leading-tight group-hover:text-primary transition-colors">Spring Brush Collection is live!</h4>
</div>
<div class="mt-4 flex items-center text-xs font-bold text-primary gap-1">
                            Read update <span class="material-symbols-outlined text-sm">north_east</span>
</div>
</div>
<!-- Mini Gallery Card -->
<div class="bg-surface-container-low/50 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 flex flex-col justify-between group cursor-pointer hover:bg-surface-container-low transition-all">
<div>
<div class="flex items-center gap-2 mb-4">
<span class="material-symbols-outlined text-secondary text-sm">palette</span>
<span class="font-label text-[10px] uppercase font-bold tracking-widest text-secondary/50">Daily Masterpiece</span>
</div>
<div class="flex items-center gap-3">
<div class="w-10 h-10 rounded-lg bg-surface-container-highest overflow-hidden border border-white/10">
<img alt="Mini masterpiece" class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt1B4JFGLhawpkxZGOpUkJBpNdmqm8ptjNnE7ds6kjOXzGba0Qxrh_XA5OK67bBpGJx_Q93VbDjNl4XU_92T3wYgoYpbzHyVVnI8kUlF3W8pdgFSJucLIZQS1i4iOOmkIa5FXsMwPdfxK2-6p6gTaRmchGhDtNqmtVSvcz8r0gVwqRaKX4rnsgDhpBYhnmfrBVVlQ17a-8Geqhbu1wjo9XMLPknmgMjTBVp3BRe9SIXXkcLI3Nx1SpuyrJoOVY1Xee8E5JcgHjhaI"/>
</div>
<span class="font-headline font-bold text-on-surface">Weekly Hall of Fame</span>
</div>
</div>
<div class="mt-4 flex items-center text-xs font-bold text-secondary gap-1">
                            View gallery <span class="material-symbols-outlined text-sm">north_east</span>
</div>
</div>
</div>
</div>
</div>
</main>
<!-- Attribution Footer (Small) -->
<div class="w-full py-8 px-6 text-center text-on-surface-variant/30 text-[10px] font-label uppercase tracking-widest">
<span>© 2024 ATELIER LABS. ALL RIGHTS RESERVED.</span>
</div>
</body></html>




#LOBBY PAGE  (Team View)

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,400;0,700;0,800;1,800&amp;family=Be+Vietnam+Pro:wght@400;500;700&amp;family=Space+Grotesk:wght@400;500;700&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "outline": "#879580",
              "surface-variant": "#002f7e",
              "on-secondary-container": "#e6ecff",
              "secondary-container": "#0068d4",
              "error-container": "#93000a",
              "on-primary": "#043900",
              "inverse-on-surface": "#002b75",
              "tertiary-container": "#d6b424",
              "surface-container-lowest": "#000c2d",
              "primary-fixed": "#7efe62",
              "primary": "#6eed53",
              "on-tertiary": "#3b2f00",
              "on-secondary-fixed-variant": "#004590",
              "on-secondary-fixed": "#001b40",
              "background": "#001038",
              "secondary-fixed-dim": "#acc7ff",
              "primary-container": "#51d039",
              "outline-variant": "#3e4a39",
              "on-background": "#dae1ff",
              "surface": "#001038",
              "surface-container-low": "#001849",
              "surface-bright": "#053385",
              "primary-fixed-dim": "#62e148",
              "tertiary": "#f4d041",
              "on-secondary": "#002f66",
              "on-primary-fixed-variant": "#085300",
              "on-tertiary-fixed-variant": "#554500",
              "on-error-container": "#ffdad6",
              "on-error": "#690005",
              "on-primary-fixed": "#022200",
              "tertiary-fixed-dim": "#e7c435",
              "surface-tint": "#62e148",
              "surface-container-high": "#002567",
              "inverse-surface": "#dae1ff",
              "on-primary-container": "#095400",
              "secondary": "#acc7ff",
              "on-tertiary-container": "#564600",
              "surface-dim": "#001038",
              "surface-container-highest": "#002f7e",
              "error": "#ffb4ab",
              "surface-container": "#001c51",
              "inverse-primary": "#0e6e00",
              "tertiary-fixed": "#ffe175",
              "on-tertiary-fixed": "#221b00",
              "on-surface-variant": "#bdcbb4",
              "on-surface": "#dae1ff",
              "secondary-fixed": "#d7e2ff"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Space Grotesk"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
      .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
      }
      .glass-panel {
        background: rgba(0, 24, 73, 0.6);
        backdrop-filter: blur(20px);
      }
      .neon-glow {
        box-shadow: 0 0 15px rgba(110, 237, 83, 0.3);
      }
      body {
        background-color: #001038;
        color: #dae1ff;
        overflow-x: hidden;
      }
    </style>
</head>
<body class="font-body">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-[#001038] border-none flex justify-between items-center w-full px-6 py-4 max-w-full">
<div class="flex items-center gap-8">
<h1 class="font-['Plus_Jakarta_Sans'] font-black text-2xl text-[#6eed53] tracking-tighter italic">Skribbl Atelier</h1>
<nav class="hidden md:flex gap-6 items-center">
<a class="text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">How to Play</a>
<a class="text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">Gallery</a>
<a class="text-[#acc7ff] font-medium hover:text-[#6eed53] transition-colors duration-300" href="#">Shop</a>
</nav>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-2 mr-4">
<button class="material-symbols-outlined text-[#acc7ff] hover:text-[#6eed53] transition-colors" data-icon="settings">settings</button>
<button class="material-symbols-outlined text-[#acc7ff] hover:text-[#6eed53] transition-colors" data-icon="help">help</button>
</div>
<button class="hidden lg:block px-5 py-2 text-[#acc7ff] font-bold hover:text-[#6eed53] transition-all scale-95 duration-150 active:opacity-80">Join Game</button>
<button class="px-6 py-2 bg-primary-container text-on-primary-container font-headline font-bold rounded-xl shadow-lg hover:scale-105 transition-all active:opacity-80">Create Room</button>
<div class="w-10 h-10 rounded-full border-2 border-outline-variant/20 overflow-hidden">
<img class="w-full h-full object-cover" data-alt="close-up portrait of a digital artist avatar with neon lighting highlights on a dark background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZpklQIcGXzLsr9F34yzJMbFmq6V5nkztQGa7JyECC5iKAUHCcvJO2qW2F_1Dm4Nkn47_az2T9HQPCiSd3-GLTloNimspwLX4zfOcFP7eBOM1EPXSh3qR8T3aDBlQxValZXUoGx_b2rrlLEnxOmw_Tlw19tNe1jEwVtUQI0V3CtbhLOWUHOzF6FJkhuE8bRqJxsiusO1o-dvoDQjIySyAP-EB66ovXu6zxunlDtn__EZk4nH_0UBTOoHnBNWzDQxe3RFHsJH4IJFk"/>
</div>
</div>
</header>
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#001038]/60 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
<div class="mb-10 px-2">
<div class="flex items-center gap-3 mb-1">
<div class="w-8 h-8 bg-surface-container-high rounded-full flex items-center justify-center">
<span class="material-symbols-outlined text-secondary text-lg" data-icon="meeting_room">meeting_room</span>
</div>
<h2 class="text-lg font-bold text-[#acc7ff] font-headline">Room #402</h2>
</div>
<p class="text-xs font-label text-secondary/60 uppercase tracking-widest pl-11">Round 2 of 3</p>
</div>
<nav class="flex-1 flex flex-col gap-2">
<a class="flex items-center gap-4 py-3 px-4 rounded-lg text-[#6eed53] font-bold border-r-4 border-[#6eed53] bg-white/5 transition-all translate-x-1" href="#">
<span class="material-symbols-outlined" data-icon="home">home</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Lobby</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined" data-icon="group">group</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Players</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined" data-icon="chat">chat</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Chat</span>
</a>
<a class="flex items-center gap-4 py-3 px-4 rounded-lg text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined" data-icon="brush">brush</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Tools</span>
</a>
</nav>
<div class="mt-auto flex flex-col gap-2 pt-6 border-t border-outline-variant/10">
<button class="w-full py-3 px-4 bg-secondary-container/20 text-secondary font-bold rounded-xl mb-4 hover:bg-secondary-container/40 transition-colors">Invite Friends</button>
<a class="flex items-center gap-4 py-2 px-4 text-[#acc7ff] opacity-70 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined" data-icon="settings">settings</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Settings</span>
</a>
<a class="flex items-center gap-4 py-2 px-4 text-error opacity-70 hover:opacity-100 transition-all" href="#">
<span class="material-symbols-outlined" data-icon="logout">logout</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Leave</span>
</a>
</div>
</aside>
<!-- Main Content -->
<main class="pl-64 pt-24 min-h-screen">
<div class="max-w-7xl mx-auto p-8">
<!-- Header Section -->
<div class="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
<div>
<h2 class="text-4xl font-black font-headline text-on-background tracking-tight mb-2 italic">Lobby: Teams View</h2>
<p class="text-secondary font-label text-sm uppercase tracking-widest">Waiting for players to join the scribble fest...</p>
</div>
<!-- Toggle View -->
<div class="bg-surface-container-low p-1.5 rounded-full flex items-center shadow-inner">
<button class="px-6 py-2 rounded-full text-sm font-bold font-headline transition-all text-secondary opacity-60 hover:opacity-100">Individual</button>
<button class="px-8 py-2 rounded-full text-sm font-bold font-headline bg-primary text-on-primary shadow-lg scale-105">Teams</button>
</div>
</div>
<div class="grid grid-cols-12 gap-8">
<!-- Teams Columns -->
<div class="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
<!-- Team A -->
<div class="flex flex-col gap-4">
<div class="flex items-center justify-between px-2">
<h3 class="font-headline font-extrabold text-xl text-primary italic flex items-center gap-2">
<span class="material-symbols-outlined" data-icon="palette">palette</span>
                                Team A: Neon Scribblers
                            </h3>
<span class="font-label text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20">4 Players</span>
</div>
<div class="flex flex-col gap-3">
<!-- Player Card -->
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20">
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-primary neon-glow">
<img class="w-full h-full object-cover" data-alt="portrait of a young gamer wearing high-tech green glowing headphones and a tactical vest" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwXR5a1uTOGgqCV-6aWqnckvoYtizkEDJQUfulTSQdV_vQ1i_f8TnLlMLEkitxHdsaN6a39-3ZIvGoZuNq06yEpUoQo-NMYw-fWs_Bq8AJKp_Un4wMd7qm_-YQBFPZMdAgZHKWJlRm8saHdJ7FplnQMWwPSH6JNrS2YQtdzIaLLF5n_LSeWJ17zvEdusH43bTxkjg58xZyXpF50ochctDJSDxcwUrox9dc7lvMbFNrMokRtF2fQ557_jJe35E1K4znUetMBxlTPu8"/>
</div>
<div class="absolute -bottom-1 -right-1 bg-primary text-on-primary text-[10px] font-black px-1.5 rounded-md">CAPTAIN</div>
</div>
<div>
<p class="font-headline font-bold text-on-background">DoodleKing_99</p>
<p class="font-label text-xs text-secondary/60">Lv. 42 • Master Artist</p>
</div>
</div>
<span class="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20">
<div class="flex items-center gap-4">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline-variant/30">
<img class="w-full h-full object-cover" data-alt="close up profile of a creative woman with colorful hair and artistic makeup looking at the screen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0RkrvtFhA7H1KhhqtLR0nNPNufH2IHLYjn_DS1xJfulNX6pn4P_4a3oZ-IOiQwcrycFU1q-d3ZTIrcoOcrswXHoaCJumJfXqqA2NmkGTcYWPHcpjqmu4S6PD4XN391egW34NV-yPPAFsnP_W66ZHmrnFWHe02hZMba5lUNreVVSNx7lS2P9jketpZrzlwrMK4QBb38Urhjp5EgeM3-nNIh65n_KOTV92oabnwqa7v2SkkegCPx-x_ze2kRTL7_DW-mdJsccy1sEs"/>
</div>
<div>
<p class="font-headline font-bold text-on-background">PixelPina</p>
<p class="font-label text-xs text-secondary/60">Lv. 15 • Enthusiast</p>
</div>
</div>
<span class="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-primary/20">
<div class="flex items-center gap-4">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline-variant/30">
<img class="w-full h-full object-cover" data-alt="avatar of a smiling man with trendy glasses and artistic flair in a soft-focus studio environment" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOYSTqGoB6IS3o8zFX7Xe3Jm_zKuu_bf6yVUUKSShHy-uECmi0xrVeJSe_LDxJWhxblDgX1fH0H8YI-wfl0szIgiJUnG6aPi8mbMHH6mmGKS66Y8kidB-wlxAtwi-DMB-QUneu7ljqKp95iNcpQ2RZ3AbONmreLHJdqBRHxa9meigEFTeOBX488854EclpcTSijENOSgWcqfes0vCJKtrShxe78CI60ywJE6aPTzN6g-8ZB4ucd5j2qSC-5VYsKA-gc10culkii1M"/>
</div>
<div>
<p class="font-headline font-bold text-on-background">Blinky_Blue</p>
<p class="font-label text-xs text-secondary/60">Lv. 08 • Newcomer</p>
</div>
</div>
<span class="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/40 transition-all cursor-pointer group">
<span class="material-symbols-outlined text-outline group-hover:text-primary transition-colors" data-icon="person_add">person_add</span>
<span class="text-xs font-label text-outline group-hover:text-primary transition-colors">Join Team A</span>
</div>
</div>
</div>
<!-- Team B -->
<div class="flex flex-col gap-4">
<div class="flex items-center justify-between px-2">
<h3 class="font-headline font-extrabold text-xl text-tertiary italic flex items-center gap-2">
<span class="material-symbols-outlined" data-icon="ink_highlighter">ink_highlighter</span>
                                Team B: Graphite Gang
                            </h3>
<span class="font-label text-xs bg-tertiary/10 text-tertiary px-3 py-1 rounded-full border border-tertiary/20">3 Players</span>
</div>
<div class="flex flex-col gap-3">
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-tertiary/20">
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-tertiary shadow-[0_0_15px_rgba(244,208,65,0.3)]">
<img class="w-full h-full object-cover" data-alt="energetic avatar of a young man with expressive face and creative street-style clothing" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6GDX5jtLghzgc-9ytvRL3dywy2eL4yhcUkb3cvC9_U4BEedviw5W8lE4zLyae7JuG1H953o8C5Gh0LXhYNKJJVe4RsrR989Vk-0_4dGyS0a_u0HZLuwTxyhc5LanOQIEiAbTEnIOYGrxvEmTVNlB0Ftz6Xn-4W4ceEbO44TxzOPOrJEmiXgs451c8IOGN1KDOcnUiWVUee0o79mAzj3Kmo7StqC-J5noyMsKuNknzQr2dECJ07bSoKC9-KIcYi3C4nCwtu49G-x0"/>
</div>
<div class="absolute -bottom-1 -right-1 bg-tertiary text-on-tertiary text-[10px] font-black px-1.5 rounded-md">CAPTAIN</div>
</div>
<div>
<p class="font-headline font-bold text-on-background">Sketch_Wizard</p>
<p class="font-label text-xs text-secondary/60">Lv. 58 • Grandmaster</p>
</div>
</div>
<span class="material-symbols-outlined text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-tertiary/20">
<div class="flex items-center gap-4">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline-variant/30">
<img class="w-full h-full object-cover" data-alt="female digital artist avatar with modern minimalist look and focused gaze" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbqYgSRkaf8xOzR5aC65Kvi_0yPGydaehvTnjqxwNcI6sgTW-GpSbbMJKJ31NUFKvf7ZlLXtyRy2r5UTtRCflVdP_jF5Sb1otkhu7YCZtud6EY3k_Ln09PGI70VW4iehFOFVFouzcIHxWU6Wzc3wCL_JuBNbNGgZRtsimtFncqZ-yvZI8HG88hYIkqQZZ2LMLsjNWHzpmz1zk87Lz1R3eiRC0Pyo84db5n5iCHRqLZtStOmJjibDBEauZ2Q5eLhT-f3LKeQcLE1ig"/>
</div>
<div>
<p class="font-headline font-bold text-on-background">Inkwell_Jane</p>
<p class="font-label text-xs text-secondary/60">Lv. 31 • Pro Designer</p>
</div>
</div>
<span class="material-symbols-outlined text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="glass-panel p-4 rounded-xl flex items-center justify-between hover:bg-white/5 transition-all group border border-transparent hover:border-tertiary/20">
<div class="flex items-center gap-4">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline-variant/30">
<img class="w-full h-full object-cover" data-alt="smiling man avatar in creative outfit with artistic backdrop and cinematic lighting" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtuBGqj5hLvEZ-NaXjyGx4lY1091Sa_30iKT06kuxPwz1eGzAQAJv-XXFq2Er1KHSatH53PeMRbTVklLJw7fQ8ue6eUPw00HfX_2zpcbqaMEn3isscrvnCJ3TO4r3u-wBkradTu7WJFCVFV8TL3qtl4sIChPI_TDSEiZOWZYzOXeDpP084uqG89hyxEaWXzmvw5yEmLJXwIAr3lpGYSMcKpV4wK-VQTXj5hyVDyfix48EXFkmnNygnUjCG1kMLMYB86wuLNchGNdk"/>
</div>
<div>
<p class="font-headline font-bold text-on-background">SharpieSam</p>
<p class="font-label text-xs text-secondary/60">Lv. 22 • Intermediate</p>
</div>
</div>
<span class="material-symbols-outlined text-tertiary opacity-0 group-hover:opacity-100 transition-opacity" data-icon="check_circle">check_circle</span>
</div>
<div class="border-2 border-dashed border-outline-variant/30 p-6 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-tertiary/5 hover:border-tertiary/40 transition-all cursor-pointer group">
<span class="material-symbols-outlined text-outline group-hover:text-tertiary transition-colors" data-icon="person_add">person_add</span>
<span class="text-xs font-label text-outline group-hover:text-tertiary transition-colors">Join Team B</span>
</div>
</div>
</div>
</div>
<!-- Chat Sidebar -->
<div class="col-span-12 lg:col-span-4 flex flex-col h-[700px]">
<div class="glass-panel rounded-2xl flex flex-col h-full overflow-hidden border border-outline-variant/10">
<div class="p-6 bg-surface-container-low flex items-center justify-between">
<h3 class="font-headline font-bold text-lg text-[#acc7ff] flex items-center gap-2">
<span class="material-symbols-outlined" data-icon="forum">forum</span>
                                Lobby Chat
                            </h3>
<span class="w-3 h-3 bg-primary rounded-full animate-pulse"></span>
</div>
<!-- Chat Feed -->
<div class="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="text-xs font-label text-primary uppercase font-bold">DoodleKing_99</span>
<span class="text-[10px] text-outline font-label">12:45 PM</span>
</div>
<p class="text-sm bg-surface-container-high/40 p-3 rounded-xl rounded-tl-none text-on-background">Let's go Team A! We got this!! 🎨</p>
</div>
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="text-xs font-label text-tertiary uppercase font-bold">Sketch_Wizard</span>
<span class="text-[10px] text-outline font-label">12:46 PM</span>
</div>
<p class="text-sm bg-surface-container-high/40 p-3 rounded-xl rounded-tl-none text-on-background">Don't be so sure... my graphite is ready ✏️</p>
</div>
<div class="flex flex-col items-center py-2">
<span class="text-[10px] font-label text-secondary/40 bg-white/5 px-4 py-1 rounded-full border border-outline-variant/10 uppercase tracking-tighter">PixelPina joined Team A</span>
</div>
<div class="flex flex-col gap-1">
<div class="flex items-center gap-2">
<span class="text-xs font-label text-secondary uppercase font-bold">Inkwell_Jane</span>
<span class="text-[10px] text-outline font-label">12:48 PM</span>
</div>
<p class="text-sm bg-surface-container-high/40 p-3 rounded-xl rounded-tl-none text-on-background">Are we waiting for 2 more players or starting now?</p>
</div>
<div class="flex flex-col gap-1 self-end items-end">
<div class="flex items-center gap-2">
<span class="text-[10px] text-outline font-label">12:49 PM</span>
<span class="text-xs font-label text-primary-fixed uppercase font-bold">You</span>
</div>
<p class="text-sm bg-primary/10 border border-primary/20 p-3 rounded-xl rounded-tr-none text-on-background">I'm ready when you all are!</p>
</div>
</div>
<!-- Chat Input -->
<div class="p-4 bg-surface-container-low border-t border-outline-variant/10">
<div class="relative flex items-center">
<input class="w-full bg-surface-container-lowest border-none rounded-xl py-3 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 text-on-background font-body" placeholder="Type a message..." type="text"/>
<button class="absolute right-2 p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors">
<span class="material-symbols-outlined" data-icon="send">send</span>
</button>
</div>
</div>
</div>
</div>
</div>
<!-- Footer Action Bar -->
<div class="mt-12 flex justify-center">
<div class="glass-panel p-6 rounded-2xl flex items-center gap-8 border border-outline-variant/10 shadow-2xl">
<div class="flex items-center gap-4 pr-8 border-r border-outline-variant/20">
<div class="flex -space-x-3">
<div class="w-10 h-10 rounded-full border-2 border-background overflow-hidden ring-2 ring-primary">
<img class="w-full h-full object-cover" data-alt="avatar 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFPnq8jy9HkBRKG9FC5BEXjtklifmv--Eprrp8AtwkZqQCTMrKDjnoPB_sAyDbC8PXLSDijKeOrLgKAaPzbrw--gEERhJK3rETGXaaYAh2CUSgfA3rbjjqRcz7CkuGKXRsaPaQO3EZyUfVewOmDEOL6yMQe-e-Fspk2vIJIanNxp7ASyDZXxl5TqkmuRorMJq5-oTEp5aP7Ddd0kWqqS2EFGKJLj6LlXoftAwWR7aQ18wUrIXWIp7zNtU8WX0Ukxpuae5uTmUgi58"/>
</div>
<div class="w-10 h-10 rounded-full border-2 border-background overflow-hidden ring-2 ring-tertiary">
<img class="w-full h-full object-cover" data-alt="avatar 2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDusmSQqcB2XcvkogX-wd92Ea21abXkGhSOR7FLptSv3q3wCFEHf9dDsdTjG48ipdQBnj5jv7s219NHesXFUl47qvUMLIQJdsGlzkpm-elMOxvtPDZu3nqRiyiETVqmv0KjtbM-NU8yatB3xCyNgFrebu6DJ0AeIVL6dejItqx3s7TcQ4Hp8zIfsa53nNwIBGk2MjiC2GWJuVFsPeE5aSQAWfNDJMO66pzbqYziN6GKlXY13cW9OY64fyOL4xvr3S7uWciE7ba1rUM"/>
</div>
<div class="w-10 h-10 rounded-full border-2 border-background bg-surface-container-high flex items-center justify-center text-xs font-bold text-secondary">
                                +5
                            </div>
</div>
<div>
<p class="text-sm font-headline font-bold">7 Players Ready</p>
<p class="text-[10px] font-label text-secondary/60">Min 4 / Max 12</p>
</div>
</div>
<div class="flex gap-4">
<button class="px-8 py-3 bg-surface-container-high text-secondary font-headline font-bold rounded-xl hover:bg-surface-container-highest transition-all active:scale-95">Game Settings</button>
<button class="px-12 py-3 bg-primary text-on-primary font-headline font-black rounded-xl hover:scale-105 hover:shadow-[0_0_20px_rgba(110,237,83,0.4)] transition-all active:scale-95 italic text-lg">START DASH</button>
</div>
</div>
</div>
</div>
</main>
<!-- Floating UI Decoration -->
<div class="fixed bottom-10 left-10 opacity-20 pointer-events-none hidden xl:block">
<span class="material-symbols-outlined text-primary text-[120px] rotate-12" data-icon="gesture">gesture</span>
</div>
<div class="fixed top-20 right-10 opacity-10 pointer-events-none hidden xl:block">
<span class="material-symbols-outlined text-tertiary text-[180px] -rotate-12" data-icon="brush">brush</span>
</div>
</body></html>


#Lobby view (Individual View)

<!DOCTYPE html>

<html class="dark" lang="en"><head>
<meta charset="utf-8"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/>
<title>Lobby: Individual View - Skribbl Atelier</title>
<script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800&amp;family=Be+Vietnam+Pro:wght@400;500;700&amp;family=Space+Grotesk:wght@400;500&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&amp;display=swap" rel="stylesheet"/>
<script id="tailwind-config">
      tailwind.config = {
        darkMode: "class",
        theme: {
          extend: {
            colors: {
              "outline": "#879580",
              "surface-variant": "#002f7e",
              "on-secondary-container": "#e6ecff",
              "secondary-container": "#0068d4",
              "error-container": "#93000a",
              "on-primary": "#043900",
              "inverse-on-surface": "#002b75",
              "tertiary-container": "#d6b424",
              "surface-container-lowest": "#000c2d",
              "primary-fixed": "#7efe62",
              "primary": "#6eed53",
              "on-tertiary": "#3b2f00",
              "on-secondary-fixed-variant": "#004590",
              "on-secondary-fixed": "#001b40",
              "background": "#001038",
              "secondary-fixed-dim": "#acc7ff",
              "primary-container": "#51d039",
              "outline-variant": "#3e4a39",
              "on-background": "#dae1ff",
              "surface": "#001038",
              "surface-container-low": "#001849",
              "surface-bright": "#053385",
              "primary-fixed-dim": "#62e148",
              "tertiary": "#f4d041",
              "on-secondary": "#002f66",
              "on-primary-fixed-variant": "#085300",
              "on-tertiary-fixed-variant": "#554500",
              "on-error-container": "#ffdad6",
              "on-error": "#690005",
              "on-primary-fixed": "#022200",
              "tertiary-fixed-dim": "#e7c435",
              "surface-tint": "#62e148",
              "surface-container-high": "#002567",
              "inverse-surface": "#dae1ff",
              "on-primary-container": "#095400",
              "secondary": "#acc7ff",
              "on-tertiary-container": "#564600",
              "surface-dim": "#001038",
              "surface-container-highest": "#002f7e",
              "error": "#ffb4ab",
              "surface-container": "#001c51",
              "inverse-primary": "#0e6e00",
              "tertiary-fixed": "#ffe175",
              "on-tertiary-fixed": "#221b00",
              "on-surface-variant": "#bdcbb4",
              "on-surface": "#dae1ff",
              "secondary-fixed": "#d7e2ff"
            },
            fontFamily: {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Be Vietnam Pro"],
              "label": ["Space Grotesk"]
            },
            borderRadius: {"DEFAULT": "0.125rem", "lg": "0.25rem", "xl": "0.5rem", "full": "0.75rem"},
          },
        },
      }
    </script>
<style>
        .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
        }
        .glass-panel {
            background: rgba(0, 24, 73, 0.6);
            backdrop-filter: blur(20px);
        }
        .canvas-shadow {
            box-shadow: 0px 20px 40px rgba(0, 0, 0, 0.15);
        }
    </style>
</head>
<body class="bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
<!-- TopAppBar -->
<header class="fixed top-0 left-0 right-0 z-50 bg-[#001038] border-none flex justify-between items-center w-full px-6 py-4 max-w-full">
<div class="flex items-center gap-8">
<span class="text-2xl font-black text-[#6eed53] tracking-tighter italic font-headline">Skribbl Atelier</span>
<nav class="hidden md:flex gap-6 items-center">
<a class="text-[#6eed53] border-b-2 border-[#6eed53] pb-1 font-headline hover:text-[#6eed53] transition-colors duration-300" href="#">How to Play</a>
<a class="text-[#acc7ff] font-medium font-headline hover:text-[#6eed53] transition-colors duration-300" href="#">Gallery</a>
<a class="text-[#acc7ff] font-medium font-headline hover:text-[#6eed53] transition-colors duration-300" href="#">Shop</a>
</nav>
</div>
<div class="flex items-center gap-4">
<div class="flex items-center gap-2">
<button class="material-symbols-outlined text-[#acc7ff] hover:text-[#6eed53] transition-colors duration-300 scale-95 duration-150 active:opacity-80">settings</button>
<button class="material-symbols-outlined text-[#acc7ff] hover:text-[#6eed53] transition-colors duration-300 scale-95 duration-150 active:opacity-80">help</button>
</div>
<div class="flex items-center gap-3 ml-2">
<button class="px-4 py-2 rounded-xl bg-secondary-container text-on-secondary-container font-headline text-sm hover:opacity-90 transition-all active:scale-95">Join Game</button>
<button class="px-4 py-2 rounded-xl bg-primary text-on-primary font-headline text-sm hover:opacity-90 transition-all active:scale-95">Create Room</button>
</div>
</div>
</header>
<!-- SideNavBar -->
<aside class="fixed left-0 top-0 h-full flex flex-col py-8 px-4 z-40 bg-[#001038]/60 backdrop-blur-xl w-64 pt-24 shadow-[0px_20px_40px_rgba(0,0,0,0.15)]">
<div class="mb-8 px-2">
<div class="flex items-center gap-3 mb-2">
<div class="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center border border-outline/20">
<span class="material-symbols-outlined text-secondary" style="font-variation-settings: 'FILL' 1;">meeting_room</span>
</div>
<div>
<p class="text-lg font-bold text-[#acc7ff] font-headline">Room #402</p>
<p class="text-xs text-secondary/60 font-label">Round 2 of 3</p>
</div>
</div>
</div>
<nav class="flex-1 space-y-2">
<a class="flex items-center gap-3 px-4 py-3 text-[#6eed53] font-bold border-r-4 border-[#6eed53] bg-white/5 transition-all translate-x-1 duration-200" href="#">
<span class="material-symbols-outlined">home</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Lobby</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined">group</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Players</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined">chat</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Chat</span>
</a>
<a class="flex items-center gap-3 px-4 py-3 text-[#acc7ff] opacity-70 hover:bg-white/10 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined">brush</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Tools</span>
</a>
</nav>
<div class="mt-auto space-y-2 border-t border-outline/10 pt-6">
<button class="w-full py-3 px-4 rounded-xl bg-primary/10 text-primary font-headline text-sm mb-4 hover:bg-primary/20 transition-all">Invite Friends</button>
<a class="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-white transition-all" href="#">
<span class="material-symbols-outlined">settings</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Settings</span>
</a>
<a class="flex items-center gap-3 px-4 py-2 text-[#acc7ff] opacity-70 hover:text-error transition-all" href="#">
<span class="material-symbols-outlined">logout</span>
<span class="font-['Be_Vietnam_Pro'] text-sm">Leave</span>
</a>
</div>
</aside>
<!-- Main Content -->
<main class="ml-64 pt-24 min-h-screen p-8">
<div class="max-w-6xl mx-auto">
<header class="mb-10 flex justify-between items-end">
<div>
<h1 class="text-4xl font-black text-on-background tracking-tight font-headline italic mb-2">Lobby: Individual View</h1>
<p class="text-secondary font-label">Waiting for the host to initiate the creative chaos...</p>
</div>
<div class="flex gap-4">
<div class="glass-panel px-6 py-3 rounded-xl border border-outline/10 flex items-center gap-4">
<span class="text-xs font-label uppercase tracking-widest text-secondary/60">Room Code</span>
<span class="text-xl font-bold font-headline text-tertiary tracking-widest uppercase">SKRT-2024</span>
<button class="material-symbols-outlined text-secondary hover:text-primary transition-colors">content_copy</button>
</div>
</div>
</header>
<div class="grid grid-cols-12 gap-8 items-start">
<!-- Players Section -->
<section class="col-span-12 lg:col-span-7 space-y-6">
<div class="flex items-center justify-between mb-4">
<h2 class="text-xl font-bold font-headline text-on-background flex items-center gap-2">
<span class="material-symbols-outlined text-primary">group</span>
                            Players in Room <span class="text-secondary font-label ml-2 opacity-50 text-sm">(4/12)</span>
</h2>
</div>
<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
<!-- Player Card: Local User -->
<div class="surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 border-primary canvas-shadow relative overflow-hidden">
<div class="absolute top-0 right-0 p-1 bg-primary text-on-primary text-[10px] font-black uppercase tracking-tighter italic">Host</div>
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-primary/40 p-1">
<img alt="User Avatar" class="w-full h-full rounded-full bg-surface-container-high" data-alt="Stylized 3D avatar of a person with stylish glasses and messy hair on a blue background" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCYq7xGCRhucx3eYYOp0-auJOAJwNwkDa-sagmBuIbToeUTuloOR5jkOCozeBfMojUM1LOm7n5IonCjnccsw8xNIF9lpDkC9SODLMJtSp7ZXEYmVOFlzjLeX8pY9lsc3TjDRKfH15JGR6IcJ7VX6SJDf83_xpO1s2Qz-RF1mcAkNMo3SzhttRZTpXRBbLbJsUBPaRU9wFBUrar3DAEcflvqxS7GUyy4QDngIUebVrXDQujp2QBOv9V76uKfiui1l1mepjHbL8KqUYY"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] text-on-primary font-bold">check</span>
</div>
</div>
<div>
<p class="font-bold text-on-background font-headline">You (Felix)</p>
<p class="text-xs font-label text-primary uppercase">Ready</p>
</div>
</div>
</div>
<!-- Player Card: Others -->
<div class="surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 border-transparent">
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline/20 p-1">
<img alt="Luna Avatar" class="w-full h-full rounded-full bg-surface-container-high" data-alt="Animated female avatar with purple hair and happy expression" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDsYDyihY8x3rg20vOfYOU9424c3ctcFn6OUGLNMoXWO_Lv69t7lTTyP_zyOOHFR7qwPI4sDME0f9yObIGe4aMlSOEENaKdJVACK3TgiyS6xR1lB6H8Nu2PUAZT_5Fey-AopYG5KCEZBRxzY7wh-dWZJUQXFajdbCLw7C73hDnaWaXyv0bWSJ9JAdEj4IiyYpHdoBUMwCVxzk0-DC23SyqzwNxvYPt0_tZRGqRwOu6ZZ8j2Dko4gHJkpsuP8YDqx7ouZzE2BVhixIU"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-primary rounded-full border-2 border-background flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] text-on-primary font-bold">check</span>
</div>
</div>
<div>
<p class="font-bold text-on-background font-headline">Luna_Art</p>
<p class="text-xs font-label text-primary uppercase">Ready</p>
</div>
</div>
</div>
<div class="surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 border-transparent">
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline/20 p-1">
<img alt="Sketcher Avatar" class="w-full h-full rounded-full bg-surface-container-high" data-alt="Minimalist avatar of a man with a beanie and beard" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBdUsXC8z2Sd-c-A-59UFdLxfvAM-Ep3cSKuVdm_D8r0SNCkyTfbVupi3eK664XohsvW09o93TJBdoWnNNc3LTcDAWe-8NW1OrjkBTGp63qXC-sZxd2mHYLy5pd3imE8rgbF_Flhm-WKsTFoLEL1eBhwxwMuiYOEdSjAZ9Ejg-4vAbcho0CRaYrxZVWIs3nlXxoLbwkExoSYkB6ly_BdyNqJdRQyD8vF3zE2T8iFlu6Dh4Fdbirn0zBrnqFCm_zp14oW2EcZInpxGc"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-tertiary rounded-full border-2 border-background flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] text-on-tertiary font-bold">more_horiz</span>
</div>
</div>
<div>
<p class="font-bold text-on-background font-headline">PixelPusher</p>
<p class="text-xs font-label text-tertiary uppercase">Thinking...</p>
</div>
</div>
</div>
<div class="surface-container-low rounded-xl p-4 flex items-center justify-between group hover:surface-container transition-all border-l-4 border-transparent">
<div class="flex items-center gap-4">
<div class="relative">
<div class="w-14 h-14 rounded-full overflow-hidden border-2 border-outline/20 p-1">
<img alt="Milo Avatar" class="w-full h-full rounded-full bg-surface-container-high" data-alt="Cute avatar of a young boy with big headphones" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAtnz87y10zR-Ncth64pYgg-pTTi0lIYFUzStmONuHsuDyBEK_XdxmRsFklsj2e_5izOUjWyGGizzfWTL9ZL54DlOiiQZAGmQqJ5VynMvAgSVEDCjOpyFEP3Xm1am0t2Dq6QDBkKtQV_I15eBFigXJPnDN2y0HwL1DiMSs5jgG58NZdtGGo8sO3Ymm22wFZAUIRG3hfDeQIYsPb3bSGKXV0fk83GxQ3HM9Y1Nfzp_CJ1kgmqlEftxi6YNQluE-O-t7SOuOeftk5mVA"/>
</div>
<div class="absolute -bottom-1 -right-1 w-5 h-5 bg-error rounded-full border-2 border-background flex items-center justify-center">
<span class="material-symbols-outlined text-[12px] text-on-error font-bold">close</span>
</div>
</div>
<div>
<p class="font-bold text-on-background font-headline">Milo_99</p>
<p class="text-xs font-label text-error uppercase">Not Ready</p>
</div>
</div>
</div>
<!-- Empty Slot -->
<div class="border-2 border-dashed border-outline/20 rounded-xl p-4 flex items-center justify-center hover:bg-white/5 transition-all cursor-pointer">
<div class="flex items-center gap-3 text-secondary/40">
<span class="material-symbols-outlined">person_add</span>
<span class="font-label text-sm uppercase">Invite Player</span>
</div>
</div>
</div>
<!-- Game Settings Summary -->
<div class="mt-8 surface-container-highest/40 rounded-2xl p-6 glass-panel border border-white/5">
<h3 class="text-xs font-label uppercase tracking-[0.2em] text-secondary mb-6">Game Settings</h3>
<div class="grid grid-cols-2 md:grid-cols-4 gap-6">
<div>
<p class="text-[10px] font-label text-secondary/60 mb-1 uppercase">Rounds</p>
<p class="font-headline font-bold text-lg">3 Rounds</p>
</div>
<div>
<p class="text-[10px] font-label text-secondary/60 mb-1 uppercase">Draw Time</p>
<p class="font-headline font-bold text-lg">80 Seconds</p>
</div>
<div>
<p class="text-[10px] font-label text-secondary/60 mb-1 uppercase">Language</p>
<p class="font-headline font-bold text-lg">English</p>
</div>
<div>
<p class="text-[10px] font-label text-secondary/60 mb-1 uppercase">Custom Words</p>
<p class="font-headline font-bold text-lg text-primary">Enabled</p>
</div>
</div>
</div>
</section>
<!-- Lobby Chat Section -->
<aside class="col-span-12 lg:col-span-5 flex flex-col h-[600px]">
<div class="surface-container-low rounded-2xl flex flex-col h-full overflow-hidden border border-white/5 shadow-2xl">
<div class="bg-surface-container-highest px-6 py-4 flex items-center justify-between border-b border-white/5">
<h2 class="font-headline font-bold text-secondary flex items-center gap-2">
<span class="material-symbols-outlined text-sm">chat_bubble</span>
                                Lobby Chat
                            </h2>
<span class="text-[10px] font-label bg-primary/20 text-primary px-2 py-1 rounded uppercase">Live</span>
</div>
<div class="flex-1 p-6 overflow-y-auto space-y-4 custom-scrollbar">
<div class="flex flex-col gap-1">
<div class="flex items-baseline gap-2">
<span class="text-xs font-label text-primary">Felix (Host)</span>
<span class="text-[10px] text-secondary/40">10:42 AM</span>
</div>
<div class="bg-surface-container p-3 rounded-xl rounded-tl-none text-sm max-w-[85%] text-on-surface">
                                    Welcome everyone! Ready to sketch some masterpieces? 🎨
                                </div>
</div>
<div class="flex flex-col gap-1">
<div class="flex items-baseline gap-2">
<span class="text-xs font-label text-secondary">Luna_Art</span>
<span class="text-[10px] text-secondary/40">10:43 AM</span>
</div>
<div class="bg-surface-container-highest/50 p-3 rounded-xl rounded-tl-none text-sm max-w-[85%] text-on-surface">
                                    Born ready! Don't expect mercy with my brushwork haha.
                                </div>
</div>
<div class="flex flex-col gap-1 items-center py-2">
<span class="text-[10px] font-label text-secondary/40 uppercase tracking-tighter">— Milo_99 joined the room —</span>
</div>
<div class="flex flex-col gap-1">
<div class="flex items-baseline gap-2">
<span class="text-xs font-label text-tertiary">PixelPusher</span>
<span class="text-[10px] text-secondary/40">10:45 AM</span>
</div>
<div class="bg-surface-container-highest/50 p-3 rounded-xl rounded-tl-none text-sm max-w-[85%] text-on-surface">
                                    Is anyone using a drawing tablet or just mouse today?
                                </div>
</div>
</div>
<div class="p-4 bg-surface-container-lowest border-t border-white/5">
<div class="relative flex items-center">
<input class="w-full bg-surface-container-low border-none rounded-xl py-4 pl-4 pr-12 text-sm focus:ring-2 focus:ring-primary/50 font-body placeholder:text-secondary/30" placeholder="Type a message..." type="text"/>
<button class="absolute right-3 w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center hover:scale-105 transition-transform active:scale-95 shadow-lg shadow-primary/20">
<span class="material-symbols-outlined text-lg">send</span>
</button>
</div>
</div>
</div>
</aside>
</div>
<!-- Footer Actions -->
<footer class="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 pb-20">
<button class="group flex items-center gap-3 px-8 py-5 rounded-full bg-surface-container-highest text-secondary font-headline font-bold hover:bg-surface-bright transition-all active:scale-95 border border-white/5">
<span class="material-symbols-outlined group-hover:rotate-12 transition-transform">share</span>
                    Share Invite
                </button>
<button class="group flex items-center gap-4 px-12 py-5 rounded-full bg-primary text-on-primary font-headline font-black text-xl hover:shadow-[0_0_30px_rgba(110,237,83,0.4)] transition-all active:scale-95 italic">
<span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">play_arrow</span>
                    Start Game
                </button>
</footer>
</div>
</main>
<!-- Contextual Elements / Decorative blobs for 'Digital Atelier' vibe -->
<div class="fixed top-1/4 -right-24 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
<div class="fixed bottom-0 -left-24 w-[500px] h-[500px] bg-secondary-container/5 rounded-full blur-[150px] -z-10"></div>
</body></html>