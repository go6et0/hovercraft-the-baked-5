# 🎨 QUICK START - Бързо Редактиране

Следвайте тези стъпки за персонализацията на вашия сайт за 5 минути!

## 1. 🖼️ Добавяне на Снимки

1. Отворете папка `img` в проектната папка
2. Качете вашите снимки (JPG или PNG)
3. В `index.html` променете URL на снимката:

```html
<!-- Намерете и променете този ред -->
<img src="https://via.placeholder.com/400x300?text=Снимка+1" alt="Проект снимка 1">

<!-- На вашия файл -->
<img src="img/ваша-снимка.jpg" alt="Описание на снимката">
```

**Както за всички 6 снимки в галерията!**

---

## 2. 🎥 Добавяне на Видеа

Отворете `index.html` и намерете:
```html
<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"
```

Променете `dQw4w9WgXcQ` с ID на ваше видео:
- YouTube URL: `https://www.youtube.com/watch?v=**dQw4w9WgXcQ**`
- **dQw4w9WgXcQ** = ID което трябва

---

## 3. 👥 Добавяне на Членове на Екипа

Намерете в `index.html` секция `<!-- Team Section -->`:

```html
<div class="team-member">
    <img src="https://via.placeholder.com/150?text=Член+1" alt="Team member 1">
    <h3>Член 1</h3>
    <p>Лидер на Проекта</p>
    <div class="social-links">
        <a href="#"><i class="fab fa-linkedin"></i></a>
        <a href="#"><i class="fab fa-github"></i></a>
    </div>
</div>
```

Променете:
- `<h3>` - име на член
- `<p>` - роля на член
- `<img src=` - снимка на член
- `href="#"` - LinkedIn/GitHub линк

---

## 4. ✏️ Промяна на Текста

### Наслов на Проекта
Намерете строка 6 в `index.html`:
```html
<title>Университетски Проект - Портфолио</title>
```

Променете на вашия заголовок.

### За Проекта Секция
Намерете `<!-- About Section -->` и променете:
- `<h2>За Проекта</h2>` - заголовък
- `<h3>Описание</h3>` - подзаголовък
- `<p>` - главния текст

---

## 5. 🎨 Промяна на Цветовете

В `styles.css` променете цветовете:

```css
:root {
    --primary: #1e3a8a;        /* Синьо (наслови) */
    --accent: #3b82f6;          /* Светлосиньо (линкове) */
}
```

### Предложени комбинации:

**Професионално (синьо)**
```css
--primary: #1e3a8a;
--accent: #3b82f6;
```

**Технологично (пурпурно)**
```css
--primary: #6d28d9;
--accent: #a855f7;
```

**Съвременно (зелено)**
```css
--primary: #047857;
--accent: #10b981;
```

**Дръзко (оранжево)**
```css
--primary: #c2410c;
--accent: #f97316;
```

---

## 6. 📱 Тестиране Локално

Отворете `index.html` в браузър:
1. Намерете `index.html` на компютъра
2. Кликнете двойно върху него
3. Браузърът го отваря автоматично

---

## 7. 🌐 Развертане

Когато сте готови:
- Отворете `DEPLOYMENT.md`
- Следвайте инструкциите за GitHub Pages / Netlify / Vercel

---

## ⚡ Готови Примери

### Пълна Галерия Структура:
```html
<!-- Всяка снимка е един блок -->
<div class="gallery-item" onclick="openModal('img/снимка1.jpg')">
    <img src="img/снимка1.jpg" alt="Descripció">
    <div class="gallery-overlay">
        <i class="fas fa-expand"></i>
    </div>
</div>
```

### Пълна Видео Структура:
```html
<div class="video-item">
    <div class="video-container">
        <iframe src="https://www.youtube.com/embed/VIDEO_ID" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen></iframe>
    </div>
    <h3>Заголовък на Видеото</h3>
</div>
```

---

## ✅ Checklist за Завършване

- [ ] Добавени снимки в `img/` папка
- [ ] Актуализирани всички 6 снимки в галерията
- [ ] Добавени 3 YouTube видеа
- [ ] Актуализирана информацията за екипа
- [ ] Промененени заголовците и текстовете
- [ ] Цветовете отговарят на желаното
- [ ] Тестирано в браузър (локално)
- [ ] Готово за развертане!

---

## 🎉 Готово!

Вашия сайт е готов да впечата инженерите! Успех на защитата! 🚀

Ако имате въпроси, всички файлове са добре коментирани.
