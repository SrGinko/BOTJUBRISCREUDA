
const banners = [
    { name: 'Wave', id: '0', banner: 'https://zzggbdfcndfwdunphupw.supabase.co/storage/v1/object/public/Jubiscreuda/banners/wave.jpg', cor: '#bb00ff', corHEX: 0xbb00ff },
    { name: 'Tarde', id: '1', banner: 'https://zzggbdfcndfwdunphupw.supabase.co/storage/v1/object/public/Jubiscreuda/banners/tarde.jpg', cor: '#f74922', corHEX: 0xf74922 },
    { name: 'Olhar', id: '2', banner: 'https://i.pinimg.com/736x/65/ee/ff/65eeff4c209bf9c7badcd8a688136363.jpg', cor: '#ffffff', corHEX: 0xffffff },
    { name: 'Montanhas', id: '3', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTouyrbJzJZPnrtdcvmjrPmH3hClu7EuJZuJqB0MPJqCWrmCtfJYtQ5cE-rxs76GTaEOxM&usqp=CAU', cor: '#0398ce', corHEX: 0x0398ce },
    { name: 'Floresta', id: '4', banner: 'https://img.freepik.com/fotos-premium/imagens-de-papel-de-parede-em-4k_655257-1108.jpg', cor: '#6628f6', corHEX: 0x6628f6 },
    { name: 'Cat', id: '5', banner: 'https://i.pinimg.com/1200x/8f/b6/64/8fb664b3c5695d0b40abf294315964f2.jpg', cor: '#01e4ca', corHEX: 0x01e4ca },
    { name: 'Astronauta', id: '6', banner: 'https://images.wallpapersden.com/image/wxl-astronaut-minimalist_64872.jpg', cor: '#c91d20ff', corHEX: 0xc91d20ff },
    { name: 'Samael', id: '7', banner: 'https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/d6d9158f-1b03-4024-9f88-9d599c4c968a/df29tev-80fc62a5-5763-45a3-8b61-ec7f6d703924.png/v1/fit/w_600,h_240,q_70,strp/discord_banner__2__watermarked__by_gothymoth_df29tev-375w-2x.jpg?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9MjQwIiwicGF0aCI6IlwvZlwvZDZkOTE1OGYtMWIwMy00MDI0LTlmODgtOWQ1OTljNGM5NjhhXC9kZjI5dGV2LTgwZmM2MmE1LTU3NjMtNDVhMy04YjYxLWVjN2Y2ZDcwMzkyNC5wbmciLCJ3aWR0aCI6Ijw9NjAwIn1dXSwiYXVkIjpbInVybjpzZXJ2aWNlOmltYWdlLm9wZXJhdGlvbnMiXX0.PWzYbhsRZ8zU0Xn4y16vSFFyHg4SgbHE4pEw_O7_-LQ', cor: '#741111', corHEX: 0x741111 },
    { name: 'Vaquinha', id: '8', banner: 'https://i.pinimg.com/1200x/ad/17/d5/ad17d516ba4254ead5cb9bd2747dcc53.jpg', cor: '#9600db', corHEX: 0x9600db },
    { name: 'Onda', id: '9', banner: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIs0-MKricZIAODzC4Ki4ePIsKsQhxCksQjA&s', cor: '#ffffff', corHEX: 0xffffff },
    { name: 'Neblina', id: '10', banner: 'https://images-ext-1.discordapp.net/external/VqkxJ18-8oJKiLMoLUyz46VNBRb1XtCQjrFbJiLfqfo/https/wallpapers.com/images/hd/calm-aesthetic-desktop-8t7o1e3i0gaoodqz.jpg?format=webp&width=1258&height=683', cor: '#1f84ff', corHEX: 0x1f84ff },
    { name: 'LOL', id: '11', banner: 'https://www.riotgames.com/darkroom/1440/056b96aab9c107bfb72c1cc818be712a:8e765b8b8b63d537b82096f248c2f169/tf-graves-pride-0.png', cor: '#f279ff', corHEX: 0xf279ff },
    { name: 'Anime Gril', id: '12', banner: 'https://i.pinimg.com/736x/7a/8c/ec/7a8cecaee70f952dae36fa3636280e2a.jpg', cor: '#003655ff', corHEX: 0x003655ff},
    { name: 'Hajime no Ippo', id: '13', banner: 'https://m.media-amazon.com/images/S/pv-target-images/2e1f13308ead2fc251f71910b50e253af2f566d717f64dfcfd69a6ab5d8b00dd._SX1080_FMjpg_.jpg', cor: '#bf2126', corHEX: 0xbf2126 },
    { name: 'Inverno', id: '14', banner: 'https://i.pinimg.com/736x/7f/74/10/7f7410146fe75b317b34e111f42da75f.jpg', cor: '#148ab3', corHEX: 0x148ab3 },
    { name: 'Skulls', id: '15', banner: 'https://i.pinimg.com/1200x/9b/8c/35/9b8c356ce1124adc59fc9e95b6997a46.jpg', cor: '#ffffffff', corHEX: 0xffffff },
    { name: 'Gumball', id: '16', banner: 'https://i.pinimg.com/1200x/59/2b/fb/592bfb2ec02f3aba1ac9a324e992ecae.jpg', cor: '#0090b4ff', corHEX: 0x0090b4ff },
    { name: 'Akuma', id: '17', banner: 'https://zzggbdfcndfwdunphupw.supabase.co/storage/v1/object/public/Jubiscreuda/banners/Akuma.jpg', cor: '#c40000', corHEX: 0xc40000 },
    
]

module.exports = banners