import { initializeApp, getApps } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const firebaseConfig = {
  projectId: "gen-lang-client-0953232537",
  appId: "1:137690555750:web:fb71229bdb7967b219d4a7",
  apiKey: "AIzaSyAttFnU4yJTpPqqCt6tSxIqzo-Qr-c2Bl4",
  authDomain: "gen-lang-client-0953232537.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-bishrdev-29503a8e-d8ae-4f8d-a4f1-af1ee4b11cde",
  storageBucket: "gen-lang-client-0953232537.firebasestorage.app",
  messagingSenderId: "137690555750"
};

let firestoreDb = null;
try {
  const firebaseApp = getApps().length === 0 
    ? initializeApp(firebaseConfig) 
    : getApps()[0];

  firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
} catch (e) {
  console.error("Firebase init error:", e);
}

const DEFAULT_SITE_DATA = {
  about: "I'm Bishr KV, a passionate full stack web developer from India. I build modern, responsive web applications.\n\nWith expertise in frontend and backend technologies, I bring ideas to life from concept to deployment.",
  skills: [
    { name: 'HTML5', level: 95, category: 'Frontend' },
    { name: 'CSS3', level: 90, category: 'Frontend' },
    { name: 'JavaScript', level: 92, category: 'Frontend' },
    { name: 'React', level: 85, category: 'Frontend' },
    { name: 'Tailwind CSS', level: 90, category: 'Frontend' },
    { name: 'Node.js', level: 80, category: 'Backend' },
    { name: 'Express.js', level: 78, category: 'Backend' },
    { name: 'MongoDB', level: 75, category: 'Backend' },
    { name: 'Firebase', level: 82, category: 'Backend' },
    { name: 'Git & GitHub', level: 88, category: 'Tools' },
    { name: 'VS Code', level: 95, category: 'Tools' },
    { name: 'Figma', level: 75, category: 'Tools' }
  ],
  services: [
    { title: 'Web Development', description: 'Fast, responsive websites.', icon: 'code-2' },
    { title: 'UI/UX Design', description: 'Intuitive interfaces.', icon: 'palette' },
    { title: 'Backend', description: 'APIs and databases.', icon: 'server' },
    { title: 'Responsive', description: 'Pixel-perfect everywhere.', icon: 'smartphone' },
    { title: 'Performance', description: 'Speed and SEO.', icon: 'zap' },
    { title: 'Maintenance', description: 'Ongoing support.', icon: 'shield-check' }
  ],
  timeline: [
    { title: 'Freelance Developer', company: 'Self Employed', period: '2024 - Present', type: 'work', description: 'Building websites for clients worldwide.' },
    { title: 'Web Dev Intern', company: 'Tech Startup', period: '2023 - 2024', type: 'work', description: 'Web apps and REST APIs.' },
    { title: 'Higher Secondary', company: 'Govt College', period: '2021 - 2023', type: 'education', description: 'Computer Science.' }
  ],
  projects: [
    { id: 'p1', title: 'Nahdi Mandi', description: 'Awonderful Website  for Nahdi.', tech: 'React, Tailwind, Node.js', image: 'https://i.postimg.cc/K8wVX2p8/Screenshot-2026-06-21-174520.png', url: 'https://nahdimandi.lovable.app/', featured: true, date: '2025-01-15' },
    { id: 'p2', title: 'Portfolio for Ameershaji', description: 'Awonderful Portfolio for  Ameerhsaji.', tech: 'React, Tailwind, Node.js', image: 'https://i.postimg.cc/J4JH3cVR/Screenshot-2026-06-21-173757.png', url: 'https://ameershaji.vercel.app/', featured: true, date: '2025-01-15' },
    { id: 'p3', title: 'Graphic bishr', description: 'Awonderful portfolio for Bishr.', tech: 'React, Tailwind, Node.js', image: 'https://i.postimg.cc/ZKNDLGNF/111.png', url: 'https://graphicbishr.vercel.app/', featured: true, date: '2025-01-15' },
    { id: 'p4', title: 'Shozio', description: 'Awonderful portfolio Shoe brand.', tech: 'React, Tailwind, Node.js', image: 'https://i.postimg.cc/Bn9DR7c6/ghjhgjhg.png', url: 'https://shoezio.vercel.app/', featured: true, date: '2025-01-15' },
    { id: 'p5', title: 'Wami Clubwears', description: 'Awonderful website for a clothing brand.', tech: 'React, Tailwind, Node.js', image: 'https://i.postimg.cc/tTh517F9/3.png', url: 'https://wamiclubwears.vercel.app/', featured: false, date: '2025-01-15' },
    { id: 'p6', title: 'Watchlab', description: 'Dark portfolio with animations and admin panel.', tech: 'HTML, CSS, JS', image: 'https://i.postimg.cc/52Y8Y6V8/3.png', url: 'https://watchlabstore.vercel.app/', featured: false, date: '2025-04-05' },
    { id: 'p7', title: 'Zochafoodie', description: 'Kanban task manager with drag-and-drop.', tech: 'React, MongoDB', image: 'https://i.postimg.cc/tTh517Fq/2.png', url: 'https://zochafoodie.vercel.app/', featured: true, date: '2025-05-12' },
    { id: 'p8', title: 'Mentorship', description: 'A intractive website for maintainnig the ralation between Mentor and Mentee. ', tech: 'React, MongoDB', image: 'https://i.postimg.cc/g0cKBBmv/Screenshot-2026-06-21-175130.png', url: 'https://mentorbk.vercel.app/', featured: false, date: '2025-05-12' },
    { id: 'p9', title: 'Juiceio', description: 'Real-time weather with 7-day forecast.', tech: 'JavaScript, API', image: 'https://i.postimg.cc/02ZVd6Ft/1.png', url: 'https://juiceio.vercel.app/', featured: true, date: '2025-06-20' },
    { id: 'p10', title: 'Portfolio for Ameershaji', description: 'Awonderful Portfolio for  Ameerhsaji.', tech: 'JavaScript, API', image: 'https://i.postimg.cc/xjLbM3Sn/Screenshot-2026-06-21-175355.png', url: 'https://ameershaji-2.vercel.app/', featured: false, date: '2025-06-01' }
  ],
  testimonials: [
    { name: 'MR Shamal', role: 'Startup Founder', text: 'Outstanding work!', rating: 5 },
    { name: 'Dr Raif Tp', role: 'AI Specialist', text: 'Beyond expectations!', rating: 5 },
    { name: 'Yaseen B', role: 'Designer', text: 'Great attention to detail.', rating: 4 }
  ]
};

