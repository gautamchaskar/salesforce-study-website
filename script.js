/* DATA STRUCTURE (unchanged) */
const curriculum = {
  admin: {
    title: "Administrator",
    description: "Config & Security",
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
            quiz: []
          }
        ]
      }
    ]
  },
  developer: {
    title: "Developer Interview Prep",
    description: "Ace your PD1 & technical interviews.",
    color: "#00CFC8",
    modules: [
      {
        id: "dev-interview-1",
        title: "Apex Fundamentals & Order of Execution",
        description: "Master the transaction lifecycle.",
        units: [
          {
            id: "dev-int-1",
            title: "Order of Execution",
            type: "theory",
            mindmap: `
# Order of Execution
## 1. Init
- Load original record
- Load new record values
## 2. System Validation
- Required fields
- Format checks
## 3. Before Triggers
- Update fields
## 4. Custom Validation
- Validation Rules
## 5. Save
- Record saved to DB (but not committed)
## 6. After Triggers
- Access ID etc.
## 7. Assignment Rules
## 8. Auto-Response
## 9. Workflow Rules
## 10. Process & Flow
## 11. Commit
            `,
            content: `
# Salesforce Order of Execution
Understanding the order of execution is critical for debugging and avoiding recursion.

### The Golden Rules
1. **Validation Rules** run *after* Before Triggers but *before* After Triggers.
2. **System Validation** happens first (e.g., max length, required fields).
3. **Commit** happens last.

### Mnemonics
"Very Big Cats Scratched A White Post"
(Validation, Before, CustomVal, Save, After, Workflow, Process)
            `,
            qa: [
              { q: "What is the order of execution?", a: "1. System Validation, 2. Before Triggers, 3. Custom Validation, 4. Save to DB, 5. After Triggers, 6. Assignment Rules, 7. Workflow/Flow, 8. Commit." },
              { q: "Can you modify a record in an After Trigger?", a: "No, the record is read-only in context. You must perform a DML update." },
              { q: "What happens if a DML error occurs?", a: "The entire transaction is rolled back." }
            ],
            quiz: [{ question: "Which runs first?", options: ["After Triggers", "Validation Rules", "Before Triggers"], correctAnswer: 1, explanation: "Before Triggers run before Custom Validation rules (but after System Validation)." }]
          },
          {
            id: "dev-int-2",
            title: "Governor Limits",
            type: "theory",
            mindmap: `
# Governor Limits
## SOQL
- Sync: 100 queries
- Async: 200 queries
- Rows: 50,000
## DML
- Statements: 150
- Records: 10,000
## CPU Time
- Sync: 10s
- Async: 60s
## Heap Size
- Sync: 6MB
- Async: 12MB
            `,
            content: `
# Governor Limits
Multi-tenancy means resources are shared. Limits prevent one process from monopolizing the CPU.

### Key Limits (Synchronous)
* **SOQL Queries**: 100
* **DML Statements**: 150
* **Total Records Retrieved**: 50,000
* **CPU Time**: 10,000ms (10 seconds)
            `,
             qa: [
              { q: "What is the SOQL query limit?", a: "100 queries for synchronous transactions." },
              { q: "How do you bypass the 50k row limit?", a: "Use a SOQL For Loop or Batch Apex." },
              { q: "What is the heap size limit?", a: "6MB for synchronous, 12MB for asynchronous." }
            ],
            quiz: []
          }
        ]
      },
      {
        id: "top-lwc",
        title: "LWC Interview Questions",
        description: "Lifecycle, Communication, and DOM.",
        units: [
            {
                id: "lwc-1",
                title: "LWC Lifecycle",
                type: "theory",
                mindmap: `
# LWC Lifecycle
## Mount
- constructor()
- connectedCallback()
- render()
- renderedCallback()
## Update
- render()
- renderedCallback()
## Unmount
- disconnectedCallback()
## Error
- errorCallback()
                `,
                content: `
# LWC Lifecycle Hooks
* **constructor()**: Init. Don't access child elements here.
* **connectedCallback()**: Component inserted into DOM. Interact with host.
* **renderedCallback()**: After template is rendered. Careful with infinite loops!
* **disconnectedCallback()**: Removed from DOM. Cleanup listeners.
                `,
                qa: [
                    { q: "When should you call Apex?", a: "In connectedCallback() or via Wire/Getter." },
                    { q: "Can you change props in the child component?", a: "No, props are read-only (@api). Use events to ask parent to change them." }
                ],
                quiz: []
            }
        ]
      }
    ]
  },
  qa: { title: "QA Engineer", description: "Testing Strategies", color: "#FFB700", modules: [] },
  ba: { title: "Analyst", description: "Requirements", color: "#FF5D5D", modules: [] },
  architect: { title: "Architect", description: "System Design", color: "#9059FF", modules: [] }
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
    if (!role) return document.body.innerHTML = '<div class="container" style="margin-top:2rem"><h1>Role Not Found</h1><a href="index.html" class="btn btn-secondary">Go Home</a></div>';

    document.getElementById('role-title').innerText = role.title;
    document.getElementById('role-desc').innerText = role.description;
    
    const icons = { admin: 'shield', developer: 'code', qa: 'check-circle', ba: 'briefcase', architect: 'layers' };
    const iconContainer = document.getElementById('role-icon-container');
    if (iconContainer) {
        // Light Theme: subtle tint
        iconContainer.style.backgroundColor = 'var(--bg-subtle)';
        iconContainer.style.color = role.color; // Use brand color for icon
        iconContainer.innerHTML = \`<i data-lucide="\${icons[roleId] || 'star'}" width="32" height="32"></i>\`;
        lucide.createIcons({ root: iconContainer });
    }

    const list = document.getElementById('modules-list');
    role.modules.forEach(mod => {
        const el = document.createElement('div');
        el.className = 'card'; // New Card Class
        el.style.padding = '1.5rem';
        el.style.cursor = 'pointer';
        el.onclick = () => window.location.href = \`module.html?role=\${roleId}&module=\${mod.id}\`;
        
        el.innerHTML = \`
            <div class="flex justify-between items-center">
                <div>
                   <h3>\${mod.title}</h3>
                   <p style="margin:0">\${mod.description}</p>
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
    // Back link handled by HTML
    
    const list = document.getElementById('units-list');
    mod.units.forEach((u, i) => {
        const item = document.createElement('div');
        item.innerText = u.title;
        item.className = 'sidebar-item'; // New Sidebar Class
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

    // UI Active State
    document.querySelectorAll('.sidebar-item').forEach((el, i) => {
        if (i === index) el.classList.add('active');
        else el.classList.remove('active');
    });

    document.getElementById('unit-counter').innerText = \`Unit \${index + 1} / \${mod.units.length}\`;
    document.getElementById('unit-title').innerText = unit.title;
    
    // Default to Learn Tab
    switchTab('learn');

    // 1. Render Markdown
    document.getElementById('markdown-content').innerHTML = marked.parse(unit.content);

    // 2. Render Visualization (Mindmap)
    if (window.markmap && unit.mindmap) {
        const transformer = new markmap.Transformer();
        const { root } = transformer.transform(unit.mindmap);
        const mm = markmap.Markmap.create('#markmap', null, root);
        window.currentMarkmap = mm; 
    } else {
        document.getElementById('markmap').innerHTML = ''; 
    }

    // 3. Render Practice (Q&A)
    const qaContainer = document.getElementById('qa-container');
    qaContainer.innerHTML = '';
    if (unit.qa) {
        unit.qa.forEach(qaItem => {
            const el = document.createElement('div');
            el.className = 'accordion-item';
            el.innerHTML = \`
                <div class="accordion-header" onclick="this.parentElement.classList.toggle('active')">
                    \${qaItem.q}
                    <i data-lucide="chevron-down" width="16"></i>
                </div>
                <div class="accordion-content">
                    <p>\${qaItem.a}</p>
                </div>
            \`;
            qaContainer.appendChild(el);
        });
    }

    // Quiz
    const quizDiv = document.getElementById('quiz-container');
    quizDiv.style.display = 'none';
    if (unit.quiz && unit.quiz.length) {
        quizDiv.style.display = 'block';
        const q = unit.quiz[0];
        document.getElementById('quiz-content').innerHTML = \`
            <h3 style="margin-bottom:1rem">\${q.question}</h3>
            <div class="flex flex-col gap-2">
                \${q.options.map((o, i) => \`<label style="padding:0.75rem; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); display:block; cursor:pointer"><input type="radio" name="q" value="\${i}"> <span style="margin-left:0.5rem">\${o}</span></label>\`).join('')}
            </div>
            <button class="btn btn-primary" style="margin-top:1rem" onclick="checkQuiz(\${q.correctAnswer})">Submit Answer</button>
            <div id="quiz-result" style="margin-top:1rem; font-weight:600"></div>
        \`;
    }

    // Playground embedded
    const playground = document.getElementById('playground-container');
    playground.innerHTML = ''; 
    if (unit.type === 'code') {
        playground.innerHTML = \`
            <div class="code-playground card-static">
                <div style="padding:0.5rem 1rem; border-bottom:1px solid var(--border-subtle); display:flex; justify-content:space-between; align-items:center; background: #f8fafc">
                    <span style="font-size:0.8rem; font-weight:600; color:var(--text-secondary)">APEX Playground</span>
                    <button class="btn btn-primary" onclick="runCode()" style="padding:0.25rem 0.75rem; font-size:0.75rem">Run</button>
                </div>
                <div id="monaco-host" style="height: 300px;"></div>
                <div id="playground-output" style="display:none; padding:1rem; background:#0f172a; color:white; font-family:monospace; border-top:1px solid var(--border-subtle)"></div>
            </div>
        \`;
        require.config({ paths: { 'vs': 'https://cdn.jsdelivr.net/npm/monaco-editor@0.33.0/min/vs' }});
        require(['vs/editor/editor.main'], function() {
            if (editorInstance) editorInstance.dispose();
            const initialCode = (unit.content.match(/\`\`\`apex\\n([\s\S]*?)\`\`\`/)||[])[1] || '// Code here';
            editorInstance = monaco.editor.create(document.getElementById('monaco-host'), {
                value: initialCode, language: 'java', theme: 'vs-light', automaticLayout: true, minimap: {enabled: false}
            });
        });
    }

    // Nav Buttons
    const nextBtn = document.getElementById('next-btn');
    nextBtn.innerHTML = index === mod.units.length - 1 ? 'Finish Module <i data-lucide="check" width="16"></i>' : 'Next Unit <i data-lucide="arrow-right" width="16"></i>';
    nextBtn.onclick = () => {
         if (index < mod.units.length - 1) loadUnit(roleId, moduleId, index + 1);
         else window.location.href = \`dashboard.html?role=\${roleId}\`;
    };
    
    lucide.createIcons();
}

window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-view').forEach(el => el.style.display = 'none');
    document.getElementById(\`view-\${tabName}\`).style.display = 'block';
    
    document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
    document.getElementById(\`tab-\${tabName}\`)?.classList.add('active');

    if (tabName === 'visualize' && window.currentMarkmap) {
        window.currentMarkmap.fit(); 
    }
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
     const resDiv = document.getElementById('quiz-result');
     if(isCorrect) {
         resDiv.innerHTML = '<span style="color:var(--primary)">Correct! Great job.</span>';
     } else {
         resDiv.innerHTML = '<span style="color:#ef4444">Incorrect. Try again.</span>';
     }
}
