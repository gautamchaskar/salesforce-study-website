/* DATA */
const curriculum = {
  admin: {
    title: "Administrator",
    description: "Master configuration, security, and automation.",
    color: "#009EDB",
    modules: [
      {
        id: "admin-m1",
        title: "Module 1: Salesforce Fundamentals",
        description: "Core concepts, Multi-tenant architecture, and Data Model.",
        units: [
          {
            id: "admin-m1-u1",
            title: "The Salesforce Platform",
            type: "theory",
            content: `
# Welcome to Salesforce
Salesforce is a cloud-based CRM platform providing a single view of your customers.

### Key Concepts
* **Multi-tenancy**: Shared infrastructure (building) with private data (apartment).
* **Metadata-Driven**: Data stored separately from customizations.
            `,
            quiz: [{
                question: "What is Multi-tenancy?",
                options: ["Own server", "Shared infrastructure", "License type", "Security protocol"],
                correctAnswer: 1,
                explanation: "Tenants share infrastructure but data is isolated."
            }]
          },
          {
            id: "admin-m1-u2",
            title: "Standard Objects",
            type: "theory",
            content: `
# Standard Objects
Out-of-the-box tables for common business data.

1. **Lead**: Potential customer.
2. **Account**: Organization.
3. **Contact**: Individual person.
4. **Opportunity**: Potential deal.
            `,
            quiz: [{
                question: "Which object represents a potential customer?",
                options: ["Account", "Contact", "Lead", "Opportunity"],
                correctAnswer: 2,
                explanation: "A Lead is an unqualified potential customer."
            }]
          }
        ]
      }
    ]
  },
  developer: {
    title: "Developer",
    description: "Build custom apps with Apex, LWC, and APIs.",
    color: "#00CFC8",
    modules: [
      {
        id: "dev-m1",
        title: "Module 1: Apex Basics",
        description: "Intro to Apex programming language.",
        units: [
          {
            id: "dev-m1-u1",
            title: "Introduction to Apex",
            type: "code",
            content: `
# Hello Apex
Apex is a strongly typed, object-oriented language for Salesforce.

### Syntax
Similar to Java.

\`\`\`apex
public class HelloWorld {
    public static void sayHello() {
        System.debug('Hello, Developer!');
    }
}
\`\`\`
            `,
            quiz: []
          }
        ]
      }
    ]
  },
  qa: { title: "QA Engineer", description: "Rigorous testing strategies.", color: "#FFB700", modules: [] },
  ba: { title: "Business Analyst", description: "Requirements gathering.", color: "#FF5D5D", modules: [] },
  architect: { title: "Architect", description: "Scalable solutions.", color: "#9059FF", modules: [] }
};


/* APP LOGIC */
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) lucide.createIcons();
    
    const path = window.location.pathname;
    const params = new URLSearchParams(window.location.search);

    if (path.includes('dashboard.html')) {
        renderDashboard(params.get('role'));
    } else if (path.includes('module.html')) {
        renderModule(params.get('role'), params.get('module'));
    }
});

