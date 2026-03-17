INSERT INTO language (code)
VALUES ('uk'), ('en')
ON CONFLICT (code) DO NOTHING;

INSERT INTO site_content (section_key, content, is_active, language_id)
VALUES
    (
        'hero',
        '{
          "eyebrow": "12 АК",
          "title": "Стань частиною сили, що захищає Україну",
          "subtitle": "Обирай підрозділ та вакансію відповідно до свого досвіду, навичок і мотивації.",
          "primaryButton": {
            "label": "Обрати вакансію",
            "href": "/vacancies"
          },
          "secondaryButton": {
            "label": "Підрозділи",
            "href": "/subdivisions"
          },
          "backgroundImage": "/images/hero/hero-main.jpg"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'hero',
        '{
          "eyebrow": "12 AC",
          "title": "Become part of the force defending Ukraine",
          "subtitle": "Choose a subdivision and vacancy that match your experience, skills and motivation.",
          "primaryButton": {
            "label": "Choose vacancy",
            "href": "/vacancies"
          },
          "secondaryButton": {
            "label": "Subdivisions",
            "href": "/subdivisions"
          },
          "backgroundImage": "/images/hero/hero-main.jpg"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'about',
        '{
          "title": "Про нас",
          "description": "Ми допомагаємо кандидатам знайти напрям служби, у якому їхні вміння принесуть найбільшу користь. На платформі можна ознайомитися з підрозділами, вакансіями та залишити заявку для подальшого контакту.",
          "images": [
            "/images/about/about-1.jpg",
            "/images/about/about-2.jpg",
            "/images/about/about-3.jpg"
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'about',
        '{
          "title": "About us",
          "description": "We help candidates find the service direction where their abilities bring the most value. The platform allows users to explore subdivisions, vacancies and submit an application for further contact.",
          "images": [
            "/images/about/about-1.jpg",
            "/images/about/about-2.jpg",
            "/images/about/about-3.jpg"
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'advantages',
        '{
          "title": "Чому варто долучитися",
          "items": [
            {
              "title": "Зрозумілі ролі",
              "description": "Кожна вакансія має чіткий опис задач і очікувань."
            },
            {
              "title": "Застосування досвіду",
              "description": "Цивільні навички можуть бути корисними в службі вже зараз."
            },
            {
              "title": "Навчання та адаптація",
              "description": "Передбачено підготовку та поступове входження в процес."
            },
            {
              "title": "Сильна команда",
              "description": "Служба поруч із мотивованими людьми, які мають спільну мету."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'advantages',
        '{
          "title": "Why join",
          "items": [
            {
              "title": "Clear roles",
              "description": "Each vacancy has a clear description of tasks and expectations."
            },
            {
              "title": "Use your experience",
              "description": "Civilian skills can already be valuable in service."
            },
            {
              "title": "Training and adaptation",
              "description": "Preparation and gradual onboarding are part of the process."
            },
            {
              "title": "Strong team",
              "description": "Serve alongside motivated people united by a common goal."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'stats',
        '{
          "title": "У цифрах",
          "items": [
            {
              "label": "Актуальних вакансій",
              "value": "20+"
            },
            {
              "label": "Напрямів служби",
              "value": "8"
            },
            {
              "label": "Підрозділів у добірці",
              "value": "6"
            },
            {
              "label": "Етапи відгуку",
              "value": "3"
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'stats',
        '{
          "title": "In numbers",
          "items": [
            {
              "label": "Open vacancies",
              "value": "20+"
            },
            {
              "label": "Service directions",
              "value": "8"
            },
            {
              "label": "Subdivisions listed",
              "value": "6"
            },
            {
              "label": "Application steps",
              "value": "3"
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'join_steps',
        '{
          "title": "Як долучитися",
          "items": [
            {
              "step": 1,
              "title": "Обери вакансію",
              "description": "Ознайомся з відкритими ролями та вимогами."
            },
            {
              "step": 2,
              "title": "Залиш заявку",
              "description": "Передай контактні дані для зворотного зв’язку."
            },
            {
              "step": 3,
              "title": "Пройди співбесіду",
              "description": "Отримай уточнення щодо служби та наступних кроків."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'join_steps',
        '{
          "title": "How to join",
          "items": [
            {
              "step": 1,
              "title": "Choose a vacancy",
              "description": "Review open roles and requirements."
            },
            {
              "step": 2,
              "title": "Submit an application",
              "description": "Send your contact details for follow-up."
            },
            {
              "step": 3,
              "title": "Attend an interview",
              "description": "Get more details about service and next steps."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'faq',
        '{
          "title": "Поширені запитання",
          "items": [
            {
              "question": "Чи потрібен бойовий досвід?",
              "answer": "Не для всіх вакансій. Частина ролей передбачає навчання після відбору."
            },
            {
              "question": "Чи можна обрати небойову посаду?",
              "answer": "Так, на платформі є як frontline, так і backline вакансії."
            },
            {
              "question": "Як швидко зі мною зв’яжуться?",
              "answer": "Після подання заявки з кандидатом зв’язуються для уточнення деталей."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'faq',
        '{
          "title": "Frequently asked questions",
          "items": [
            {
              "question": "Is combat experience required?",
              "answer": "Not for every vacancy. Some roles include training after selection."
            },
            {
              "question": "Can I choose a non-combat role?",
              "answer": "Yes, the platform includes both frontline and backline vacancies."
            },
            {
              "question": "How soon will I be contacted?",
              "answer": "After the application is submitted, candidates are contacted to clarify details."
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'application_cta',
        '{
          "title": "Готовий зробити крок?",
          "description": "Оберіть вакансію або підрозділ і залиште заявку для подальшого контакту.",
          "button": {
            "label": "Подати заявку",
            "href": "/apply"
          },
          "image": "/images/cta/apply.jpg"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'application_cta',
        '{
          "title": "Ready to take the step?",
          "description": "Choose a vacancy or subdivision and submit your application for further contact.",
          "button": {
            "label": "Apply now",
            "href": "/apply"
          },
          "image": "/images/cta/apply.jpg"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'contacts',
        '{
          "title": "Контакти",
          "description": "Залишайте заявку або звертайтеся через офіційні канали зв’язку.",
          "phone": "+[PHONE]",
          "email": "contact@example.local",
          "telegram": "@ak12_recruiting"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'contacts',
        '{
          "title": "Contacts",
          "description": "Submit an application or reach out through official communication channels.",
          "phone": "+[PHONE]",
          "email": "contact@example.local",
          "telegram": "@ak12_recruiting"
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'footer',
        '{
          "copyright": "© 12 АК",
          "links": [
            {
              "label": "Вакансії",
              "href": "/vacancies"
            },
            {
              "label": "Підрозділи",
              "href": "/subdivisions"
            },
            {
              "label": "Контакти",
              "href": "/contacts"
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'footer',
        '{
          "copyright": "© 12 AC",
          "links": [
            {
              "label": "Vacancies",
              "href": "/vacancies"
            },
            {
              "label": "Subdivisions",
              "href": "/subdivisions"
            },
            {
              "label": "Contacts",
              "href": "/contacts"
            }
          ]
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    )
ON CONFLICT (section_key, language_id) DO NOTHING;

INSERT INTO vacancy (position, slug, description, type, salary, image_url, is_active, sort_order, language_id)
VALUES
    (
        'Оператор БПЛА',
        'operator-bpla',
        'Аеророзвідка, виявлення цілей та робота з безпілотними системами в польових умовах.',
        'frontline',
        45.00,
        '/images/vacancies/uav-operator.jpg',
        true,
        10,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Штурмовик',
        'shturmovyk',
        'Виконання бойових завдань у складі штурмових груп, участь у маневрових діях та зачистці позицій.',
        'frontline',
        50.00,
        '/images/vacancies/assault.jpg',
        true,
        20,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Бойовий медик',
        'boyovyi-medyk',
        'Надання допомоги пораненим, участь в евакуації та медичному супроводі підрозділу.',
        'frontline',
        42.00,
        '/images/vacancies/combat-medic.jpg',
        true,
        30,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець зі зв’язку',
        'fakhivets-zi-zviazku',
        'Налаштування засобів зв’язку, підтримка стійких каналів комунікації та координація роботи обладнання.',
        'frontline',
        40.00,
        '/images/vacancies/communications.jpg',
        true,
        40,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Водій-механік',
        'vodii-mekhanik',
        'Керування технікою, технічний контроль і забезпечення мобільності підрозділу.',
        'backline',
        38.00,
        '/images/vacancies/driver-mechanic.jpg',
        true,
        50,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець із кібербезпеки',
        'fakhivets-iz-kiberbezpeky',
        'Захист цифрової інфраструктури, моніторинг загроз та підтримка інформаційної стійкості.',
        'backline',
        55.00,
        '/images/vacancies/cybersecurity.jpg',
        true,
        60,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Логіст',
        'lohist',
        'Організація постачання, облік ресурсів та підтримка внутрішніх процесів забезпечення.',
        'backline',
        37.00,
        '/images/vacancies/logistics.jpg',
        true,
        70,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець з рекрутингу',
        'fakhivets-z-rekrutynhu',
        'Комунікація з кандидатами, супровід відгуків та первинна координація етапів відбору.',
        'backline',
        35.00,
        '/images/vacancies/recruiter.jpg',
        false,
        80,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'UAV Operator',
        'uav-operator',
        'Aerial reconnaissance, target detection and work with unmanned systems in field conditions.',
        'frontline',
        45.00,
        '/images/vacancies/uav-operator.jpg',
        true,
        10,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Assault Infantryman',
        'assault-infantryman',
        'Execution of combat tasks within assault groups, including maneuver operations and position clearing.',
        'frontline',
        50.00,
        '/images/vacancies/assault.jpg',
        true,
        20,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Combat Medic',
        'combat-medic',
        'Provide emergency care, support evacuation and ensure medical support for the unit.',
        'frontline',
        42.00,
        '/images/vacancies/combat-medic.jpg',
        true,
        30,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Communications Specialist',
        'communications-specialist',
        'Set up communication equipment, maintain stable channels and support operational coordination.',
        'frontline',
        40.00,
        '/images/vacancies/communications.jpg',
        true,
        40,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Driver-Mechanic',
        'driver-mechanic',
        'Operate vehicles, monitor technical condition and support unit mobility.',
        'backline',
        38.00,
        '/images/vacancies/driver-mechanic.jpg',
        true,
        50,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Cybersecurity Specialist',
        'cybersecurity-specialist',
        'Protect digital infrastructure, monitor threats and support information resilience.',
        'backline',
        55.00,
        '/images/vacancies/cybersecurity.jpg',
        true,
        60,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Logistics Specialist',
        'logistics-specialist',
        'Organize supply operations, maintain resource records and support internal logistics processes.',
        'backline',
        37.00,
        '/images/vacancies/logistics.jpg',
        true,
        70,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Recruitment Specialist',
        'recruitment-specialist',
        'Communicate with candidates, manage incoming applications and coordinate initial selection stages.',
        'backline',
        35.00,
        '/images/vacancies/recruiter.jpg',
        false,
        80,
        (SELECT id FROM language WHERE code = 'en')
    );

INSERT INTO subdivision (name, slug, description, site_url, image_url, is_active, sort_order, language_id)
VALUES
    (
        'Підрозділ БПЛА',
        'pidrozdil-bpla',
        'Працює з аеророзвідкою, спостереженням, виявленням цілей та підтримкою бойових дій.',
        'https://example.local/uav-unit',
        '/images/subdivisions/uav-unit.jpg',
        true,
        10,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Штурмовий підрозділ',
        'shturmovyi-pidrozdil',
        'Виконує складні бойові завдання, діє в активній фазі операцій та потребує вмотивованих кандидатів.',
        'https://example.local/assault-unit',
        '/images/subdivisions/assault-unit.jpg',
        true,
        20,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Медичний підрозділ',
        'medychnyi-pidrozdil',
        'Забезпечує стабілізацію, допомогу пораненим та евакуацію в зоні виконання завдань.',
        'https://example.local/medical-unit',
        '/images/subdivisions/medical-unit.jpg',
        true,
        30,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Підрозділ зв’язку',
        'pidrozdil-zviazku',
        'Підтримує канали зв’язку, технічні засоби комунікації та координацію між групами.',
        'https://example.local/comms-unit',
        '/images/subdivisions/comms-unit.jpg',
        true,
        40,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Логістичний підрозділ',
        'lohistychnyi-pidrozdil',
        'Відповідає за постачання, переміщення ресурсів та внутрішню організацію забезпечення.',
        null,
        '/images/subdivisions/logistics-unit.jpg',
        true,
        50,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Кіберпідрозділ',
        'kiberpidrozdil',
        'Працює над цифровою безпекою, захистом систем і стійкістю інформаційної інфраструктури.',
        'https://example.local/cyber-unit',
        '/images/subdivisions/cyber-unit.jpg',
        false,
        60,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'UAV Unit',
        'uav-unit',
        'Works with aerial reconnaissance, observation, target detection and operational support.',
        'https://example.local/uav-unit',
        '/images/subdivisions/uav-unit.jpg',
        true,
        10,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Assault Unit',
        'assault-unit',
        'Handles demanding combat tasks, operates in active phases of missions and needs highly motivated candidates.',
        'https://example.local/assault-unit',
        '/images/subdivisions/assault-unit.jpg',
        true,
        20,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Medical Unit',
        'medical-unit',
        'Provides stabilization, casualty care and evacuation support in operational areas.',
        'https://example.local/medical-unit',
        '/images/subdivisions/medical-unit.jpg',
        true,
        30,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Communications Unit',
        'communications-unit',
        'Maintains communication channels, technical equipment and coordination between groups.',
        'https://example.local/comms-unit',
        '/images/subdivisions/comms-unit.jpg',
        true,
        40,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Logistics Unit',
        'logistics-unit',
        'Responsible for supply operations, movement of resources and internal support organization.',
        null,
        '/images/subdivisions/logistics-unit.jpg',
        true,
        50,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Cyber Unit',
        'cyber-unit',
        'Focused on digital security, system protection and resilience of information infrastructure.',
        'https://example.local/cyber-unit',
        '/images/subdivisions/cyber-unit.jpg',
        false,
        60,
        (SELECT id FROM language WHERE code = 'en')
    );