import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeApp } from 'firebase/app';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Read Firebase Config
let firebaseConfig = null;
let firestoreDb = null;

try {
  const configPath = path.join(__dirname, 'firebase-applet-config.json');
  if (fs.existsSync(configPath)) {
    firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    const firebaseApp = initializeApp({
      projectId: firebaseConfig.projectId,
      appId: firebaseConfig.appId,
      apiKey: firebaseConfig.apiKey,
      authDomain: firebaseConfig.authDomain,
      storageBucket: firebaseConfig.storageBucket,
      messagingSenderId: firebaseConfig.messagingSenderId
    });
    
    // Use the custom database ID provisioned for this applet if present
    if (firebaseConfig.firestoreDatabaseId) {
      firestoreDb = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);
    } else {
      firestoreDb = getFirestore(firebaseApp);
    }
    console.log('Firebase Firestore initialized successfully.');
  }
} catch (err) {
  console.warn('Firebase initialization warning:', err.message);
}

// Fallback Local File Storage
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const SITE_DATA_FILE = path.join(DATA_DIR, 'site-data.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

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

function readLocalSiteData() {
  try {
    if (fs.existsSync(SITE_DATA_FILE)) {
      return JSON.parse(fs.readFileSync(SITE_DATA_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Error reading local site data:', err.message);
  }
  return DEFAULT_SITE_DATA;
}

function writeLocalSiteData(data) {
  try {
    fs.writeFileSync(SITE_DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local site data:', err.message);
  }
}

function readLocalMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Error reading local messages:', err.message);
  }
  return [];
}

function writeLocalMessages(msgs) {
  try {
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(msgs, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing local messages:', err.message);
  }
}

// In-memory active cache
let siteData = readLocalSiteData();
let messages = readLocalMessages();

// Asynchronously sync initial state with Firestore
async function initFirestoreSync() {
  if (!firestoreDb) return;
  try {
    // 1. Fetch site data from Firestore
    const configDocRef = doc(firestoreDb, 'site', 'config');
    const docSnap = await getDoc(configDocRef);
    if (docSnap.exists()) {
      const remoteData = docSnap.data();
      siteData = {
        about: typeof remoteData.about === 'string' ? remoteData.about : siteData.about,
        skills: Array.isArray(remoteData.skills) ? remoteData.skills : siteData.skills,
        services: Array.isArray(remoteData.services) ? remoteData.services : siteData.services,
        timeline: Array.isArray(remoteData.timeline) ? remoteData.timeline : siteData.timeline,
        projects: Array.isArray(remoteData.projects) ? remoteData.projects : siteData.projects,
        testimonials: Array.isArray(remoteData.testimonials) ? remoteData.testimonials : siteData.testimonials
      };
      writeLocalSiteData(siteData);
      console.log('Site data loaded from Cloud Firestore.');
    } else {
      // Seed Firestore with current site data
      await setDoc(configDocRef, { ...siteData, updatedAt: new Date().toISOString() });
      console.log('Site data initialized in Cloud Firestore.');
    }

    // 2. Fetch messages from Firestore
    const messagesCol = collection(firestoreDb, 'messages');
    const q = query(messagesCol, orderBy('createdAt', 'desc'));
    const messagesSnap = await getDocs(q);
    if (!messagesSnap.empty) {
      messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
      writeLocalMessages(messages);
      console.log(`Loaded ${messages.length} messages from Cloud Firestore.`);
    }
  } catch (err) {
    console.warn('Firestore initial sync notice (using local cache):', err.message);
  }
}

initFirestoreSync();

app.use(express.json({ limit: '10mb' }));
app.use(express.text({ type: ['text/*', 'application/json'] }));

function parseBody(req) {
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body || {};
}

// API Endpoints
app.get('/api/site-data', async (req, res) => {
  if (firestoreDb) {
    try {
      const configDoc = await getDoc(doc(firestoreDb, 'site', 'config'));
      if (configDoc.exists()) {
        siteData = configDoc.data();
        writeLocalSiteData(siteData);
      }
    } catch (err) {
      console.warn('Firestore read error (falling back to memory):', err.message);
    }
  }
  res.json(siteData);
});

async function handleSaveSiteData(req, res) {
  const payload = parseBody(req);
  if (payload && typeof payload === 'object') {
    siteData = {
      about: typeof payload.about === 'string' ? payload.about : siteData.about,
      skills: Array.isArray(payload.skills) ? payload.skills : siteData.skills,
      services: Array.isArray(payload.services) ? payload.services : siteData.services,
      timeline: Array.isArray(payload.timeline) ? payload.timeline : siteData.timeline,
      projects: Array.isArray(payload.projects) ? payload.projects : siteData.projects,
      testimonials: Array.isArray(payload.testimonials) ? payload.testimonials : siteData.testimonials
    };

    // Save locally
    writeLocalSiteData(siteData);

    // Save permanently in Firestore
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'site', 'config'), {
          ...siteData,
          updatedAt: new Date().toISOString()
        });
        console.log('Site data permanently stored in Firestore.');
      } catch (err) {
        console.error('Failed to sync site data to Firestore:', err.message);
      }
    }

    return res.json(siteData);
  }
  res.status(400).json({ error: 'Invalid site data payload' });
}

