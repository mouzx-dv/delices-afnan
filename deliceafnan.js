// ==========================================
// 1️⃣ التحكم في طرق اختيار المقاس وتبديل الواجهات
// ==========================================
const btnDimensions = document.getElementById('btnDimensions');
const btnGuests = document.getElementById('btnGuests');
const dimensionsSection = document.getElementById('dimensionsSection');
const guestsSection = document.getElementById('guestsSection');

if (btnDimensions && btnGuests && dimensionsSection && guestsSection) {
    btnDimensions.addEventListener('click', function() {
        btnDimensions.classList.add('active');
        btnGuests.classList.remove('active');
        dimensionsSection.style.display = 'block';
        guestsSection.style.display = 'none';
        updateSummary();
    });

    btnGuests.addEventListener('click', function() {
        btnGuests.classList.add('active');
        btnDimensions.classList.remove('active');
        dimensionsSection.style.display = 'none';
        guestsSection.style.display = 'block';
        updateSummary();
    });
}

// ==========================================
// 2️⃣ دالة التحديث الحي لملخص المواصفات (المطورة والمصلحة 100%)
// ==========================================
function updateSummary() {
    const sumShapeEl = document.getElementById('sumShape');
    const sumColorEl = document.getElementById('sumColor');
    const sumSizeEl = document.getElementById('sumSize');
    
    // جلب معرفات عناصر عرض التاريخ والوقت الجديدة المصلحة في الـ HTML
    const sumDateEl = document.getElementById('sumDate');
    const sumTimeEl = document.getElementById('sumTime');

    // جلب القيم الحالية من خانات الإدخال
    const cakeShape = document.getElementById('cakeShape')?.value || 'دائري كلاسيكي';
    const cakeColor = document.getElementById('cakeColor')?.value || 'حسب اختيارك الموضح';
    const dateValue = document.getElementById('dateInput')?.value || '[اختر التاريخ]';
    const timeValue = document.getElementById('timeInput')?.value || '[اختر الوقت]';
    
    let sizeText = '';
    const dimensionsSection = document.getElementById('dimensionsSection');
    const isDimensions = dimensionsSection && dimensionsSection.style.display === 'block';
    
    if (isDimensions) {
        const length = document.getElementById('cakeLength')?.value || '0';
        const width = document.getElementById('cakeWidth')?.value || '0';
        const height = document.getElementById('cakeHeight')?.value || 'طبقة واحدة';
        sizeText = `أبعادها ${length}×${width} سم (${height})`;
    } else {
        const guests = document.getElementById('guestsCount')?.value || '0';
        const slices = document.getElementById('slicesCount')?.value || '0';
        sizeText = `تكفي لـ ${guests} ضيف (مجهزة لـ ${slices} قطعة أكل)`;
    }

    // تحديث النصوص داخل الملخص الحي فوراً
    if (sumShapeEl) sumShapeEl.textContent = cakeShape;
    if (sumColorEl) sumColorEl.textContent = cakeColor.trim() !== '' ? cakeColor : 'حسب اختيارك الموضح';
    if (sumSizeEl) sumSizeEl.textContent = sizeText;
    if (sumDateEl) sumDateEl.textContent = dateValue;
    if (sumTimeEl) sumTimeEl.textContent = timeValue;
}

// دالة مساعدة لربط الأحداث بأمان دون التسبب في خطأ Null
function safeAddListener(id, event, callback) {
    const element = document.getElementById(id);
    if (element) {
        element.addEventListener(event, callback);
    }
}

// ربط جميع عناصر الإدخال القديمة والجديدة لتحديث الملخص تلقائياً عند أي تغيير
safeAddListener('cakeShape', 'change', updateSummary);
safeAddListener('cakeColor', 'input', updateSummary);
safeAddListener('cakeLength', 'input', updateSummary);
safeAddListener('cakeWidth', 'input', updateSummary);
safeAddListener('cakeHeight', 'change', updateSummary);
safeAddListener('guestsCount', 'input', updateSummary);
safeAddListener('slicesCount', 'input', updateSummary);

// إضافة مستمعات الأحداث لخانات التاريخ والوقت ليعمل التحديث الحي لحظياً
safeAddListener('dateInput', 'input', updateSummary);
safeAddListener('timeInput', 'input', updateSummary);

// ==========================================
// 3️⃣ معالجة إرسال الفورم وحفظ البيانات وتوجيه المستخدم
// ==========================================
const formElement = document.getElementById('cakeOrderForm');
if (formElement) {
    formElement.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('customerName')?.value || 'زبون مجهول';
        const phone = document.getElementById('customerPhone')?.value || 'لا يوجد رقم';
        const shape = document.getElementById('cakeShape')?.value || 'دائري كلاسيكي';
        const color = document.getElementById('cakeColor')?.value || 'حسب ذوق الوالدة';
        const notes = document.getElementById('cakeNotes')?.value || 'لا توجد ملاحظات إضافية';
        const dateValue = document.getElementById('dateInput')?.value || 'لم يحدد بعد';
        const timeValue = document.getElementById('timeInput')?.value || 'لم يحدد بعد';
        
        let sizeInfo = '';
        const dimensionsSection = document.getElementById('dimensionsSection');
        const isDimensions = dimensionsSection && dimensionsSection.style.display === 'block';
        
        if (isDimensions) {
            sizeInfo = `📐 الأبعاد: الطول ${document.getElementById('cakeLength')?.value || '0'}سم × العرض ${document.getElementById('cakeWidth')?.value || '0'}سم (${document.getElementById('cakeHeight')?.value || 'طبقة واحدة'})`;
        } else {
            sizeInfo = `👥 الحجم: مناسب لـ ${document.getElementById('guestsCount')?.value || '0'} ضيف (القطع المطلوبة: ${document.getElementById('slicesCount')?.value || '0'} قطعة)`;
        }

        const phoneCallUrl = "tel:+213697353007"; 
        const formspreeApiUrl = 'https://formspree.io/f/mrevqdpw';
        const ntfyTopic = "delices-afnan-ordrers";

        const ntfyMessage = `👤 الزبون: ${name}
📞 الهاتف: ${phone}
🎨 الشكل: ${shape} | اللون: ${color}
${sizeInfo}
📅 الاستلام: ${dateValue} في ${timeValue}
📝 ملاحظات: ${notes}`;

        // 1. إرسال الإشعار لـ ntfy عبر JSON لدعم النصوص العربية والرموز بأمان
        fetch('https://ntfy.sh', {
            method: 'POST',
            body: JSON.stringify({
                topic: ntfyTopic,
                title: '🎂 طلب كعكة جديد - Délices Afnan',
                message: ntfyMessage,
                priority: 4,
                tags: ['cake', 'bell']
            })
        }).catch(err => console.error('ntfy error:', err));

        // 2. إرسال البيانات لـ Formspree
        fetch(formspreeApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                "اسم الزبون": name,
                "رقم الهاتف": phone,
                "شكل الكعكة": shape,
                "الألوان والثيم": color,
                "المقاس والحجم": sizeInfo,
                "تاريخ الاستلام": dateValue,
                "وقت الاستلام": timeValue,
                "ملاحظات الزبون": notes
            })
        }).catch(error => console.error('Formspree error:', error));

        // 3. فتح الاتصال الهاتفي فوراً دون تعطيل إذن المستخدم
        window.location.href = phoneCallUrl;
    });
}