function parseBody(body) {
  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return body || {};
}

export default async function handler(req, res) {
  // Set CORS and JSON headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const url = req.url || '';
  const pathname = url.split('?')[0];

  // 1. Site Data Endpoints: /api/site-data
  if (pathname === '/api/site-data' || pathname.endsWith('/site-data')) {
    if (req.method === 'GET') {
      try {
        if (firestoreDb) {
          const configDoc = await getDoc(doc(firestoreDb, 'site', 'config'));
          if (configDoc.exists()) {
            return res.status(200).json(configDoc.data());
          }
        }
        return res.status(200).json(DEFAULT_SITE_DATA);
      } catch (err) {
        console.error('Error fetching site-data:', err);
        return res.status(200).json(DEFAULT_SITE_DATA);
      }
    }

    if (req.method === 'POST' || req.method === 'PUT') {
      try {
        const payload = parseBody(req.body);
        const dataToSave = {
          about: typeof payload.about === 'string' ? payload.about : DEFAULT_SITE_DATA.about,
          skills: Array.isArray(payload.skills) ? payload.skills : DEFAULT_SITE_DATA.skills,
          services: Array.isArray(payload.services) ? payload.services : DEFAULT_SITE_DATA.services,
          timeline: Array.isArray(payload.timeline) ? payload.timeline : DEFAULT_SITE_DATA.timeline,
          projects: Array.isArray(payload.projects) ? payload.projects : DEFAULT_SITE_DATA.projects,
          testimonials: Array.isArray(payload.testimonials) ? payload.testimonials : DEFAULT_SITE_DATA.testimonials,
          updatedAt: new Date().toISOString()
        };

        if (firestoreDb) {
          await setDoc(doc(firestoreDb, 'site', 'config'), dataToSave);
        }
        return res.status(200).json(dataToSave);
      } catch (err) {
        console.error('Error saving site-data:', err);
        return res.status(500).json({ error: 'Failed to save site data' });
      }
    }
  }

  // 2. Messages Endpoints: /api/messages or /api/messages/:id
  if (pathname.includes('/api/messages') || pathname.includes('/messages')) {
    if (req.method === 'GET') {
      try {
        if (firestoreDb) {
          const messagesCol = collection(firestoreDb, 'messages');
          const messagesSnap = await getDocs(query(messagesCol, orderBy('createdAt', 'desc')));
          const messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
          return res.status(200).json(messages);
        }
        return res.status(200).json([]);
      } catch (err) {
        console.error('Error fetching messages:', err);
        return res.status(200).json([]);
      }
    }

    if (req.method === 'POST') {
      try {
        const body = parseBody(req.body);
        const { name, email, subject, message } = body;
        const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
        const newMessage = {
          id,
          name: name || 'Anonymous',
          email: email || '',
          subject: subject || '(No Subject)',
          message: message || '',
          date: new Date().toISOString().split('T')[0],
          createdAt: Date.now()
        };

        if (firestoreDb) {
          await setDoc(doc(firestoreDb, 'messages', id), newMessage);
        }

        return res.status(201).json({
          ...newMessage,
          emailSent: false,
          emailError: 'Saved to Cloud Firestore'
        });
      } catch (err) {
        console.error('Error saving message:', err);
        return res.status(500).json({ error: 'Failed to save message' });
      }
    }

    if (req.method === 'DELETE') {
      try {
        const parts = pathname.split('/');
        const id = parts[parts.length - 1];

        if (id && id !== 'messages') {
          if (firestoreDb) {
            await deleteDoc(doc(firestoreDb, 'messages', id));
          }
          return res.status(200).json({ success: true, id });
        } else {
          // Clear all messages
          if (firestoreDb) {
            const messagesCol = collection(firestoreDb, 'messages');
            const messagesSnap = await getDocs(messagesCol);
            for (const d of messagesSnap.docs) {
              await deleteDoc(doc(firestoreDb, 'messages', d.id));
            }
          }
          return res.status(200).json({ success: true });
        }
      } catch (err) {
        console.error('Error deleting message:', err);
        return res.status(500).json({ error: 'Failed to delete message' });
      }
    }
  }

  // 3. Fallback
  return res.status(200).json({ status: 'ok', time: new Date().toISOString() });
}
