/* ============================================
   LANGY i18n — Internationalization System
   Supports: English (default), Russian, Spanish
   Usage: i18n('key') returns the translated string
   ============================================ */

const LangyI18n = {
    currentLang: 'en',

    // All translatable UI strings
    translations: {
        // ─── General ───
        'app.name': { en: 'Langy AI', ru: 'Langy AI', es: 'Langy AI' },
        'general.back': { en: 'Back', ru: 'Назад', es: 'Atrás' },
        'general.start': { en: 'Start', ru: 'Начать', es: 'Empezar' },
        'general.continue': { en: 'Continue', ru: 'Продолжить', es: 'Continuar' },
        'general.next': { en: 'Next', ru: 'Далее', es: 'Siguiente' },
        'general.done': { en: 'Done', ru: 'Готово', es: 'Hecho' },
        'general.cancel': { en: 'Cancel', ru: 'Отмена', es: 'Cancelar' },
        'general.save': { en: 'Save', ru: 'Сохранить', es: 'Guardar' },
        'general.close': { en: 'Close', ru: 'Закрыть', es: 'Cerrar' },
        'common.got_it': { en: 'Got it', ru: 'Понятно', es: 'Entendido' },
        'nav.home': { en: 'Home', ru: 'Главная', es: 'Inicio' },
        'nav.learn': { en: 'Learn', ru: 'Учиться', es: 'Aprender' },
        'nav.talk': { en: 'Talk', ru: 'Чат', es: 'Hablar' },
        'nav.profile': { en: 'Profile', ru: 'Профиль', es: 'Perfil' },
        'general.loading': { en: 'Loading...', ru: 'Загрузка...', es: 'Cargando...' },
        'general.error': { en: 'Something went wrong', ru: 'Что-то пошло не так', es: 'Algo salió mal' },
        'general.yes': { en: 'Yes', ru: 'Да', es: 'Sí' },
        'general.no': { en: 'No', ru: 'Нет', es: 'No' },
        'general.details': { en: 'Details', ru: 'Подробнее', es: 'Detalles' },
        'general.level': { en: 'Level', ru: 'Уровень', es: 'Nivel' },

        // ─── Auth ───
        'auth.title': { en: 'Learn a Language', ru: 'Учите языки', es: 'Aprende un idioma' },
        'auth.subtitle': {
            en: 'Your AI-powered language journey',
            ru: 'Ваш ИИ-помощник в изучении языка',
            es: 'Tu viaje lingüístico con IA',
        },
        'auth.login': { en: 'Log In', ru: 'Войти', es: 'Iniciar Sesión' },
        'auth.register': { en: 'Sign Up', ru: 'Регистрация', es: 'Registrarse' },
        'auth.email': { en: 'Email', ru: 'Эл. почта', es: 'Correo electrónico' },
        'auth.password': { en: 'Password', ru: 'Пароль', es: 'Contraseña' },
        'auth.name': { en: 'Your Name', ru: 'Ваше имя', es: 'Tu nombre' },
        'auth.forgot': { en: 'Forgot password?', ru: 'Забыли пароль?', es: '¿Olvidaste tu contraseña?' },
        'auth.no_account': { en: "Don't have an account?", ru: 'Нет аккаунта?', es: '¿No tienes cuenta?' },
        'auth.have_account': { en: 'Already have an account?', ru: 'Уже есть аккаунт?', es: '¿Ya tienes cuenta?' },

        // ─── Home ───
        'home.streak': { en: 'Day Streak!', ru: 'Дней подряд!', es: '¡Días seguidos!' },
        'home.continue': { en: 'Continue Course', ru: 'Продолжить курс', es: 'Continuar Curso' },
        'home.homework': { en: 'Homework', ru: 'Домашка', es: 'Tarea' },
        'home.homework_desc': { en: 'Tasks & practice', ru: 'Задания и практика', es: 'Tareas y práctica' },
        'home.tests': { en: 'Tests', ru: 'Тесты', es: 'Pruebas' },
        'home.tests_desc': { en: 'Scores & progress', ru: 'Оценки и прогресс', es: 'Puntuaciones y progreso' },
        'home.talk': { en: 'Talk', ru: 'Разговор', es: 'Hablar' },
        'home.talk_desc': { en: 'Voice practice', ru: 'Голосовая практика', es: 'Práctica de voz' },
        'home.events': { en: 'Events', ru: 'Ивенты', es: 'Eventos' },
        'home.events_desc': { en: 'Challenges', ru: 'Челленджи', es: 'Desafíos' },
        'home.duels': { en: 'Duels', ru: 'Дуэли', es: 'Duelos' },
        'home.duels_desc': { en: 'Compete', ru: 'Соревнуйся', es: 'Compite' },
        'home.shop': { en: 'Shop', ru: 'Магазин', es: 'Tienda' },
        'home.shop_desc': { en: 'Rewards', ru: 'Награды', es: 'Recompensas' },
        'home.daily': { en: 'Daily Challenge', ru: 'Ежедневный вызов', es: 'Reto Diario' },
        'home.lesson_label': { en: 'Lesson', ru: 'Урок', es: 'Lección' },
        'home.unit_prefix': { en: 'Unit', ru: 'Юнит', es: 'Unidad' },
        'home.lesson_start': { en: 'Start lesson', ru: 'Начать урок', es: 'Empezar lección' },
        'home.lesson_continue': { en: 'Continue lesson', ru: 'Продолжить урок', es: 'Continuar lección' },
        'home.lesson_about_minutes': { en: 'about {minutes} min', ru: 'около {minutes} мин', es: 'unos {minutes} min' },
        'home.lesson_resume_state': {
            en: 'In progress: {current}/{total}',
            ru: 'В процессе: {current}/{total}',
            es: 'En curso: {current}/{total}',
        },
        'home.lesson_goal_fallback': {
            en: 'Build the next core skill in your English course',
            ru: 'Освой следующий ключевой навык английского курса',
            es: 'Desarrolla la siguiente habilidad clave del curso',
        },
        'home.secondary_cta': { en: 'Optional', ru: 'По желанию', es: 'Opcional' },
        'home.talk_with': { en: 'Talk with {mascot}', ru: 'Разговор с {mascot}', es: 'Habla con {mascot}' },
        'home.talk_default_topic': { en: 'Speaking practice', ru: 'Разговорная практика', es: 'Práctica oral' },
        'home.talk_subtitle': {
            en: 'Choose free talk, lesson practice, recent mistakes, or a short scenario.',
            ru: 'Выбери свободный разговор, тему урока, недавние ошибки или короткий сценарий.',
            es: 'Elige charla libre, tema de la lección, errores recientes o un escenario corto.',
        },
        'home.talk_free': { en: 'Free talk', ru: 'Свободно', es: 'Libre' },
        'home.talk_lesson': { en: 'Lesson topic', ru: 'Тема урока', es: 'Tema' },
        'home.talk_mistakes': { en: 'Mistakes', ru: 'Ошибки', es: 'Errores' },
        'home.talk_scenario': { en: '3-5 min scenario', ru: 'Сценарий 3-5 мин', es: 'Escenario 3-5 min' },
        'home.talk_resume': { en: 'Resume', ru: 'Продолжить', es: 'Continuar' },
        'home.course_structured': { en: 'Structured', ru: 'Структурный', es: 'Estructurado' },
        'home.course_track_desc': {
            en: 'CEFR-aligned structured English track',
            ru: 'Структурированный курс английского по CEFR',
            es: 'Curso estructurado de inglés alineado con CEFR',
        },
        'home.course_feature_cefr': { en: 'CEFR curriculum A1-C2', ru: 'CEFR-программа A1-C2', es: 'Programa CEFR A1-C2' },
        'home.course_feature_grammar': { en: 'Grammar-aware coaching', ru: 'Грамматический коучинг', es: 'Coaching gramatical' },
        'home.course_feature_vocab': { en: 'Vocabulary progression', ru: 'Словарный прогресс', es: 'Progreso de vocabulario' },
        'home.course_feature_tutor': { en: 'Tutor-led speaking', ru: 'Разговор с репетитором', es: 'Práctica oral con tutor' },
        'home.level_progress': { en: 'Level progress', ru: 'Прогресс уровня', es: 'Progreso del nivel' },
        'home.current_unit': { en: 'Current unit', ru: 'Текущий юнит', es: 'Unidad actual' },
        'home.view_course_map': { en: 'Open course map', ru: 'Открыть карту курса', es: 'Abrir mapa del curso' },

        // ─── Learning ───
        'learn.title': { en: 'Lesson', ru: 'Урок', es: 'Lección' },
        'learn.theory': { en: 'Theory', ru: 'Теория', es: 'Teoría' },
        'learn.practice': { en: 'Practice', ru: 'Практика', es: 'Práctica' },
        'learn.complete': { en: 'Lesson Complete!', ru: 'Урок завершён!', es: '¡Lección completada!' },
        'learn.check': { en: 'Check', ru: 'Проверить', es: 'Comprobar' },
        'learn.correct': { en: 'Correct!', ru: 'Правильно!', es: '¡Correcto!' },
        'learn.wrong': { en: 'Not quite right', ru: 'Не совсем верно', es: 'No del todo correcto' },
        'learn.score': { en: 'Score', ru: 'Результат', es: 'Puntuación' },
        'learn.xp_earned': { en: 'XP earned', ru: 'XP заработано', es: 'XP ganado' },
        'learn.next_lesson': { en: 'Next Lesson', ru: 'Следующий урок', es: 'Siguiente Lección' },
        'learn.try_again': { en: 'Try Again', ru: 'Повторить', es: 'Intentar de Nuevo' },
        'learn.skip': { en: 'Skip', ru: 'Пропустить', es: 'Saltar' },
        'learn.minutes': { en: 'minutes', ru: 'минут', es: 'minutos' },
        'learn.exercises': { en: 'exercises', ru: 'заданий', es: 'ejercicios' },
        'learn.start_lesson': { en: 'Start Lesson', ru: 'Начать урок', es: 'Iniciar Lección' },
        'learn.exercise_counter': {
            en: 'Exercise {n} of {total}',
            ru: 'Задание {n} из {total}',
            es: 'Ejercicio {n} de {total}',
        },
        'learn.ask_ai': { en: 'Ask AI for help', ru: 'Спросить ИИ', es: 'Preguntar a la IA' },
        'learn.finish': { en: 'Finish', ru: 'Завершить', es: 'Terminar' },
        'learn.weak_topics': { en: 'Weak Topics', ru: 'Слабые темы', es: 'Temas Débiles' },
        'learn.quick_review': { en: 'Quick Review', ru: 'Быстрый повтор', es: 'Repaso Rápido' },
        'learn.excellent': { en: 'Excellent!', ru: 'Отлично!', es: '¡Excelente!' },
        'learn.good_try': { en: 'Good try!', ru: 'Хорошая попытка!', es: '¡Buen intento!' },
        'learn.accuracy': { en: 'Accuracy', ru: 'Точность', es: 'Precisión' },
        'learn.time': { en: 'Time', ru: 'Время', es: 'Tiempo' },
        'learn.topics': { en: 'topics', ru: 'тем', es: 'temas' },
        'learn.to_practice': { en: 'Practice', ru: 'К упражнениям', es: 'Practicar' },
        'learn.next': { en: 'Next', ru: 'Далее', es: 'Siguiente' },
        'learn.next_topic': { en: 'Next Topic', ru: 'Следующая тема', es: 'Siguiente Tema' },
        'learn.topic_mastered': { en: 'Topic Mastered!', ru: 'Тема усвоена!', es: '¡Tema Dominado!' },
        'learn.review_theory': { en: 'Review Theory', ru: 'Повторить теорию', es: 'Repasar Teoría' },
        'learn.all_mastered': {
            en: 'All topics mastered!',
            ru: 'Все темы усвоены!',
            es: '¡Todos los temas dominados!',
        },
        'learn.topics_reviewed': { en: 'Topics reviewed', ru: 'Повторено тем', es: 'Temas repasados' },
        'results.home': { en: 'Home', ru: 'На главную', es: 'Inicio' },
        // ─── Profile ───
        'profile.title': { en: 'Profile', ru: 'Профиль', es: 'Perfil' },
        'profile.edit': { en: 'Edit Profile', ru: 'Редактировать', es: 'Editar Perfil' },
        'profile.settings': { en: 'Settings', ru: 'Настройки', es: 'Ajustes' },
        'profile.dark_mode': { en: 'Dark Mode', ru: 'Тёмная тема', es: 'Modo Oscuro' },
        'profile.sound': { en: 'Sound Effects', ru: 'Звуковые эффекты', es: 'Efectos de Sonido' },
        'profile.language': { en: 'Interface Language', ru: 'Язык интерфейса', es: 'Idioma de Interfaz' },
        'profile.logout': { en: 'Log Out', ru: 'Выйти', es: 'Cerrar Sesión' },
        'profile.stats': { en: 'Statistics', ru: 'Статистика', es: 'Estadísticas' },
        'profile.badges': { en: 'CEFR Badges', ru: 'Бейджи CEFR', es: 'Insignias CEFR' },
        'profile.certificates': { en: 'Certificates', ru: 'Сертификаты', es: 'Certificados' },
        'profile.textbooks': { en: 'Textbooks', ru: 'Учебники', es: 'Libros de Texto' },
        'profile.subscription': { en: 'Langy Coach', ru: 'Langy Coach', es: 'Langy Coach' },
        'profile.reminder': { en: 'Daily Reminder', ru: 'Напоминание', es: 'Recordatorio Diario' },
        'profile.save_changes': { en: 'Save Changes', ru: 'Сохранить изменения', es: 'Guardar Cambios' },

        // ─── Streak ───
        'streak.title': { en: 'Your Streak', ru: 'Ваш стрик', es: 'Tu Racha' },
        'streak.days': { en: 'days', ru: 'дней', es: 'días' },
        'streak.longest': { en: 'Longest', ru: 'Лучший', es: 'Más largo' },
        'streak.freeze': { en: 'Streak Freeze', ru: 'Заморозка стрика', es: 'Congelar Racha' },
        'streak.total_sessions': { en: 'Total Sessions', ru: 'Всего сессий', es: 'Sesiones Totales' },
        'streak.total_time': { en: 'Total Time', ru: 'Общее время', es: 'Tiempo Total' },
        'streak.words_learned': { en: 'Words Learned', ru: 'Слов выучено', es: 'Palabras Aprendidas' },
        'streak.avg_accuracy': { en: 'Avg Accuracy', ru: 'Ср. точность', es: 'Precisión Prom.' },

        // ─── Events ───
        'events.title': { en: 'Events', ru: 'Ивенты', es: 'Eventos' },
        'events.active': { en: 'Active Challenges', ru: 'Активные челленджи', es: 'Desafíos Activos' },
        'events.complete_to_earn': {
            en: 'Complete challenges to earn rewards!',
            ru: 'Выполняйте челленджи, чтобы получить награды!',
            es: '¡Completa desafíos para ganar recompensas!',
        },
        'events.claim': { en: 'Claim!', ru: 'Забрать!', es: '¡Reclamar!' },
        'events.claimed': { en: 'Claimed', ru: 'Получено', es: 'Reclamado' },
        'events.play': { en: 'Play', ru: 'Играть', es: 'Jugar' },
        'events.vocab_marathon': { en: 'Vocabulary Marathon', ru: 'Марафон словаря', es: 'Maratón de Vocabulario' },
        'events.lesson_sprint': { en: 'Learning Sprint', ru: 'Спринт обучения', es: 'Sprint de Aprendizaje' },
        'events.dedication': { en: 'Dedication Week', ru: 'Неделя упорства', es: 'Semana de Dedicación' },
        'events.iron_streak': { en: 'Iron Will', ru: 'Железная воля', es: 'Voluntad de Hierro' },
        'events.speed_sprint': { en: 'Speed Sprint', ru: 'Скоростной спринт', es: 'Sprint Rápido' },
        'events.perfectionist': { en: 'Perfectionist', ru: 'Перфекционист', es: 'Perfeccionista' },

        // ─── Daily Challenge ───
        'daily.title': { en: 'Daily Challenge', ru: 'Ежедневный вызов', es: 'Reto Diario' },
        'daily.all_done': { en: 'All tasks done!', ru: 'Все задания выполнены!', es: '¡Todas las tareas hechas!' },
        'daily.mission': { en: "Today's Mission", ru: 'Задание на сегодня', es: 'Misión del Día' },
        'daily.come_back': {
            en: 'Come back tomorrow for new challenges!',
            ru: 'Завтра будут новые задания!',
            es: '¡Vuelve mañana para nuevos desafíos!',
        },
        'daily.complete_all': {
            en: 'Complete all tasks to earn your reward!',
            ru: 'Выполните все задания, чтобы получить награду!',
            es: '¡Completa todas las tareas para obtener tu recompensa!',
        },
        'daily.complete_lessons': {
            en: 'Focus: Complete Lessons',
            ru: 'Фокус: Завершите уроки',
            es: 'Enfoque: Completar Lecciones',
        },
        'daily.vocabulary': { en: 'Vocabulary Expansion', ru: 'Расширение словаря', es: 'Expansión de Vocabulario' },
        'daily.commitment': { en: 'Commitment', ru: 'Целеустремлённость', es: 'Compromiso' },
        'daily.perfect': {
            en: 'Mastery: Perfect Lesson',
            ru: 'Мастерство: Идеальный урок',
            es: 'Maestría: Lección Perfecta',
        },

        // ─── Talk ───
        'talk.title': { en: 'Langy Talk', ru: 'Langy Talk', es: 'Langy Talk' },
        'talk.hero_title': { en: 'Talk with a Native Speaker', ru: 'Разговор с носителем', es: 'Habla con un Nativo' },
        'talk.hero_desc': {
            en: 'Practice real conversations using your voice',
            ru: 'Практикуйте реальные разговоры голосом',
            es: 'Practica conversaciones reales con tu voz',
        },
        'talk.choose_partner': { en: 'Choose Your Partner', ru: 'Выберите партнёра', es: 'Elige tu Compañero' },
        'talk.choose_scenario': { en: 'Choose a Scenario', ru: 'Выберите сценарий', es: 'Elige un Escenario' },
        'talk.start': { en: 'Start Conversation', ru: 'Начать разговор', es: 'Iniciar Conversación' },
        'talk.mic_hint': {
            en: 'Requires microphone access',
            ru: 'Требуется доступ к микрофону',
            es: 'Requiere acceso al micrófono',
        },
        'talk.listening': { en: 'Listening...', ru: 'Слушаю...', es: 'Escuchando...' },
        'talk.thinking': { en: 'is thinking...', ru: 'думает...', es: 'está pensando...' },
        'talk.speaking': { en: 'is speaking...', ru: 'говорит...', es: 'está hablando...' },
        'talk.your_turn': {
            en: 'Your turn — tap mic to speak',
            ru: 'Ваш ход — нажмите микрофон',
            es: 'Tu turno — toca el micrófono',
        },
        'talk.end': { en: 'End', ru: 'Завершить', es: 'Terminar' },

        // ─── Shop ───
        'shop.title': { en: 'Shop', ru: 'Магазин', es: 'Tienda' },
        'shop.buy': { en: 'Buy', ru: 'Купить', es: 'Comprar' },
        'shop.owned': { en: 'Owned', ru: 'Куплено', es: 'Comprado' },

        // ─── Subscription ───
        'sub.title': { en: 'Langy Coach', ru: 'Langy Coach', es: 'Langy Coach' },
        'sub.monthly': { en: 'Monthly', ru: 'Месячная', es: 'Mensual' },
        'sub.yearly': { en: 'Yearly', ru: 'Годовая', es: 'Anual' },
        'sub.best_value': { en: 'Best Value', ru: 'Лучшая цена', es: 'Mejor Valor' },

        // ─── Results ───
        'results.title': { en: 'Lesson Complete!', ru: 'Урок завершён!', es: '¡Lección Completada!' },
        'results.great': { en: 'Great job!', ru: 'Отличная работа!', es: '¡Buen trabajo!' },
        'results.home': { en: 'Back to Home', ru: 'На главную', es: 'Ir al Inicio' },

        // ─── Sprint ───
        'sprint.title': { en: 'Speed Sprint', ru: 'Скоростной спринт', es: 'Sprint Rápido' },
        'sprint.complete': { en: 'Sprint Complete!', ru: 'Спринт завершён!', es: '¡Sprint Completado!' },
        'sprint.times_up': { en: "Time's Up!", ru: 'Время вышло!', es: '¡Se acabó el tiempo!' },
        'sprint.correct': { en: 'Correct', ru: 'Верно', es: 'Correctas' },
        'sprint.time_used': { en: 'Time used', ru: 'Затрачено', es: 'Tiempo usado' },
        'sprint.try_again': { en: 'Try Again', ru: 'Ещё раз', es: 'Intentar de Nuevo' },
        'sprint.back': { en: 'Back to Events', ru: 'К ивентам', es: 'Volver a Eventos' },

        // ─── Onboarding ───
        'onboard.select_lang': { en: 'Interface Language', ru: 'Язык интерфейса', es: 'Idioma de Interfaz' },
        'onboard.why_learn': {
            en: 'Why are you learning?',
            ru: 'Зачем вы учите язык?',
            es: '¿Por qué estás aprendiendo?',
        },
        'onboard.travel': { en: 'Travel', ru: 'Путешествия', es: 'Viajes' },
        'onboard.work': { en: 'Work & Career', ru: 'Работа и карьера', es: 'Trabajo y Carrera' },
        'onboard.study': { en: 'Study Abroad', ru: 'Учёба за рубежом', es: 'Estudiar en el Extranjero' },
        'onboard.fun': { en: 'Just for Fun', ru: 'Для себя', es: 'Solo por Diversión' },

        // ─── Homework ───
        'hw.title': { en: 'Homework', ru: 'Домашнее задание', es: 'Tarea' },
        'hw.no_tasks': { en: 'No homework yet', ru: 'Пока нет заданий', es: 'Aún no hay tareas' },
        'hw.writing': { en: 'Writing Analysis', ru: 'Анализ письма', es: 'Análisis de Escritura' },

        // ─── Level-up ───
        'levelup.title': { en: 'Level Up!', ru: 'Новый уровень!', es: '¡Subiste de Nivel!' },
        'levelup.reached': {
            en: "You've reached a new level!",
            ru: 'Вы достигли нового уровня!',
            es: '¡Has alcanzado un nuevo nivel!',
        },
        'levelup.awesome': { en: 'Awesome!', ru: 'Отлично!', es: '¡Increíble!' },

        // ─── Profile Extended ───
        'profile.achievements': { en: 'Achievements', ru: 'Достижения', es: 'Logros' },
        'profile.account': { en: 'Account', ru: 'Аккаунт', es: 'Cuenta' },
        'profile.edit_desc': { en: 'Name, avatar, email', ru: 'Имя, аватар, почта', es: 'Nombre, avatar, email' },
        'profile.language_level': { en: 'Language Level', ru: 'Уровень языка', es: 'Nivel de Idioma' },
        'profile.preferences': { en: 'Preferences', ru: 'Настройки', es: 'Preferencias' },
        'profile.light_mode': { en: 'Light Mode', ru: 'Светлая тема', es: 'Modo Claro' },
        'profile.current_theme': { en: 'Current theme', ru: 'Текущая тема', es: 'Tema actual' },
        'profile.notifications': { en: 'Notifications', ru: 'Уведомления', es: 'Notificaciones' },
        'profile.sounds_desc': { en: 'In-app sounds', ru: 'Звуки в приложении', es: 'Sonidos de la app' },
        'profile.haptics': { en: 'Haptic Feedback', ru: 'Виброотклик', es: 'Respuesta Háptica' },
        'profile.haptics_desc': {
            en: 'Vibration on interactions',
            ru: 'Вибрация при нажатии',
            es: 'Vibración al interactuar',
        },
        'profile.learning': { en: 'Learning', ru: 'Обучение', es: 'Aprendizaje' },
        'profile.daily_goal': { en: 'Daily Goal', ru: 'Дневная цель', es: 'Objetivo Diario' },
        'profile.daily_goal_desc': { en: '15 minutes per day', ru: '15 минут в день', es: '15 minutos al día' },
        'profile.support': { en: 'Support', ru: 'Поддержка', es: 'Soporte' },
        'profile.help': { en: 'Help & FAQ', ru: 'Помощь и FAQ', es: 'Ayuda y FAQ' },
        'profile.feedback': { en: 'Send Feedback', ru: 'Отправить отзыв', es: 'Enviar Comentarios' },
        'profile.community': { en: 'Community', ru: 'Сообщество', es: 'Comunidad' },
        'profile.invite': { en: 'Invite Friends', ru: 'Пригласить друзей', es: 'Invitar Amigos' },
        'profile.invite_desc': { en: 'Get 500 Dangy', ru: 'Получите 500 Дэнги', es: 'Obtén 500 Dangy' },

        // ─── Bottom Nav ───
        'nav.home': { en: 'Home', ru: 'Главная', es: 'Inicio' },
        'nav.learn': { en: 'Learn', ru: 'Учиться', es: 'Aprender' },
        'nav.talk': { en: 'Talk', ru: 'Говорить', es: 'Hablar' },
        'nav.events': { en: 'Events', ru: 'Ивенты', es: 'Eventos' },
        'nav.profile': { en: 'Profile', ru: 'Профиль', es: 'Perfil' },

        // ─── Daily Challenge ───
        'daily.title': { en: 'Daily Challenge', ru: 'Ежедневный вызов', es: 'Desafío Diario' },
        'daily.mission': { en: "Today's Mission", ru: 'Миссия дня', es: 'Misión del Día' },
        'daily.all_done': { en: 'All tasks done!', ru: 'Все задания выполнены!', es: '¡Todas las tareas hechas!' },
        'daily.come_back': {
            en: 'Come back tomorrow for new challenges!',
            ru: 'Возвращайтесь завтра за новыми заданиями!',
            es: '¡Vuelve mañana para nuevos desafíos!',
        },
        'daily.complete_all': {
            en: 'Complete all tasks to earn your reward!',
            ru: 'Выполните все задания, чтобы получить награду!',
            es: '¡Completa todas las tareas para ganar tu recompensa!',
        },

        // ─── Events ───
        'events.title': { en: 'Events', ru: 'Ивенты', es: 'Eventos' },
        'events.active': { en: 'Active Challenges', ru: 'Активные вызовы', es: 'Desafíos Activos' },
        'events.complete_to_earn': {
            en: 'Complete challenges to earn rewards!',
            ru: 'Выполняйте задания и получайте награды!',
            es: '¡Completa desafíos para ganar recompensas!',
        },
        'events.claimed': { en: 'Claimed', ru: 'Получено', es: 'Reclamado' },
        'events.claim': { en: 'Claim!', ru: 'Забрать!', es: '¡Reclamar!' },
        'events.play': { en: 'Play', ru: 'Играть', es: 'Jugar' },
        'events.vocab_marathon': { en: 'Vocabulary Marathon', ru: 'Марафон слов', es: 'Maratón de Vocabulario' },
        'events.lesson_sprint': { en: 'Learning Sprint', ru: 'Учебный спринт', es: 'Sprint de Aprendizaje' },
        'events.dedication': { en: 'Dedication Week', ru: 'Неделя упорства', es: 'Semana de Dedicación' },
        'events.iron_streak': { en: 'Iron Will', ru: 'Железная воля', es: 'Voluntad de Hierro' },
        'events.speed_sprint': { en: 'Speed Sprint', ru: 'Скоростной спринт', es: 'Sprint de Velocidad' },
        'events.perfectionist': { en: 'Perfectionist', ru: 'Перфекционист', es: 'Perfeccionista' },

        // ─── Sprint ───
        'sprint.title': { en: 'Speed Sprint', ru: 'Скоростной спринт', es: 'Sprint de Velocidad' },
        'sprint.correct': { en: 'correct', ru: 'правильно', es: 'correctas' },
        'sprint.complete': { en: 'Sprint Complete!', ru: 'Спринт завершён!', es: '¡Sprint Completado!' },
        'sprint.times_up': { en: "Time's Up!", ru: 'Время вышло!', es: '¡Se acabó el tiempo!' },
        'sprint.time_used': { en: 'Time used', ru: 'Время', es: 'Tiempo' },
        'sprint.back': { en: 'Back to Events', ru: 'К ивентам', es: 'Volver a Eventos' },
        'sprint.try_again': { en: 'Try Again', ru: 'Ещё раз', es: 'Intentar de Nuevo' },

        // ─── Streak ───
        'streak.title': { en: 'Streak & Stats', ru: 'Стрик и статистика', es: 'Racha y Estadísticas' },
        'streak.total_sessions': { en: 'Total Sessions', ru: 'Всего сессий', es: 'Sesiones Totales' },
        'streak.total_time': { en: 'Total Time', ru: 'Общее время', es: 'Tiempo Total' },
        'streak.words_learned': { en: 'Words Learned', ru: 'Слов изучено', es: 'Palabras Aprendidas' },
        'streak.avg_accuracy': { en: 'Avg Accuracy', ru: 'Ср. точность', es: 'Precisión Prom.' },
        'streak.freeze': { en: 'Streak Freeze', ru: 'Заморозка стрика', es: 'Congelar Racha' },

        // ─── Shop ───
        'shop.title': { en: 'Shop', ru: 'Магазин', es: 'Tienda' },

        // ─── Homework ───
        'hw.title': { en: 'Homework', ru: 'Домашка', es: 'Tarea' },

        // ─── Onboarding ───
        'onboarding.lets_go': { en: "Let's go!", ru: 'Начнём!', es: '¡Empecemos!' },
        'onboarding.step': { en: 'Step', ru: 'Шаг', es: 'Paso' },
        'onboarding.interests_title': { en: 'What interests you?', ru: 'Что тебе интересно?', es: '¿Qué te interesa?' },
        'onboarding.interests_desc': {
            en: 'Choose topics for your lessons. You can select multiple.',
            ru: 'Выбери темы, на которых мы будем строить уроки. Можно выбрать несколько.',
            es: 'Elige temas para tus lecciones. Puedes seleccionar varios.',
        },
        'onboarding.selected': { en: 'selected', ru: 'выбрано', es: 'seleccionado(s)' },
        'onboarding.choose_teacher': { en: 'Choose your teacher', ru: 'Выбери преподавателя', es: 'Elige tu profesor' },
        'onboarding.mascot_desc': {
            en: 'Each mascot has its own personality and teaching style',
            ru: 'Каждый маскот имеет свой характер и стиль обучения',
            es: 'Cada mascota tiene su personalidad y estilo de enseñanza',
        },
        'onboarding.start_test': { en: 'Start Level Test!', ru: 'Начать тест уровня!', es: '¡Comenzar test de nivel!' },
        'onboarding.is_teacher': { en: 'is your teacher!', ru: 'будет твоим учителем!', es: '¡es tu profesor!' },

        // ─── Widgets (Exercises) ───
        'widget.arrange_words': {
            en: 'Arrange the words into a sentence',
            ru: 'Составьте предложение из слов',
            es: 'Ordena las palabras en una oración',
        },
        'widget.tap_words': { en: 'Tap the words...', ru: 'Нажмите на слова...', es: 'Toca las palabras...' },
        'widget.check': { en: 'Check', ru: 'Проверить', es: 'Comprobar' },
        'widget.choose_answer': {
            en: 'Choose the correct answer',
            ru: 'Выберите правильный ответ',
            es: 'Elige la respuesta correcta',
        },
        'widget.match_pairs': { en: 'Match the pairs', ru: 'Соедините пары', es: 'Une las parejas' },
        'widget.errors': { en: 'errors', ru: 'ошибок', es: 'errores' },
        'widget.listen_type': { en: 'Listen and type', ru: 'Прослушайте и введите', es: 'Escucha y escribe' },
        'widget.listen': { en: 'Listen', ru: 'Прослушать', es: 'Escuchar' },
        'widget.type_heard': {
            en: 'Type what you heard...',
            ru: 'Введите услышанное...',
            es: 'Escribe lo que oíste...',
        },
        'widget.translate': { en: 'Translate', ru: 'Переведите', es: 'Traduce' },
        'widget.your_translation': { en: 'Your translation...', ru: 'Ваш перевод...', es: 'Tu traducción...' },
        'widget.say_aloud': { en: 'Say it aloud', ru: 'Произнесите вслух', es: 'Dilo en voz alta' },
        'widget.tap_mic': { en: 'Tap the mic to start', ru: 'Нажмите на микрофон', es: 'Toca el micro para empezar' },
        'widget.speech_not_supported': {
            en: 'Speech recognition is not supported in this browser',
            ru: 'Распознавание речи не поддерживается в этом браузере',
            es: 'El reconocimiento de voz no es compatible con este navegador',
        },
        'widget.speaking': { en: 'Speaking...', ru: 'Говорите...', es: 'Habla...' },
        'widget.recognition_failed': {
            en: 'Could not recognize. Try again.',
            ru: 'Не удалось распознать. Попробуйте ещё раз.',
            es: 'No se pudo reconocer. Inténtalo de nuevo.',
        },
        'widget.read_answer': { en: 'Read and answer', ru: 'Прочитайте и ответьте', es: 'Lee y responde' },
        'widget.choose_image': {
            en: 'Choose the correct image',
            ru: 'Выберите правильную картинку',
            es: 'Elige la imagen correcta',
        },
        'widget.correct': { en: 'Correct!', ru: 'Правильно!', es: '¡Correcto!' },
        'widget.answer_was': { en: 'Answer', ru: 'Ответ', es: 'Respuesta' },

        // ─── Duels ───
        'duels.title': { en: 'Language Duels', ru: 'Языковые дуэли', es: 'Duelos de Idiomas' },
        'duels.choose_mode': { en: 'Choose Your Mode', ru: 'Выбери режим', es: 'Elige tu modo' },
        'duels.challenge': { en: 'Challenge other learners!', ru: 'Бросай вызов другим!', es: '¡Desafía a otros!' },
        'duels.wins': { en: 'Wins', ru: 'Победы', es: 'Victorias' },
        'duels.losses': { en: 'Losses', ru: 'Поражения', es: 'Derrotas' },
        'duels.win_rate': { en: 'Win Rate', ru: '% побед', es: '% Victorias' },
        'duels.leaderboard': { en: 'Weekly Leaderboard', ru: 'Еженедельный рейтинг', es: 'Clasificación Semanal' },
        'duels.finding': { en: 'Finding Opponent', ru: 'Поиск противника', es: 'Buscando Oponente' },
        'duels.searching': { en: 'Searching for opponent...', ru: 'Ищем противника...', es: 'Buscando oponente...' },
        'duels.victory': { en: 'Victory!', ru: 'Победа!', es: '¡Victoria!' },
        'duels.defeat': { en: 'Defeat!', ru: 'Поражение!', es: '¡Derrota!' },
        'duels.tie': { en: "It's a Tie!", ru: 'Ничья!', es: '¡Empate!' },
        'duels.rematch': { en: 'Rematch', ru: 'Реванш', es: 'Revancha' },
    },

    // Get translation
    t(key) {
        const entry = this.translations[key];
        if (!entry) return key;
        return entry[this.currentLang] || entry['en'] || key;
    },

    // Set language
    setLang(lang) {
        if (['en', 'ru', 'es'].includes(lang)) {
            this.currentLang = lang;
            LangyState.interfaceLocale = lang;
            LangyState.settings.interfaceLang = lang;
            localStorage.setItem('langy_lang', lang);
            if (typeof LangyDB !== 'undefined') LangyDB.saveProgress().catch(() => {});
        }
    },

    // Load saved language
    loadSavedLang() {
        const saved = localStorage.getItem('langy_lang');
        if (saved && ['en', 'ru', 'es'].includes(saved)) {
            this.currentLang = saved;
        } else {
            // Auto-detect from browser
            const browserLang = navigator.language?.substring(0, 2);
            if (browserLang === 'ru') this.currentLang = 'ru';
            else if (browserLang === 'es') this.currentLang = 'es';
        }
        if (typeof LangyState !== 'undefined') {
            LangyState.interfaceLocale = this.currentLang;
            if (LangyState.settings) LangyState.settings.interfaceLang = this.currentLang;
        }
    },

    // Get available languages
    languages: [
        { code: 'en', name: 'English', flag: '🇬🇧' },
        { code: 'ru', name: 'Русский', flag: '🇷🇺' },
        { code: 'es', name: 'Español', flag: '🇪🇸' },
    ],
};

// Shorthand
function i18n(key) {
    return LangyI18n.t(key);
}
