# custom_session_backend.py
from django.contrib.sessions.backends.db import SessionStore as DBStore
from django.db import DatabaseError, IntegrityError, router, transaction
from django.contrib.auth import get_user_model

class SessionStore(DBStore):
    def create(self):
        from our_core.our_middleware import RequestMiddleware
        request = RequestMiddleware(get_response=None)
        db = request.thread_local.db_name
        if db:
            self._session['database'] = db
        # يتم استدعاء هذا الدالة عند إنشاء جلسة جديدة
        super().create()
    def exists(self, session_key):
        
        return self.model.objects.filter(session_key=session_key).exists()

    def load_user_from_context(self):
        # يمكنك تحميل المستخدم من السياق الحالي هنا
        # على سبيل المثال، يمكنك استخدام request.user إذا كنت تستخدم Django
        return None  # يجب تحديدها بناءً على السياق الحالي

    def delete(self, session_key=None):
        # يتم استدعاء هذا الدالة عند حذف جلسة
        super().delete(session_key)
        # يمكنك إضافة السلوك الخاص بك هنا