function renderDashboard(roleId) {
    const role = curriculum[roleId];
    if (!role) return document.body.innerHTML = '<div class="container"><h1>Role Not Found</h1><a href="index.html">Home</a></div>';

    document.getElementById('role-title').innerText = role.title;
    document.getElementById('role-desc').innerText = role.description;
    
    const icons = { admin: 'shield', developer: 'code', qa: 'check-circle', ba: 'briefcase', architect: 'layers' };
    const iconContainer = document.getElementById('role-icon-container');
    if (iconContainer) {
        iconContainer.style.backgroundColor = role.color + '20';
        iconContainer.innerHTML = \`<i data-lucide="\${icons[roleId] || 'star'}" color="\${role.color}" width="32" height="32"></i>\`;
        lucide.createIcons({ root: iconContainer });
    }

    const list = document.getElementById('modules-list');
    role.modules.forEach(mod => {
        const el = document.createElement('div');
        el.className = 'glass-panel card-hover';
        el.style.padding = '1.5rem';
        el.style.marginBottom = '1rem';
        el.style.cursor = 'pointer';
        el.onclick = () => window.location.href = \`module.html?role=\${roleId}&module=\${mod.id}\`;
        
        el.innerHTML = \`
            <div class="flex justify-between items-center">
                <div>
                   <h3>\${mod.title}</h3>
                   <p>\${mod.description}</p>
                </div>
                <button class="btn btn-secondary">Start</button>
            </div>
        \`;
        list.appendChild(el);
    });
}

function renderModule(roleId, moduleId) {
    const role = curriculum[roleId];
    const mod = role?.modules.find(m => m.id === moduleId);
    if (!mod) return;

    document.getElementById('module-title-sidebar').innerText = mod.title;
    document.getElementById('module-back-link').onclick = () => window.location.href = \`dashboard.html?role=\${roleId}\`;
    
    // Sidebar
    const list = document.getElementById('units-list');
    mod.units.forEach((u, i) => {
        const item = document.createElement('div');
        item.innerText = u.title;
        item.style.padding = '0.5rem';
        item.style.cursor = 'pointer';
        item.style.borderRadius = '6px';
        item.id = \`unit-item-\${i}\`;
        item.onclick = () => loadUnit(roleId, moduleId, i);
        list.appendChild(item);
    });

    loadUnit(roleId, moduleId, 0);
}

let editorInstance = null;

function loadUnit(roleId, moduleId, index) {
    const role = curriculum[roleId];
    const mod = role.modules.find(m => m.id === moduleId);
    const unit = mod.units[index];
    if (!unit) return;

    // UI
    document.querySelectorAll('#units-list > div').forEach((el, i) => {
        el.style.background = i === index ? 'rgba(255,255,255,0.1)' : 'transparent';
        el.style.color = i === index ? '#fff' : 'var(--text-secondary)';
    });

    document.getElementById('unit-counter').innerText = \`Unit \${index + 1} / \${mod.units.length}\`;
    document.getElementById('unit-title').innerText = unit.title;
    
    // Content
    const mdContainer = document.getElementById('markdown-content');
    mdContainer.innerHTML = marked.parse(unit.content);

    // Playground
    const playground = document.getElementById('playground-container');
    playground.innerHTML = ''; 
    if (unit.type === 'code') {
        playground.innerHTML = \`
            <div class="code-playground glass-panel">
                <div class="playground-toolbar">
                    <span>APEX EDITOR</span>
                    <button class="btn btn-primary" onclick="runCode()" style="padding:0.4rem 0.8rem; height:auto; font-size:0.8rem">Run</button>
                </div>
                <div id="monaco-host" style="height: 300px;"></div>
                <div id="playground-output" class="playground-output" style="display:none"></div>
            </div>
        \`;
        
        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            if (editorInstance) editorInstance.dispose();
            const initialCode = (unit.content.match(/\`\`\`apex\\n([\s\S]*?)\`\`\`/)||[])[1] || '// Code here';
            editorInstance = monaco.editor.create(document.getElementById('monaco-host'), {
                value: initialCode, language: 'java', theme: 'vs-dark', automaticLayout: true, minimap: {enabled: false}
            });
        });
    }

    // Quiz
    const quizDiv = document.getElementById('quiz-container');
    quizDiv.style.display = 'none';
    if (unit.quiz && unit.quiz.length) {
        quizDiv.style.display = 'block';
        const q = unit.quiz[0];
        document.getElementById('quiz-content').innerHTML = \`
            <h3 style="font-size:1.1rem; margin-bottom:1rem">\${q.question}</h3>
            <div class="flex flex-col gap-2">
                \${q.options.map((o, i) => \`<label style="padding:0.75rem; background:rgba(255,255,255,0.05); border-radius:8px"><input type="radio" name="q" value="\${i}"> \${o}</label>\`).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top:1rem" onclick="checkQuiz(\${q.correctAnswer})">Submit</button>
            <div id="quiz-result" style="margin-top:0.5rem"></div>
        \`;
    }

    // Nav Buttons
    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerHTML = index === mod.units.length - 1 ? 'Finish <i data-lucide="check"></i>' : 'Next <i data-lucide="chevron-right"></i>';
    nextBtn.onclick = () => {
         if (index < mod.units.length - 1) loadUnit(roleId, moduleId, index + 1);
         else window.location.href = \`dashboard.html?role=\${roleId}\`;
    };
    
    lucide.createIcons();
}

window.runCode = function() {
    if (!editorInstance) return;
    const output = document.getElementById('playground-output');
    output.style.display = 'block';
    output.innerText = '> Running...';
    setTimeout(() => {
        const val = editorInstance.getValue();
        const debug = (val.match(/System\.debug\('(.*?)'\)/)||[])[1];
        output.innerText = debug ? \`> DEBUG|\${debug}\\n> Success\` : '> Success: Executed.';
    }, 600);
}

window.checkQuiz = function(ans) {
     const selected = document.querySelector('input[name="q"]:checked');
     if (!selected) return;
     const isCorrect = parseInt(selected.value) === ans;
     document.getElementById('quiz-result').innerHTML = isCorrect ? '<span style="color:var(--color-success)">Correct!</span>' : '<span style="color:var(--color-danger)">Incorrect</span>';
}
