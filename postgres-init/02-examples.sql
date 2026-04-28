INSERT INTO language (code)
VALUES ('uk'), ('en')
ON CONFLICT (code) DO NOTHING;

INSERT INTO site_content (section_key, content, is_active, language_id)
VALUES
    (
        'hero',
        '{
          "title": "Стань частиною сили, що захищає Україну",
          "subtitle": "Обирай підрозділ та вакансію відповідно до свого досвіду, навичок і мотивації.",
          "buttonTitle": "btn uk",
          "hiringChance": {
          "title": "Гарантія посади",
          "value": "100%",
          },
          "majors": {
          "title": "Cпеціальностей" ,
          "value": "30+"
          },
          "support":{
          "title": "Підтримка",
          "value":"24/7",
          },
          "backgroundImage": {
            "publicId": "hero-background",
            "secureUrl": "https://res.cloudinary.com/<cloud-name>/image/upload/v1/hero-background"
          }
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'hero',
        '{
          "title": "Become part of the force defending Ukraine",
          "subtitle": "Choose a subdivision and vacancy that match your experience, skills and motivation.",
          "buttonTitle": "btn en",
          "hiringChance": {
          "title": "Job security",
          "value": "100%",
          },
          "majors": {
          "title": "Specialisms" ,
          "value": "30+"
          },
          "support":{
          "title": "Support",
          "value":"24/7",
          },
          "backgroundImage": {
            "publicId": "hero-background",
            "secureUrl": "https://res.cloudinary.com/<cloud-name>/image/upload/v1/hero-background"
          }
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
      (
        'transfer',
        '{
          "title": "Хочеш змінити підрозділ?",
          "subtitle": "Ми допоможемо тобі у цьому надавши вибір військових частин, що приймуть тебе на бажану вакантну посаду",
          "buttonTitle": "Ми цінуємо твій час",
          "content":[
            {
              "title": "Підтримка",
              "subtitle": "Повний супровід просесу",
            },
            {
              "title": "Вибір" ,
              "subtitle": "Підбір позиції",
            },
            {
              "title": "Оперативність",
              "subtitle":"Ми цінуємо твій час",
            }
          ],
          "transfer-link": {
          "startText": "Ми допоможемо тобі у цьому надавши вибір військових частин, що приймуть тебе на бажану вакантну посаду",
          "link": "«Переведення»",
          "endText": "та очікуй дзвінок від рекрутера для співбесіди.",
          },
          "backgroundImage": {
            "publicId": "transfer-background",
            "secureUrl": "https://res.cloudinary.com/<cloud-name>/image/upload/v1/transfer-background"
            }
          }
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'uk')
      ),
      (
        'transfer',
        '{
          "title": "Would you like to change departments?",
          "subtitle": "We will help you with this by providing a choice of military units that will accept you for the desired vacant position",
          "buttonTitle": "We value your time",
          "content":[
            {
              "title": "Support",
              "subtitle": "Full support during the process",
            },
            {
              "title": "Choice" ,
              "subtitle": "Position matching",
            },
            {
              "title": "Speed",
              "subtitle":"We value your time",
            }
          ],
          "transfer-link": {
          "startText": "We will help you with this by providing a choice of military units that will accept you for the desired vacant position",
          "link": "«Transfer»",
          "endText": "and wait for a call from a recruiter to schedule an interview.",
          },
          "backgroundImage": {
            "publicId": "transfer-background",
            "secureUrl": "https://res.cloudinary.com/<cloud-name>/image/upload/v1/transfer-background"
            }
          }
        }'::jsonb,
        true,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
      'mobilization',
      '{
        "title": "Стань частиною сили, що захищає Україну",
        "subtitle": "Обирай підрозділ та вакансію відповідно до свого досвіду, навичок і мотивації.",
        "content": "Ми допомагаємо кандидатам знайти напрям служби, у якому їхні вміння принесуть найбільшу користь. На платформі можна ознайомитися з підрозділами, вакансіями та залишити заявку для подальшого контакту.",
        "buttonTitle": "Обрати вакансію"
      }'::jsonb,
      true,
      (SELECT id FROM language WHERE code = 'uk')
    ),
    (
      'mobilization',
      '{
        "title": "Become part of the force defending Ukraine",
        "subtitle": "Choose a subdivision and vacancy that match your experience, skills and motivation.",
        "content": "We help candidates find the service direction where their abilities bring the most value. The platform allows users to explore subdivisions, vacancies and submit an application for further contact.",
        "buttonTitle": "Choose vacancy"
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

INSERT INTO vacancy (position, slug, description, type, salary_min, salary_max, is_active, sort_order, language_id)
VALUES
    (
        'Оператор БПЛА',
        'operator-bpla',
        'Аеророзвідка, виявлення цілей та робота з безпілотними системами в польових умовах.',
        'frontline',
        20000,
        170000,
        true,
        10,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Штурмовик',
        'shturmovyk',
        'Виконання бойових завдань у складі штурмових груп, участь у маневрових діях та зачистці позицій.',
        'frontline',
        20000,
        170000,
        true,
        20,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Бойовий медик',
        'boyovyi-medyk',
        'Надання допомоги пораненим, участь в евакуації та медичному супроводі підрозділу.',
        'frontline',
        20000,
        170000,
        true,
        30,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець зі зв’язку',
        'fakhivets-zi-zviazku',
        'Налаштування засобів зв’язку, підтримка стійких каналів комунікації та координація роботи обладнання.',
        'frontline',
        20000,
        170000,
        true,
        40,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Водій-механік',
        'vodii-mekhanik',
        'Керування технікою, технічний контроль і забезпечення мобільності підрозділу.',
        'backline',
        20000,
        NULL,
        true,
        50,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець із кібербезпеки',
        'fakhivets-iz-kiberbezpeky',
        'Захист цифрової інфраструктури, моніторинг загроз та підтримка інформаційної стійкості.',
        'backline',
        20000,
        170000,
        true,
        60,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Логіст',
        'lohist',
        'Організація постачання, облік ресурсів та підтримка внутрішніх процесів забезпечення.',
        'backline',
        20000,
        170000,
        true,
        70,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'Фахівець з рекрутингу',
        'fakhivets-z-rekrutynhu',
        'Комунікація з кандидатами, супровід відгуків та первинна координація етапів відбору.',
        'backline',
        20000,
        170000,
        false,
        80,
        (SELECT id FROM language WHERE code = 'uk')
    ),
    (
        'UAV Operator',
        'uav-operator',
        'Aerial reconnaissance, target detection and work with unmanned systems in field conditions.',
        'frontline',
        20000,
        170000,
        true,
        10,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Assault Infantryman',
        'assault-infantryman',
        'Execution of combat tasks within assault groups, including maneuver operations and position clearing.',
        'frontline',
        20000,
        170000,
        true,
        20,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Combat Medic',
        'combat-medic',
        'Provide emergency care, support evacuation and ensure medical support for the unit.',
        'frontline',
        20000,
        170000,
        true,
        30,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Communications Specialist',
        'communications-specialist',
        'Set up communication equipment, maintain stable channels and support operational coordination.',
        'frontline',
        20000,
        170000,
        true,
        40,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Driver-Mechanic',
        'driver-mechanic',
        'Operate vehicles, monitor technical condition and support unit mobility.',
        'backline',
        20000,
        NULL,
        true,
        50,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Cybersecurity Specialist',
        'cybersecurity-specialist',
        'Protect digital infrastructure, monitor threats and support information resilience.',
        'backline',
        20000,
        170000,
        true,
        60,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Logistics Specialist',
        'logistics-specialist',
        'Organize supply operations, maintain resource records and support internal logistics processes.',
        'backline',
        20000,
        170000,
        true,
        70,
        (SELECT id FROM language WHERE code = 'en')
    ),
    (
        'Recruitment Specialist',
        'recruitment-specialist',
        'Communicate with candidates, manage incoming applications and coordinate initial selection stages.',
        'backline',
        20000,
        170000,
        false,
        80,
        (SELECT id FROM language WHERE code = 'en')
    );


INSERT INTO subdivision (
  name, slug, description,
  hover_name, hover_description,
  site_url, image_url, hover_image_url,
  is_active, sort_order, language_id
)
VALUES
  (
    '157 БРИГАДА',
    '157-omvr',
    '157-ма окрема механізована бригада. Бригада сформована у 2024 році.',
    '157 окрема механізована бригада',
    '157-ма окрема механізована бригада (157 ОМБр) — формування Сухопутних військ України. Бригада сформована у 2024 році. На кінець 2024 року воювала під Кураховим і під Покровськом. Відповідно до спільної директиви Міністра оборони України та Головнокомандувача Збройних Сил України від 2 лютого 2024 року була створена 157-ма окрема піхотна бригада в селищі Черкаське Самарського району Дніпропетровської області.',
    'https://157ombr.army/',
    NULL, NULL,
    true,
    10,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '5 БРИГАДА',
    '5-oshbr',
    '5-та окрема штурмова бригада. Окремий полк спеціального призначення «Азов».',
    '5 окрема штурмова бригада',
    'У березні 2022 року, на початку повномасштабного російського вторгнення під час ключової битви за Київ, у столиці сформовано Окремий полк спеціального призначення «Азов», який згодом переформовано на 5-ий окремий штурмовий полк (м. Київ).',
    'https://5brigade.army/',
    NULL, NULL,
    true,
    20,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '65 БРИГАДА',
    '65-ombr',
    '65-та окрема механізована бригада. Бригада сформована у квітні 2022 року.',
    '65 окрема механізована бригада',
    '65 окрема механізована бригада була сформована у квітні 2022 року і входить до складу Сухопутних військ Збройних Сил України. Відносно «молода», наша бригада невтомно боронить українські землі від окупантів ще з червня 2022 року. Вона приймала участь у звільненні села Роботине під час літнього контрнаступу у 2023 році та подальшим героїчним утриманням Роботинського виступу.',
    NULL,
    NULL, NULL,
    true,
    30,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '72 БРИГАДА',
    '72-ombr',
    '72-га окрема механізована бригада. Історія бригади бере початок у 1992 році.',
    '72 окрема механізована бригада',
    'Історія бригади бере початок у 1992 році, коли 72 гвардійська мотострілецька дивізія перейшла під юрисдикцію України та увійшла до складу Збройних Сил України. З''єднання отримало назву — 72 механізована дивізія. На той момент підрозділи дивізії розташовувались у трьох постійних місцях дислокації на території різних областей: Київської (місто Біла Церква), Чернігівської (смт Гончарівське) та Черкаської (місто Сміла).',
    'https://www.72ombr.army/',
    NULL, NULL,
    true,
    40,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '67 БРИГАДА',
    '67-ombr',
    '67-ма окрема механізована бригада. Створена у 2022 році на базі добровольчих формувань.',
    '67 окрема механізована бригада',
    'Бригада створена у 2022 році на базі добровольчих формувань. З 2023 року командиром бригади є полковник Роман Коренюк, а з 2025 – Олександр Шаптала. Для бригади людське життя — це найвища цінність. Тому перед бойовими завданнями відбувається відповідальна підготовка особового складу, адже гарно навчений та забезпечений воїн — це ефективний воїн.',
    NULL,
    NULL, NULL,
    true,
    50,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '209 БАТАЛЬЙОН',
    '209-optb',
    '209-тий окремий протитанковий батальйон. Підрозділ був сформований у 2019 році.',
    '209 окремий протитанковий батальйон',
    '209-й протитанковий батальйон є спеціалізованим підрозділом Сухопутних військ. Спочатку підрозділ був сформований у 2019 році як окремий підрозділ під командуванням 43-ї артилерійської бригади, але згодом був демобілізований і залишився лише на папері. Знову батальйон був сформований у 2022 році, після повномасштабного вторгнення Росії в Україну, цього разу безпосередньо під командуванням Сухопутних військ.',
    NULL,
    NULL, NULL,
    true,
    60,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '428 БАТАЛЬЙОН «ТІНЬ»',
    '428-obps',
    '428-ми окремий батальйон безпілотних систем «Тінь». Сформований батальйон нещодавно.',
    '428 окремий батальйон безпілотних систем «Тінь»',
    '428 батальйон безпілотних систем, який сформований не так давно, вже наразі показує високу результативність, перебуваючи, фактично, в стані формування. Запорука цьому, в першу чергу, кваліфіковані та мотивовані військові, які стали на захист України ще з 2022 року, від початку повномасштабного вторгнення. Ці люди пройшли шлях від солдатів в окопах, набули бойовий досвід і наразі, на керівних посадах, вчать наступне покоління профейсійних військових. Головна наша цінність, саме в людях, кожен з яких, на своєму місці, робить все, щоб пришвидшити нашу перемогу.',
    'https://428.org.ua/',
    NULL, NULL,
    true,
    70,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '1027 ПОЛК',
    '1027-zrap',
    '1027-ий зенітний ракетно-артилерійський полк. Полк сформовано 15 березня 2023 року.',
    '1027 зенітний ракетно-артилерійський полк',
    '1027-й зенітний ракетно-артилерійський полк — військова частина Сухопутних військ, наразі підпорядковується 12-му армійському корпусу. Підрозділ базується в Києві.',
    NULL,
    NULL, NULL,
    true,
    80,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '2 БАТАЛЬЙОН «ЕКСТРЕМІС»',
    '2-omb-extremis',
    '2-гй окремий медичний батальйон «Екстреміс». Батальйон активно комплектується, базується в Києві.',
    '2 окремий медичний батальйон «Екстреміс»',
    '2-й окремий медичний батальйон «Екстреміс» — підрозділ Збройних Сил України. Батальйон активно комплектується та базується в Києві. Забезпечує медичну підтримку бойових підрозділів та евакуацію поранених із зони бойових дій.',
    NULL,
    NULL, NULL,
    true,
    90,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '95 БАТАЛЬЙОН',
    '95-obp',
    '95-тий окремий батальйон підтримки. Основним завданням є інженерне забезпечення.',
    '95 окремий батальйон підтримки',
    '95-й окремий батальйон підтримки – підрозділ Сухопутних Військ Збройних Сил України. Основним завданням батальйону підтримки є інженерне забезпечення бойових підрозділів: створення загороджень, зведення польових фортифікаційних споруд, обладнання та утримання пунктів водопостачання, ведення інженерної розвідки із застосуванням спеціалізованої інженерної техніки та засобів.',
    NULL,
    NULL, NULL,
    true,
    100,
    (SELECT id FROM language WHERE code = 'uk')
  ),
  (
    '524 БАТАЛЬЙОН',
    '524-oboo',
    '524-та окремий батальйон охорони і обслуги. Наша місія — забезпечення функціонування військових комунікацій.',
    '524 окремий батальйон охорони і обслуги',
    'Основними завданнями батальйону є: охорона та обслуговування сухопутних військ ЗСУ та ведення адміністративної функції. Наша місія — забезпечення функціонування військових комунікацій та збереження територіальної цілісності й суверенітету України.',
    NULL,
    NULL, NULL,
    true,
    110,
    (SELECT id FROM language WHERE code = 'uk')
  );

-- ============================================================
-- STEP 4: Insert 11 subdivisions — English locale
-- ============================================================
INSERT INTO subdivision (
  name, slug, description,
  hover_name, hover_description,
  site_url, image_url, hover_image_url,
  is_active, sort_order, language_id
)
VALUES
  (
    '157 BRIGADE',
    '157-omvr',
    '157th Separate Mechanized Brigade. The brigade was formed in 2024.',
    '157th Separate Mechanized Brigade',
    'The 157th Separate Mechanized Brigade (157 OMBr) is a formation of the Ground Forces of Ukraine. The brigade was formed in 2024. By the end of 2024, it was fighting near Kurakhove and Pokrovsk. In accordance with a joint directive of the Minister of Defense of Ukraine and the Commander-in-Chief of the Armed Forces of Ukraine dated February 2, 2024, the 157th Separate Infantry Brigade was established in the village of Cherkаske, Samara district, Dnipropetrovsk region.',
    'https://157ombr.army/',
     NULL, NULL,
    true,
    10,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '5 BRIGADE',
    '5-oshbr',
    '5th Separate Assault Brigade. Special Purpose Regiment «Azov».',
    '5th Separate Assault Brigade',
    'In March 2022, at the beginning of the full-scale Russian invasion during the key Battle of Kyiv, the Special Purpose Regiment «Azov» was formed in the capital, which was later reorganized into the 5th Separate Assault Regiment (Kyiv).',
    'https://5brigade.army/',
     NULL, NULL,
    true,
    20,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '65 BRIGADE',
    '65-ombr',
    '65th Separate Mechanized Brigade. The brigade was formed in April 2022.',
    '65th Separate Mechanized Brigade',
    'The 65th Separate Mechanized Brigade was formed in April 2022 and is part of the Ground Forces of the Armed Forces of Ukraine. Relatively «young», our brigade has been tirelessly defending Ukrainian lands from occupiers since June 2022. It participated in the liberation of the village of Robotyne during the summer counteroffensive in 2023 and the subsequent heroic defense of the Robotyne salient.',
    NULL,
    NULL, NULL,
    true,
    30,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '72 BRIGADE',
    '72-ombr',
    '72nd Separate Mechanized Brigade. The brigade history dates back to 1992.',
    '72nd Separate Mechanized Brigade',
    'The brigade history dates back to 1992, when the 72nd Guards Motor Rifle Division came under the jurisdiction of Ukraine and joined the Armed Forces of Ukraine. The formation was renamed the 72nd Mechanized Division. At that time, the division units were stationed in three permanent locations in different regions: Kyiv (Bila Tserkva), Chernihiv (Honcharivske) and Cherkasy (Smila).',
    'https://www.72ombr.army/',
    NULL, NULL,
    true,
    40,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '67 BRIGADE',
    '67-ombr',
    '67th Separate Mechanized Brigade. Created in 2022 on the basis of volunteer formations.',
    '67th Separate Mechanized Brigade',
    'The brigade was created in 2022 on the basis of volunteer formations. Since 2023, the brigade commander is Colonel Roman Koreniuk, and since 2025 – Oleksandr Shaptala. For the brigade, human life is the highest value. Therefore, before combat missions, responsible training of personnel takes place, because a well-trained and equipped warrior is an effective warrior.',
    NULL,
    NULL, NULL,
    true,
    50,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '209 BATTALION',
    '209-optb',
    '209th Separate Anti-Tank Battalion. The unit was formed in 2019.',
    '209th Separate Anti-Tank Battalion',
    'The 209th Anti-Tank Battalion is a specialized unit of the Ground Forces. Initially the unit was formed in 2019 as a separate unit under the command of the 43rd Artillery Brigade, but was later demobilized and remained only on paper. The battalion was reformed in 2022, after Russia''s full-scale invasion of Ukraine, this time directly under the command of the Ground Forces.',
    NULL,
    NULL, NULL,
    true,
    60,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '428 BATTALION «TIN»',
    '428-obps',
    '428th Separate Unmanned Systems Battalion «Tin». The battalion was recently formed.',
    '428th Separate Unmanned Systems Battalion «Tin»',
    'The 428 Unmanned Systems Battalion, which was formed not long ago, is already showing high efficiency while actually still in the process of formation. The key to this is, first of all, qualified and motivated military personnel who stood up to defend Ukraine since 2022, from the beginning of the full-scale invasion. These people have traveled the path from soldiers in trenches, gained combat experience and are now, in leadership positions, teaching the next generation of professional military.',
    'https://428.org.ua/',
     NULL, NULL,
    true,
    70,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '1027 REGIMENT',
    '1027-zrap',
    '1027th Anti-Aircraft Missile and Artillery Regiment. Regiment formed on March 15, 2023.',
    '1027th Anti-Aircraft Missile and Artillery Regiment',
    'The 1027th Anti-Aircraft Missile and Artillery Regiment is a military unit of the Ground Forces, currently subordinated to the 12th Army Corps. The unit is based in Kyiv.',
    NULL,
    NULL, NULL,
    true,
    80,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '2 BATTALION «EXTREMIS»',
    '2-omb-extremis',
    '2nd Separate Medical Battalion «Extremis». Actively recruiting, based in Kyiv.',
    '2nd Separate Medical Battalion «Extremis»',
    'The 2nd Separate Medical Battalion «Extremis» is a unit of the Armed Forces of Ukraine. The battalion is actively recruiting and is based in Kyiv. It provides medical support to combat units and evacuation of the wounded from the combat zone.',
    NULL,
    NULL, NULL,
    true,
    90,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '95 BATTALION',
    '95-obp',
    '95th Separate Support Battalion. The main task is engineering support.',
    '95th Separate Support Battalion',
    'The 95th Separate Support Battalion is a unit of the Ground Forces of the Armed Forces of Ukraine. The main task of the support battalion is engineering support for combat units: creating obstacles, building field fortifications, equipping and maintaining water supply points, conducting engineering reconnaissance using specialized engineering equipment and tools.',
    NULL,
    NULL, NULL,
    true,
    100,
    (SELECT id FROM language WHERE code = 'en')
  ),
  (
    '524 BATTALION',
    '524-oboo',
    '524th Separate Security and Service Battalion. Our mission is to ensure military communications.',
    '524th Separate Security and Service Battalion',
    'The main tasks of the battalion are: security and maintenance of the ground forces of the Armed Forces of Ukraine and performing administrative functions. Our mission is to ensure the functioning of military communications and preserve the territorial integrity and sovereignty of Ukraine.',
    NULL,
    NULL, NULL,
    true,
    110,
    (SELECT id FROM language WHERE code = 'en')
  );