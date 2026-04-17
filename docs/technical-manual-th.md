# คู่มือทางเทคนิค CoffeeInsight AI (Technical Manual v2.0.0-db-persisted) 🛠️

เอกสารฉบับนี้อธิบายโครงสร้างระบบวิเคราะห์ยุทธศาสตร์ทำเลร้านกาแฟเชิงพยากรณ์ที่มีการเชื่อมต่อฐานข้อมูลและ AI แบบสมบูรณ์

---

## 1. สถาปัตยกรรมระบบ (System Architecture)

ระบบถูกออกแบบมาเป็นแบบ **3-Tier Architecture** เพื่อรองรับการสเกลระดับ Enterprise และเก็บข้อมูลแบบถาวร

### ส่วนหน้าบ้าน (Frontend - React + Tailwind + Vite)

- **เทคโนโลยีแผนที่ (GIS):** Leaflet.js เชื่อมต่อกับ OpenStreetMap Nominatim Geocoding API (มีระบบ Debounce ป้องกัน 429 Too Many Requests)
- **หน้าที่:** แสดงผล UI และรับการโต้ตอบจากผู้ใช้เท่านั้น
- **ความปลอดภัย:** ไม่มีการคำนวณสูตรหรือประมวลผลบนเครื่องไคลเอนต์ ข้อมูลทุกอย่างดึงมาจาก Backend

### เลเยอร์ API (Node.js + Express)

- **Endpoint:** `/api/v1/`
- **หน้าที่:** ควบคุมการดึงและบันทึกข้อมูลแบบ Real-time (Database Operations) และทำงานควบคู่กับ Deterministic Engine
- **AI Enrichment:** ผสมผสานข้อมูลจริงจาก AI (OpenAI gpt-4o-mini) และมีระบบ Fallback หาก API Limits เต็ม

### ฐานข้อมูล (PostgreSQL Layer)

- **เทคโนโลยี:** เชื่อมต่อเซิร์ฟเวอร์ (เช่น Neon DB) โดยบังคับใช้แพ็กเกจ `pg` (ตั้งค่า `sslmode=require` ป้องกันลิงก์หลุด)
- **โครงสร้างตารางหลัก:** `branches` (สาขาหลัก/ทำเลแวะ), `competitors` (ร้านคู่แข่ง), `simulations` (ประวัติการจำลอง)

### เอนจินแบบกำหนดผลลัพธ์ (Deterministic Engine - `deterministic.js`)

- **หน้าที่:** เป็น "Single Source of Truth" สำหรับสูตรคำนวณทางธุรกิจทั้งหมด
- **หลักการ:** ทุกฟังก์ชันต้องเป็น "Pure Functions" (ใส่ค่าเดิม ต้องได้ผลเดิมเสมอ)

---

## 2. API Endpoints ที่สำคัญ

### `GET /api/v1/dashboard?branch=dyn-xxx`

ดึงข้อมูลวิเคราะห์ทั้งหมด (Geo Score, Market Density) โดยจะ Query ตรงจากตาราง `branches` และ `competitors`

### `POST /api/v1/location/analyze`

Hyper-local territory scanning: รับค่าพิกัด สร้างข้อมูลคู่แข่งรอบๆ ตึกนั้นแบบสมจริง (รองรับทั้ง OpenAI และ Mock Fallback) แล้วบันทึกลง Database เพื่อเข้าสู่สถานะ PERSISTED_IN_DB ทันที

### `POST /api/v1/simulate-multi`

ระบบจำลองสถานการณ์เปลี่ยนเวลาเปิดร้าน ค้นหาเวลาที่ดีที่สุด แล้วบันทึกผลลัพธ์ลงสู่ตาราง `simulations`

### `GET /api/v1/simulations/:branchId/history`

ดึงประวัติการทดสอบเวลาจำลอง 5 ครั้งล่าสุดแบบเรียงตามเวลาบน Database

---

## 3. สูตรคำนวณหลัก (Core Formulas)

ระบบทำงานบนตรรกะแบบ White-box AI ไม่มีการเดาสุ่ม:

- **คะแนนทำเล (Geo Score):**
  - สูตร: `(ระยะทาง * 0.4) + (ความได้เปรียบเรื่องเวลาเปิด * 0.3) + (ความตรงกลุ่มเป้าหมาย * 0.2) + (คุณภาพรีวิว/ชื่อเสียง * 0.1)`
- **รายได้ที่คาดว่าจะเพิ่มขึ้น (Revenue Uplift):**
  - สูตร: `((ความต้องการที่กู้คืนมาได้ / ช่วงเวลา Peak) * 0.18 * ประสิทธิภาพการบริการ) * (1 + อัตราส่วน Rating ที่เหนือกว่า)`

---

## 4. มาตรฐานการตอบกลับของ API (Standard Explainability)

ทุกการตอบกลับจะถูก Audit และส่งข้อมูลแหล่งที่มาของตัวเลขเสมอ:

```json
{
  "success": true,
  "model_version": "v2.0.0-db-persisted-enricher",
  "data": { ... ข้อมูล ... },
  "explainability": {
    "source": "AI Geospatial Scan",
    "confidence_score": 0.92,
    "persistance": "PostgreSQL",
    "assumptions": [ ... ]
  }
}
```

---

## 5. การตั้งค่าระบบสำหรับขึ้น Production

1. **การตั้งค่า PostgreSQL:** จะต้องกำหนด `DATABASE_URL` ให้ลงท้ายด้วย `?sslmode=require` เสมอ เพื่อลดความผิดพลาดด้าน Security SSL ของ Node `pg` Pool
2. **การตั้งค่า AI:** กรอก `OPENAI_API_KEY` หากการยิง API พลาด (Quota หมด) ระบบจะเรียกใช้กลไก Deterministic Fallback เพื่อจำลองข้อมูลร้านลง Database ให้หน้าเว็บเดินต่อได้
3. **การเข้าถึงแผนที่:** ติดตั้งระบบ Debounce Timeout อย่างน้อย 1 วินาทีในขณะลูกค้าพิมพ์ชื่อสาขา เพื่อป้องกันการโดน IP Block จาก OpenStreetMap (OSM)

---

**ทีมพัฒนาโครงสร้างพื้นฐาน CoffeeInsight AI**
