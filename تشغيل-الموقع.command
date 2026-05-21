#!/bin/zsh
# ============================================================
#  مداد — تشغيل الموقع محلياً
#  انقر مرتين على هذا الملف لفتح موقع مداد مع النماذج التفاعلية.
# ============================================================

# انتقل لمجلد الموقع
cd "$(dirname "$0")" || exit 1

# حمّل إعدادات الصدفة (للوصول إلى python/node إن وُجدت)
[ -f "$HOME/.zshrc" ] && source "$HOME/.zshrc" 2>/dev/null

PORT=8000

echo "──────────────────────────────────────────"
echo "   مداد — جارٍ تشغيل الموقع"
echo "   العنوان:  http://localhost:${PORT}/"
echo "   لإيقاف الموقع: أغلق هذه النافذة."
echo "──────────────────────────────────────────"

# افتح المتصفح تلقائياً بعد لحظة
( sleep 1.4 && open "http://localhost:${PORT}/index.html" ) &

# ابحث عن python3 وشغّل خادم ملفات بسيط
for PY in python3 /opt/anaconda3/bin/python3 /usr/bin/python3 /usr/local/bin/python3; do
  if command -v "$PY" >/dev/null 2>&1; then
    exec "$PY" -m http.server "$PORT"
  fi
done

# إن لم يوجد python، جرّب node
if command -v npx >/dev/null 2>&1; then
  exec npx --yes http-server -p "$PORT" -c-1 .
fi

echo ""
echo "⚠️  لم يتم العثور على python3 أو node على جهازك."
echo "    ثبّت أحدهما ثم أعد المحاولة."
read -r "?اضغط Enter للإغلاق..."