app.put('/api/site-data', handleSaveSiteData);
app.post('/api/site-data', handleSaveSiteData);

app.get('/api/messages', async (req, res) => {
  if (firestoreDb) {
    try {
      const messagesCol = collection(firestoreDb, 'messages');
      const messagesSnap = await getDocs(query(messagesCol, orderBy('createdAt', 'desc')));
      if (!messagesSnap.empty) {
        messages = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() }));
        writeLocalMessages(messages);
      }
    } catch (err) {
      console.warn('Firestore message read notice:', err.message);
    }
  }
  res.json(messages);
});

app.post('/api/messages', async (req, res) => {
  const body = parseBody(req);
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

  messages.unshift(newMessage);
  writeLocalMessages(messages);

  if (firestoreDb) {
    try {
      await setDoc(doc(firestoreDb, 'messages', id), newMessage);
      console.log(`Message ${id} permanently saved in Firestore.`);
    } catch (err) {
      console.error('Failed to save message to Firestore:', err.message);
    }
  }

  res.status(201).json({
    ...newMessage,
    emailSent: false,
    emailError: 'Saved to Firestore & Admin Dashboard'
  });
});

app.delete('/api/messages/:id', async (req, res) => {
  const { id } = req.params;
  messages = messages.filter((m) => m.id !== id);
  writeLocalMessages(messages);

  if (firestoreDb) {
    try {
      await deleteDoc(doc(firestoreDb, 'messages', id));
      console.log(`Message ${id} deleted from Firestore.`);
    } catch (err) {
      console.error('Failed to delete message from Firestore:', err.message);
    }
  }

  res.json({ success: true, id });
});

app.delete('/api/messages', async (req, res) => {
  const idsToDelete = messages.map(m => m.id);
  messages = [];
  writeLocalMessages(messages);

  if (firestoreDb) {
    try {
      for (const id of idsToDelete) {
        await deleteDoc(doc(firestoreDb, 'messages', id));
      }
      console.log('All messages cleared from Firestore.');
    } catch (err) {
      console.error('Failed to clear messages from Firestore:', err.message);
    }
  }

  res.json({ success: true });
});

// Provide public Firebase config endpoint for client if needed
app.get('/api/firebase-config', (req, res) => {
  res.json({
    projectId: firebaseConfig?.projectId || '',
    firestoreDatabaseId: firebaseConfig?.firestoreDatabaseId || '',
    storageBucket: firebaseConfig?.storageBucket || ''
  });
});

// Serve static files
app.use(express.static(__dirname));

app.get('/all-projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'all-projects.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
});
