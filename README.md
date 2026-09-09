# Ourobask-WEB

เว็บแนะนำ **[Ourobask](https://github.com/ZYDRAXYL/Ourobask-APP)** — แอป Android สำหรับเก็บงาน โน้ต
ไอเดีย กิจวัตร และเควสเก็บเงิน พร้อมการแจ้งเตือนและปลุกตามกำหนดส่ง

🔗 **[zydraxyl.github.io/Ourobask-WEB](https://zydraxyl.github.io/Ourobask-WEB/)**

## โครงสร้าง

```
.
├── index.html                  หน้าเดียวจบ ทุกส่วนของเว็บอยู่ในไฟล์นี้
├── assets/
│   ├── css/styles.css          ทั้งเว็บ ใช้ CSS custom properties เป็น design token
│   ├── js/main.js              ธีมสว่าง/มืด, เมนูจอเล็ก, scroll spy, ดึงรีลีสล่าสุด
│   └── img/                    โลโก้ favicon และภาพ Open Graph
├── .nojekyll                   ปิด Jekyll ของ GitHub Pages
├── robots.txt / sitemap.xml
└── .github/workflows/deploy.yml   deploy ขึ้น GitHub Pages
```

เว็บเป็น static site ล้วน ไม่มี build step ไม่มี dependency และไม่มี package manager
แก้ไฟล์แล้วเห็นผลทันที

## รันบนเครื่อง

เปิด `index.html` ด้วยเบราว์เซอร์ได้เลย หรือถ้าอยากได้ URL แบบ `http://`
(เพื่อให้ `fetch` ไปที่ GitHub API ทำงานเหมือนของจริง) ให้เสิร์ฟด้วยอะไรก็ได้ เช่น

```bash
python3 -m http.server 8000
# แล้วเปิด http://localhost:8000
```

## ธีมและสีของเว็บ

โทนสีอิงจากธีมจริงของแอป — Material 3 ที่ generate จาก seed `#6750A4`
(ค่าเดียวกับ `OurobaskApp.seed` ใน `lib/main.dart` ของ Ourobask-APP)
token ทั้งหมดอยู่ที่ `:root` และ `:root[data-theme="dark"]` ใน `assets/css/styles.css`

ธีมเริ่มต้นตามค่าของระบบผู้ใช้ และจำค่าที่ผู้ใช้เลือกเองไว้ใน `localStorage`
โดยตั้งค่าตั้งแต่ก่อนวาดหน้าเพื่อไม่ให้จอกะพริบตอนโหลด

## เวอร์ชันและลิงก์ดาวน์โหลด

ตอนเปิดหน้า `assets/js/main.js` จะเรียก
`https://api.github.com/repos/ZYDRAXYL/Ourobask-APP/releases/latest`
เพื่ออัปเดตหมายเลขเวอร์ชัน วันที่เผยแพร่ ขนาดไฟล์ และลิงก์ดาวน์โหลดของแต่ละสถาปัตยกรรม

ถ้าเรียก API ไม่สำเร็จ (ออฟไลน์ หรือโดน rate limit) หน้าเว็บยังใช้งานได้ตามปกติ —
จะแสดงค่าที่เขียนไว้ใน HTML และลิงก์ดาวน์โหลดจะชี้ไปที่หน้า
[releases/latest](https://github.com/ZYDRAXYL/Ourobask-APP/releases/latest) แทน
จึงไม่ต้องแก้เว็บทุกครั้งที่ปล่อยเวอร์ชันใหม่

## Deploy

ทุกครั้งที่ push ขึ้น `main` เวิร์กโฟลว์ **Deploy to GitHub Pages**
จะตรวจว่าไฟล์ที่ต้องมีอยู่ครบและ `index.html` ไม่ได้อ้างถึงไฟล์ที่ไม่มีอยู่
แล้ว deploy ทั้งโฟลเดอร์ขึ้น GitHub Pages สั่งรันเองจากแท็บ Actions ก็ได้

Pages ของ repo นี้ตั้งค่า source เป็น **GitHub Actions**

## สัญญาอนุญาต

Apache-2.0 — ดูรายละเอียดที่ [LICENSE](LICENSE)
