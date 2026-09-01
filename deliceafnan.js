document.addEventListener('DOMContentLoaded', function () {
    // ==========================================
    // 1️⃣ التحكم في طرق اختيار المقاس وتبديل الواجهات
    // ==========================================
    const btnDimensions = document.getElementById('btnDimensions');
    const btnGuests = document.getElementById('btnGuests');
    const dimensionsSection = document.getElementById('dimensionsSection');
    const guestsSection = document.getElementById('guestsSection');

    if (btnDimensions && btnGuests && dimensionsSection && guestsSection) {
        btnDimensions.addEventListener('click', function (e) {
            e.preventDefault();
            btnDimensions.classList.add('active');
            btnGuests.classList.remove('active');
            dimensionsSection.style.display = 'block';
            guestsSection.style.display = 'none';
            updateSummary();
        });

        btnGuests.addEventListener('click', function (e) {
            e.preventDefault();
            btnGuests.classList.add('active');
            btnDimensions.classList.remove('active');
            dimensionsSection.style.display = 'none';
            guestsSection.style.display = 'block';
            updateSummary();
        });
    }

    // ==========================================
    // 2️⃣ دالة التحديث الحي لملخص المواصفات
    // ==========================================
    function updateSummary() {
        const sumShapeEl = document.getElementById('sumShape');
        const sumColorEl = document.getElementById('sumColor');
        const sumSizeEl = document.getElementById('sumSize');
        const sumDateEl = document.getElementById('sumDate');
        const sumTimeEl = document.getElementById('sumTime');

        const cakeShape = document.getElementById('cakeShape')?.value || 'دائري كلاسيكي';
        const cakeColor = document.getElementById('cakeColor')?.value || 'حسب اختيارك الموضح';
        const dateValue = document.getElementById('dateInput')?.value || '[اختر التاريخ]';
        const timeValue = document.getElementById('timeInput')?.value || '[اختر الوقت]';

        let sizeText = '';
        const isDimensions = dimensionsSection && dimensionsSection.style.display !== 'none';

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

        if (sumShapeEl) sumShapeEl.textContent = cakeShape;
        if (sumColorEl) sumColorEl.textContent = cakeColor.trim() !== '' ? cakeColor : 'حسب اختيارك الموضح';
        if (sumSizeEl) sumSizeEl.textContent = sizeText;
        if (sumDateEl) sumDateEl.textContent = dateValue;
        if (sumTimeEl) sumTimeEl.textContent = timeValue;
    }

    function safeAddListener(id, event, callback) {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener(event, callback);
        }
    }

    safeAddListener('cakeShape', 'change', updateSummary);
    safeAddListener('cakeColor', 'input', updateSummary);
    safeAddListener('cakeLength', 'input', updateSummary);
    safeAddListener('cakeWidth', 'input', updateSummary);
    safeAddListener('cakeHeight', 'change', updateSummary);
    safeAddListener('guestsCount', 'input', updateSummary);
    safeAddListener('slicesCount', 'input', updateSummary);
    safeAddListener('dateInput', 'input', updateSummary);
    safeAddListener('timeInput', 'input', updateSummary);

    // ==========================================
    // 3️⃣ معالجة إرسال الفورم وحفظ البيانات
    // ==========================================
    const formElement = document.getElementById('cakeOrderForm');
    if (formElement) {
        formElement.addEventListener('submit', async function (e) {
            e.preventDefault();

            const name = document.getElementById('customerName')?.value || 'زبون مجهول';
            const phone = document.getElementById('customerPhone')?.value || 'لا يوجد رقم';
            const shape = document.getElementById('cakeShape')?.value || 'دائري كلاسيكي';
            const color = document.getElementById('cakeColor')?.value || 'حسب ذوق الوالدة';
            const notes = document.getElementById('cakeNotes')?.value || 'لا توجد ملاحظات إضافية';
            const dateValue = document.getElementById('dateInput')?.value || 'لم يحدد بعد';
            const timeValue = document.getElementById('timeInput')?.value || 'لم يحدد بعد';

            let sizeInfo = '';
            const isDimensions = dimensionsSection && dimensionsSection.style.display !== 'none';

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

            // إرسال الإشعار الفوري لتطبيق ntfy
            try {
                await fetch('https://ntfy.sh', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        topic: ntfyTopic,
                        title: '🎂 طلب كعكة جديد - Délices Afnan',
                        message: ntfyMessage,
                        priority: 4,
                        tags: ['cake', 'bell']
                    })
                });
            } catch (err) {
                console.error('ntfy error:', err);
            }

            // إرسال البيانات للأرشفة في Formspree
            try {
                await fetch(formspreeApiUrl, {
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
                });
            } catch (error) {
                console.error('Formspree error:', error);
            }

            // التوجيه للاتصال
            window.location.href = phoneCallUrl;
        });
    }
});
